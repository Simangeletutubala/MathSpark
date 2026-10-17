import { Difficulty, BuddyProfile, Operation, Question, StruggledQuestion, Term } from '../types';
import { db, auth, doc, getDoc, setDoc, updateDoc, handleFirestoreError, OperationType, collection, query, where, getDocs, addDoc } from '../firebase';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  correct: number;
  total: number;
  starsEarned: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'buddy' | 'parent' | 'student'; // Added 'student' for legacy support
  buddyData?: BuddyProfile;
  studentData?: BuddyProfile; // Added for legacy support
  parentEmail?: string;
  buddyUids?: string[];
  childrenUids?: string[]; // Added for legacy support
  dailyStats?: DailyStat[]; // Track last 14 days or so
}

export class ProgressService {
  private static profileCache: Record<string, { data: UserProfile; timestamp: number }> = {};
  private static readonly CACHE_TTL = 30000; // 30 seconds

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    // Check memory cache
    const cached = this.profileCache[uid];
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const path = `users/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        // Map legacy student data to buddy data
        if (data.role === 'student') data.role = 'buddy';
        if (data.studentData && !data.buddyData) {
          data.buddyData = data.studentData;
        }
        if (data.buddyData && !data.buddyData.topicPerformance) {
          data.buddyData.topicPerformance = {};
        }
        // Map legacy childrenUids to buddyUids
        if (data.childrenUids && !data.buddyUids) {
          data.buddyUids = data.childrenUids;
        }

        // Update caches
        this.profileCache[uid] = { data, timestamp: Date.now() };
        localStorage.setItem(`user_profile_${uid}`, JSON.stringify(data));

        return data;
      }
      return null;
    } catch (error) {
      // Report for system diagnosis while allowing fallback
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (jsonError) {
        // The platform expects a thrown JSON error for diagnosis
        // We log it so the user sees it in their console, and then fallback
        console.error("Firestore error reported:", (jsonError as Error).message);
      }
      
      // Fallback to localStorage on error
      const stored = localStorage.getItem(`user_profile_${uid}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      
      return null;
    }
  }

  static getLocalProfile(uid: string): UserProfile | null {
    const stored = localStorage.getItem(`user_profile_${uid}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  static async createUserProfile(uid: string, email: string, role: 'buddy' | 'parent', name?: string, avatar?: string): Promise<UserProfile> {
    const path = `users/${uid}`;
    const newUser: UserProfile = {
      uid,
      email,
      role,
    };

    if (role === 'buddy') {
      newUser.buddyData = {
        name: name || 'Buddy',
        avatar: avatar || '🦁',
        stars: 0,
        streak: 0,
        bestStreak: 0,
        difficulty: Difficulty.EASY,
        totalQuestions: 0,
        correctAnswers: 0,
        topicPerformance: {},
        badges: [],
        weakAreas: this.getDefaultWeakAreas(),
        unlockedAvatars: ['🦁', '🐘', '🦏', '🐆', '🐃', '🦓'],
        lastPlayedDate: new Date().toISOString().split('T')[0],
        lastDailyChallengeDate: '',
        dailyChallengeStreak: 0,
        dailyLearningStreak: 1,
        dailyGoal: 5,
        questionsToday: 0,
        enabledOperations: Object.values(Operation),
        currentTerm: Term.TERM_1,
        isPro: false,
        parentPassword: '1234',
      };
    } else {
      newUser.buddyUids = [];
      // Find buddies linked to this parent email
      const buddies = await this.findBuddiesByParentEmail(email);
      newUser.buddyUids = buddies.map(c => c.uid);
    }

    try {
      await setDoc(doc(db, 'users', uid), newUser);
      // Update caches
      localStorage.setItem(`user_profile_${uid}`, JSON.stringify(newUser));
      this.profileCache[uid] = { data: newUser, timestamp: Date.now() };
      return newUser;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  }

  static async findBuddiesByParentEmail(email: string): Promise<UserProfile[]> {
    const path = 'users';
    try {
      const q = query(collection(db, 'users'), where('parentEmail', '==', email), where('role', '==', 'buddy'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  static async updateBuddyProfile(uid: string, updates: Partial<BuddyProfile>): Promise<void> {
    const path = `users/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        if (userData.role === 'buddy' && userData.buddyData) {
          const updatedBuddyData = { ...userData.buddyData, ...updates };
          await updateDoc(doc(db, 'users', uid), { buddyData: updatedBuddyData });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async linkParent(buddyUid: string, parentEmail: string): Promise<void> {
    const path = `users/${buddyUid}`;
    try {
      await updateDoc(doc(db, 'users', buddyUid), { parentEmail });
      
      // Also update the parent if they exist
      const q = query(collection(db, 'users'), where('email', '==', parentEmail), where('role', '==', 'parent'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const parentDoc = querySnapshot.docs[0];
        const parentData = parentDoc.data() as UserProfile;
        const buddyUids = parentData.buddyUids || parentData.childrenUids || [];
        if (!buddyUids.includes(buddyUid)) {
          buddyUids.push(buddyUid);
          await updateDoc(doc(db, 'users', parentDoc.id), { buddyUids });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async linkBuddyByEmail(parentUid: string, buddyEmail: string): Promise<void> {
    const path = 'users';
    try {
      // 1. Find the buddy by email
      const q = query(collection(db, 'users'), where('email', '==', buddyEmail), where('role', '==', 'buddy'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Buddy not found with that email.');
      }

      const buddyDoc = querySnapshot.docs[0];
      const buddyUid = buddyDoc.id;

      // 2. Get the parent's email
      const parentDoc = await getDoc(doc(db, 'users', parentUid));
      if (!parentDoc.exists()) {
        throw new Error('Parent profile not found.');
      }
      const parentData = parentDoc.data() as UserProfile;
      const parentEmail = parentData.email;

      // 3. Update the buddy's profile with parentEmail
      await updateDoc(doc(db, 'users', buddyUid), { parentEmail });

      // 4. Update the parent's profile with buddyUid
      const buddyUids = parentData.buddyUids || parentData.childrenUids || [];
      if (!buddyUids.includes(buddyUid)) {
        buddyUids.push(buddyUid);
        await updateDoc(doc(db, 'users', parentUid), { buddyUids });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  }

  static isDailyChallengeAvailable(profile: BuddyProfile | null): boolean {
    if (!profile) return false;
    const today = new Date().toISOString().split('T')[0];
    return profile.lastDailyChallengeDate !== today;
  }

  private static getDefaultWeakAreas(): Record<Operation, number> {
    const weakAreas: any = {};
    Object.values(Operation).forEach(op => {
      weakAreas[op] = 0;
    });
    return weakAreas as Record<Operation, number>;
  }

  static async updateProgress(uid: string, isCorrect: boolean, operation: Operation, currentUser: UserProfile, question?: Question, userAnswer?: string): Promise<UserProfile> {
    if (!currentUser.buddyData) throw new Error('Buddy data missing');
    const profile = { ...currentUser.buddyData };
    profile.totalQuestions += 1;

    // Track daily learning streak correctly
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastPlayedDate !== today) {
      profile.questionsToday = 0; // Reset daily count on new day
      if (profile.lastPlayedDate) {
        const lastDate = new Date(profile.lastPlayedDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (profile.lastPlayedDate === yesterdayStr) {
          profile.dailyLearningStreak = (profile.dailyLearningStreak || 0) + 1;
        } else {
          profile.dailyLearningStreak = 1;
        }
      } else {
        profile.dailyLearningStreak = 1;
      }
      profile.lastPlayedDate = today;
    }
    
    // Increment daily question count
    profile.questionsToday = (profile.questionsToday || 0) + 1;

    if (isCorrect) {
      profile.correctAnswers += 1;
      profile.stars += 5;
      profile.streak += 1;
      if (profile.streak > profile.bestStreak) {
        profile.bestStreak = profile.streak;
      }
      
      // Update topic stats
      const topicStat = profile.topicPerformance[operation] || { total: 0, correct: 0 };
      topicStat.total += 1;
      topicStat.correct += 1;
      profile.topicPerformance[operation] = topicStat;

      // Award badges
      if (profile.stars >= 50 && !profile.badges.includes('Star Collector')) {
        profile.badges.push('Star Collector');
      }
      if (profile.streak >= 5 && !profile.badges.includes('On Fire')) {
        profile.badges.push('On Fire');
      }
      if (profile.totalQuestions >= 20 && !profile.badges.includes('Math Explorer')) {
        profile.badges.push('Math Explorer');
      }
    } else {
      profile.streak = 0;
      profile.weakAreas[operation] = (profile.weakAreas[operation] || 0) + 1;
      
      // Update topic stats even for incorrect
      const topicStat = profile.topicPerformance[operation] || { total: 0, correct: 0 };
      topicStat.total += 1;
      profile.topicPerformance[operation] = topicStat;

      // Record struggled question
      if (question && userAnswer !== undefined) {
        await this.recordStruggledQuestion(uid, question, userAnswer);
      }
    }

    // Update Daily Stats at user root
    const stats = currentUser.dailyStats || [];
    const todayStatIndex = stats.findIndex(s => s.date === today);
    if (todayStatIndex >= 0) {
      stats[todayStatIndex].total += 1;
      if (isCorrect) {
        stats[todayStatIndex].correct += 1;
        stats[todayStatIndex].starsEarned += 5;
      }
    } else {
      stats.push({
        date: today,
        total: 1,
        correct: isCorrect ? 1 : 0,
        starsEarned: isCorrect ? 5 : 0
      });
    }
    // Keep only last 14 days
    const prunedStats = stats.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);

    const updatedUser = {
      ...currentUser,
      buddyData: profile,
      dailyStats: prunedStats
    };

    // Update memory cache immediately
    this.profileCache[uid] = { data: updatedUser, timestamp: Date.now() };
    localStorage.setItem(`user_profile_${uid}`, JSON.stringify(updatedUser));

    try {
      if (uid && !uid.startsWith('guest_')) {
        await updateDoc(doc(db, 'users', uid), { 
          buddyData: profile,
          dailyStats: prunedStats
        });
      }
    } catch (e) {
      console.warn("Could not sync with cloud, saved locally:", e);
    }
    return updatedUser;
  }

  static async recordStruggledQuestion(buddyUid: string, question: Question, userAnswer: string): Promise<void> {
    const path = 'struggled_questions';
    try {
      const struggledQuestion: Omit<StruggledQuestion, 'id'> = {
        buddyUid,
        questionText: question.text,
        userAnswer,
        correctAnswer: question.answer.toString(),
        operation: question.operation,
        timestamp: new Date().toISOString(),
        explanation: question.explanation,
      };
      await addDoc(collection(db, 'struggled_questions'), struggledQuestion);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  static async getStruggledQuestions(buddyUid: string): Promise<StruggledQuestion[]> {
    const path = 'struggled_questions';
    try {
      const q = query(collection(db, 'struggled_questions'), where('buddyUid', '==', buddyUid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StruggledQuestion))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  static async completeDailyChallenge(uid: string): Promise<BuddyProfile | null> {
    const user = await this.getUserProfile(uid);
    if (!user || user.role !== 'buddy' || !user.buddyData) return null;

    const profile = { ...user.buddyData };
    const today = new Date().toISOString().split('T')[0];
    profile.lastDailyChallengeDate = today;
    profile.stars += 50;
    profile.dailyChallengeStreak += 1;
    
    if (profile.dailyChallengeStreak >= 7 && !profile.badges.includes('Weekly Warrior')) {
      profile.badges.push('Weekly Warrior');
    }
    
    await this.updateBuddyProfile(uid, profile);
    return profile;
  }

  static async unlockAvatar(uid: string, avatar: string, cost: number): Promise<boolean> {
    const user = await this.getUserProfile(uid);
    if (!user || user.role !== 'buddy' || !user.buddyData) return false;

    const profile = { ...user.buddyData };
    if (profile.stars >= cost && !profile.unlockedAvatars.includes(avatar)) {
      profile.stars -= cost;
      profile.unlockedAvatars.push(avatar);
      await this.updateBuddyProfile(uid, profile);
      return true;
    }
    return false;
  }
}
