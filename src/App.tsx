import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  User as UserIcon, 
  LayoutDashboard, 
  Play, 
  LogOut, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  ShoppingBag,
  Sparkles,
  Lock,
  UserCheck,
  Users,
  MessageCircle,
  Share2,
  Volume2
} from 'lucide-react';
import { Difficulty, BuddyProfile, Question, Operation, SessionState, Term } from './types';
import { ProgressService, UserProfile } from './services/ProgressService';
import { MathService } from './services/MathService';
import { SoundService } from './services/SoundService';
import { speechService } from './services/SpeechService';
import { QuestionCard } from './components/QuestionCard';
import { ScoreBoard } from './components/ScoreBoard';
import { RewardBadge } from './components/RewardBadge';
import { ProgressBar } from './components/ProgressBar';
import { Buddy } from './components/Buddy';
import { AvatarShop } from './components/AvatarShop';
import { ParentPortal } from './components/ParentPortal';
import { TopicSelector } from './components/TopicSelector';
import { MultiplicationTable } from './components/MultiplicationTable';
import { DivisionTable } from './components/DivisionTable';
import { LandingPage } from './components/LandingPage';
import { Logo } from './components/ui/Logo';
import { MathLoader } from './components/ui/LoadingStates';
import { Guide } from './components/Guide';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, sendPasswordResetEmail } from './firebase';

import { SessionSummary } from './components/SessionSummary';
import { FeedbackModal } from './components/FeedbackModal';
import { DailyGoalBanner } from './components/DailyGoalBanner';

export const ViewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -15, scale: 0.98 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loginRole, setLoginRole] = useState<'buddy' | 'parent' | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [view, setView] = useState<'welcome' | 'practice' | 'dashboard' | 'shop' | 'daily' | 'parent' | 'topics' | 'multiplication-table' | 'division-table' | 'role-selection' | 'summary'>('welcome');
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [session, setSession] = useState<SessionState>({ correctInARow: 0, wrongInARow: 0 });
  const [dailyCount, setDailyCount] = useState(0);
  const [practiceTopic, setPracticeTopic] = useState<Operation | 'all'>('all');
  const [tutorMessage, setTutorMessage] = useState<{ text: string, type: 'up' | 'down' } | null>(null);
  const [seenQuestionKeys, setSeenQuestionKeys] = useState<Set<string>>(new Set());
  const [guideMsg, setGuideMsg] = useState<string>('');

  useEffect(() => {
    if (view === 'welcome' && userProfile?.buddyData) {
      setGuideMsg(`Hi ${userProfile.buddyData.name}! Ready for an adventure?`);
    } else if (view === 'topics') {
      setGuideMsg('Which math quest should we go on today?');
    }
  }, [view, userProfile]);

  // Session limits and performance tracking
  const SESSION_LIMIT = 10;
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    starsEarned: 0,
    bestStreak: 0,
    currentStreak: 0
  });

  const resetSessionStats = () => {
    setSeenQuestionKeys(new Set());
    setSessionStats({
      correct: 0,
      total: 0,
      starsEarned: 0,
      bestStreak: 0,
      currentStreak: 0
    });
  };

  const generateUniqueQuestion = useCallback((difficulty: Difficulty, ops: Operation[]) => {
    let q: Question;
    let attempts = 0;
    let key: string;
    
    do {
      q = MathService.generateQuestion(difficulty, ops);
      key = MathService.getQuestionKey(q);
      attempts++;
    } while (seenQuestionKeys.has(key) && attempts < 15);
    
    setSeenQuestionKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      if (next.size > 50) {
        const first = next.values().next().value;
        if (first !== undefined) next.delete(first);
      }
      return next;
    });
    
    return q;
  }, [seenQuestionKeys]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Optimistic load from local storage
        const localData = ProgressService.getLocalProfile(currentUser.uid);
        if (localData) {
          setUserProfile(localData);
          setIsAppLoading(false);
          if (localData.role === 'parent') {
            setView('parent');
          } else if (localData.role === 'buddy') {
            setView('welcome');
          }
        }

        try {
          const profile = await ProgressService.getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
            if (profile.role === 'parent') {
              setView('parent');
            } else if (profile.role === 'buddy') {
              setView('welcome');
            }
          } else {
            setView('role-selection');
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          // Local storage fallback is handled inside ProgressService.getUserProfile,
          // but we still see an error here if the connection is dead.
          if (!userProfile) {
            setView('welcome'); // At least stay on welcome
          }
        }
      } else {
        setUserProfile(null);
        setView('landing'); // Standardizing landing view name
        // standard landing view name check... wait, I'll stick to 'welcome' if that's what was there
        setView('welcome');
      }
      setIsAuthReady(true);
      setIsAppLoading(false);
    });

    // Handle Stripe Payment Success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const buddyUid = urlParams.get('buddyUid');
      if (buddyUid) {
        ProgressService.updateBuddyProfile(buddyUid, { isPro: true }).then(() => {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
          // Remove params from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }

    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError('');
    setResetSent(false);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // If we have a loginRole, create the profile immediately to avoid the extra step
        if (loginRole) {
          const profile = await ProgressService.createUserProfile(
            userCredential.user.uid, 
            userCredential.user.email!, 
            loginRole, 
            nameInput || userCredential.user.displayName || ''
          );
          setUserProfile(profile);
          setView(loginRole === 'parent' ? 'parent' : 'welcome');
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered! Try signing in instead.');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setAuthError('Oops! That password or email doesn\'t look right. Please check and try again!');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Your secret code needs to be at least 6 characters long.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Login is currently disabled. Please contact support.');
      } else {
        console.error('Auth failed', error);
        setAuthError('Something went wrong. Please try again in a moment!');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setView('welcome');
      setShowLogin(false);
      setLoginRole(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setAuthError('Please enter your email address first.');
      return;
    }
    setIsLoggingIn(true);
    setAuthError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setAuthError('We couldn\'t find an account with that email. Double-check your spelling!');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        console.error('Reset failed', error);
        setAuthError('We couldn\'t send the reset link. Please try again later.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpgrade = async (buddyUid: string, buddyName: string) => {
    alert(`🎉 Early Access Perk!\n\n${buddyName}'s account is currently free with all pro features unlocked during our early access phase.\n\nPremium subs will launch later in 2026. Keep questing! 🚀`);
    return;
    // Payment logic disabled during early access
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          buddyUid, 
          buddyName,
          appUrl: window.location.origin
        }),
      });
      const { id } = await response.json();
      
      // Redirect to Stripe
      const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripePublishableKey) {
        alert('Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.');
        return;
      }
      
      // We use the Stripe.js library if available, or just redirect
      // For simplicity in this environment, we'll assume the user will provide the key
      // and we'll use a standard redirect if we had the checkout URL, 
      // but Stripe sessions usually need a client-side redirect.
      // Since we can't easily add a script tag here, we'll use the session URL if returned.
      // Let's update server.ts to return the URL instead of just ID.
      
      // Wait, I'll update server.ts in the next step. For now, let's assume it returns { url }.
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Upgrade failed', error);
    }
  };

  const handleRoleSelection = async (role: 'buddy' | 'parent') => {
    if (!user) return;
    const profile = await ProgressService.createUserProfile(user.uid, user.email!, role, user.displayName || '');
    setUserProfile(profile);
    if (role === 'buddy') {
      setView('welcome');
    } else {
      setView('parent');
    }
  };

  const profile = userProfile?.buddyData || null;

  const handleStartPractice = useCallback((specificTopic?: Operation) => {
    if (!profile) return;
    resetSessionStats();
    
    if (specificTopic === Operation.DIVISION_TABLE) {
      setView('division-table');
      return;
    }

    const topic = specificTopic || 'all';
    setPracticeTopic(topic);
    
    let ops = specificTopic ? [specificTopic] : profile.enabledOperations;
    
    // Filter by term if no specific topic is selected
    if (!specificTopic) {
      const termTopics = MathService.getTopicsForTerm(profile.currentTerm || Term.TERM_1);
      ops = ops.filter(op => termTopics.includes(op));
      // Fallback if no enabled ops match the term
      if (ops.length === 0) ops = termTopics;
    }
    
    const q = generateUniqueQuestion(profile.difficulty, ops);
    setCurrentQuestion(q);
    setView('practice');
  }, [profile]);

  const handleTermChange = async (term: Term) => {
    if (!user || !profile) return;
    const updatedProfile = { ...profile, currentTerm: term };
    setUserProfile({ ...userProfile!, buddyData: updatedProfile });
    await ProgressService.updateBuddyProfile(user.uid, { currentTerm: term });
  };

  const handleStartDaily = useCallback(() => {
    if (!profile) return;
    resetSessionStats();
    setPracticeTopic('all');
    
    // Filter by term
    const termTopics = MathService.getTopicsForTerm(profile.currentTerm || Term.TERM_1);
    const ops = profile.enabledOperations.filter(op => termTopics.includes(op)) || termTopics;
    
    const q = generateUniqueQuestion(profile.difficulty, ops.length > 0 ? ops : termTopics);
    setCurrentQuestion(q);
    setDailyCount(0);
    setView('daily');
  }, [profile]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !user) return;
    const updatedProfile = { ...profile!, name: nameInput.trim(), avatar: selectedAvatar };
    await ProgressService.updateBuddyProfile(user.uid, updatedProfile);
    setUserProfile(prev => prev ? { ...prev, buddyData: updatedProfile } : null);
    SoundService.playLevelUp();
  };

  const getWeightedOperations = useCallback(() => {
    if (!profile) return [Operation.ADDITION];
    const defaultOps = profile.enabledOperations || [Operation.ADDITION];
    
    // If no struggled questions, return defaults
    if (!profile.struggledQuestions || profile.struggledQuestions.length === 0) {
      return defaultOps;
    }

    // Weighting logic
    const pool: Operation[] = [...defaultOps];
    profile.struggledQuestions.forEach(sq => {
      const weight = Math.min(sq.count, 3);
      for (let i = 0; i < weight; i++) {
        pool.push(sq.operation);
      }
    });

    return pool;
  }, [profile]);

  const handleAnswer = useCallback(async (isCorrect: boolean, userAnswer?: string) => {
    if (!profile || !currentQuestion || !userProfile) return;
    const activeUid = user ? user.uid : 'guest_learner';

    if (isCorrect) {
      if (profile.streak > 0 && (profile.streak + 1) % 5 === 0) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } else {
      SoundService.playIncorrect();
    }

    const updatedUserProfile = await ProgressService.updateProgress(activeUid, isCorrect, currentQuestion.operation, userProfile, currentQuestion, userAnswer);
    const updatedProfile = updatedUserProfile.buddyData!;
    
    setSessionStats(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      return {
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        total: prev.total + 1,
        starsEarned: isCorrect ? prev.starsEarned + 5 : prev.starsEarned,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        currentStreak: newStreak
      };
    });

    let newSession = { ...session };
    if (isCorrect) {
      newSession.correctInARow += 1;
      newSession.wrongInARow = 0;
    } else {
      newSession.wrongInARow += 1;
      newSession.correctInARow = 0;
    }

    let newDifficulty = updatedProfile.difficulty;
    if (newSession.correctInARow >= 3) {
      if (newDifficulty === Difficulty.EASY) {
        newDifficulty = Difficulty.MEDIUM;
        const msg = "You're doing great! Let's try something a bit tougher! 🚀";
        setTutorMessage({ text: msg, type: 'up' });
        speechService.speak(msg);
      } else if (newDifficulty === Difficulty.MEDIUM) {
        newDifficulty = Difficulty.HARD;
        const msg = "Math Master! Let's see if you can handle Expert mode! 🏆";
        setTutorMessage({ text: msg, type: 'up' });
        speechService.speak(msg);
      }
      newSession.correctInARow = 0;
      if (newDifficulty !== updatedProfile.difficulty) {
        SoundService.playLevelUp();
        setTimeout(() => setTutorMessage(null), 4000);
      }
    } else if (newSession.wrongInARow >= 2) {
      if (newDifficulty === Difficulty.HARD) {
        newDifficulty = Difficulty.MEDIUM;
        const msg = "No worries! Let's slow down and practice the basics. 🧘";
        setTutorMessage({ text: msg, type: 'down' });
        speechService.speak(msg);
      } else if (newDifficulty === Difficulty.MEDIUM) {
        newDifficulty = Difficulty.EASY;
        const msg = "Taking it easy! Let's build up your confidence! 💪";
        setTutorMessage({ text: msg, type: 'down' });
        speechService.speak(msg);
      }
      newSession.wrongInARow = 0;
      if (newDifficulty !== updatedProfile.difficulty) {
        setTimeout(() => setTutorMessage(null), 4000);
      }
    }

    if (newDifficulty !== updatedProfile.difficulty) {
      await ProgressService.updateBuddyProfile(user.uid, { difficulty: newDifficulty });
      updatedProfile.difficulty = newDifficulty;
    }

    setUserProfile(updatedUserProfile);
    setSession(newSession);

    if (view === 'daily') {
      const nextCount = dailyCount + 1;
      if (nextCount >= 5) {
        const finalProfile = await ProgressService.completeDailyChallenge(user.uid);
        if (finalProfile) setUserProfile(prev => prev ? { ...prev, buddyData: finalProfile } : null);
        
        setView('summary');
        setSessionStats(prev => ({ ...prev, starsEarned: prev.starsEarned + 50, total: 5 }));
        
        confetti({
          particleCount: 250,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#FFD700', '#FFA500', '#FF4500']
        });
        SoundService.playLevelUp();
      } else {
        setDailyCount(nextCount);
        setTimeout(() => {
          setCurrentQuestion(generateUniqueQuestion(newDifficulty, getWeightedOperations()));
        }, 500);
      }
    } else if (view === 'practice') {
      if (sessionStats.total + 1 >= SESSION_LIMIT) {
        setTimeout(() => setView('summary'), 800);
      } else {
        setTimeout(() => {
          const ops = practiceTopic === 'all' ? getWeightedOperations() : [practiceTopic as Operation];
          setCurrentQuestion(generateUniqueQuestion(newDifficulty, ops));
        }, 500);
      }
    } else {
      setTimeout(() => {
        const ops = practiceTopic === 'all' ? getWeightedOperations() : [practiceTopic as Operation];
        setCurrentQuestion(generateUniqueQuestion(newDifficulty, ops));
      }, 500);
    }
  }, [user, profile, currentQuestion, session, sessionStats.total, view, dailyCount, practiceTopic, getWeightedOperations, userProfile]);

  const handlePurchase = async (avatar: string) => {
    if (!user) return;
    const cost = 50; // Simplified cost
    if (await ProgressService.unlockAvatar(user.uid, avatar, cost)) {
      const updatedUser = await ProgressService.getUserProfile(user.uid);
      if (updatedUser) setUserProfile(updatedUser);
      SoundService.playLevelUp();
      confetti({ particleCount: 50, spread: 40 });
    }
  };

  const handleSelectAvatar = async (avatar: string) => {
    if (!user) return;
    await ProgressService.updateBuddyProfile(user.uid, { avatar });
    const updatedUser = await ProgressService.getUserProfile(user.uid);
    if (updatedUser) setUserProfile(updatedUser);
  };

  const handleShare = async (name: string, stats?: number) => {
    const shareData = {
      title: 'MathSpark 🎉',
      text: stats 
        ? `🔥 My child is crushing it on MathSpark! They've already saved ${stats} stars. Join the Grade 4 quest! 🇿🇦` 
        : `🚀 Check out MathSpark! The ultimate Grade 4 maths adventure for South African kids.`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} Check it out at ${shareData.url}`);
        alert('📋 Link copied to clipboard! Share it with other parents. 🚀');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
    setUserProfile(null);
    setView('welcome');
    setShowLogin(false);
    setLoginRole(null);
  };

  const handleStartGuestPlay = () => {
    const stored = ProgressService.getLocalProfile('guest_learner');
    if (stored && stored.buddyData) {
      setUserProfile(stored);
      setView('welcome');
      return;
    }

    const guestUser: UserProfile = {
      uid: 'guest_learner',
      email: 'learner@mathspark.local',
      role: 'buddy',
      buddyData: {
        name: 'Grade 4 Champ',
        avatar: '🦁',
        stars: 10,
        streak: 0,
        bestStreak: 0,
        difficulty: Difficulty.EASY,
        totalQuestions: 0,
        correctAnswers: 0,
        topicPerformance: {},
        badges: ['Math Explorer'],
        weakAreas: {} as any,
        unlockedAvatars: ['🦁', '🐘', '🦏', '🐆', '🐃', '🦓'],
        dailyChallengeStreak: 0,
        dailyLearningStreak: 1,
        dailyGoal: 5,
        questionsToday: 0,
        enabledOperations: Object.values(Operation),
        currentTerm: Term.TERM_1,
        isPro: false,
      }
    };
    localStorage.setItem('user_profile_guest_learner', JSON.stringify(guestUser));
    setUserProfile(guestUser);
    setView('welcome');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <MathLoader />
      </div>
    );
  }

  if (!user && !userProfile) {
    if (!showLogin && !loginRole) {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="bg-slate-900 text-white py-2 text-center relative z-50">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 bg-spark-accent rounded-full animate-pulse" />
              100% CAPS 2026 Aligned Grade 4 Mathematics 🇿🇦
              <span className="w-1.5 h-1.5 bg-spark-accent rounded-full animate-pulse" />
            </p>
          </div>
          <LandingPage 
            onGetStarted={() => setShowLogin(true)} 
            onQuickPlay={handleStartGuestPlay}
          />
        </div>
      );
    }

    if (!loginRole) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-indigo-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border-4 sm:border-8 border-indigo-100 w-full max-w-md text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-spark-primary via-spark-secondary to-spark-accent" />
            
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-6 left-6 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Back to Home"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <Logo size="lg" className="justify-center mb-6" showText={false} />
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-1 tracking-tighter leading-none">MathSpark</h1>
            <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest text-[9px] sm:text-xs">Grade 4 Math Adventures 🇿🇦</p>
            
            <div className="grid gap-3 sm:gap-4">
              {/* Instant Student Play Button (No Email Needed) */}
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98, translateY: 0 }}
                onClick={handleStartGuestPlay}
                className="group relative overflow-hidden p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[2rem] shadow-lg transition-all flex items-center justify-between border-b-6 border-emerald-700 min-h-[64px]"
              >
                <div className="text-left relative z-10">
                  <p className="font-black text-2xl tracking-tight leading-none">Instant Play 🚀</p>
                  <p className="text-emerald-100 text-[11px] font-bold uppercase tracking-wider mt-1">Start Questing (No Email)</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98, translateY: 0 }}
                onClick={() => setLoginRole('buddy')}
                className="group relative overflow-hidden p-5 bg-spark-primary text-white rounded-[2rem] shadow-md transition-all flex items-center justify-between border-b-6 border-indigo-800 min-h-[56px]"
              >
                <div className="text-left relative z-10">
                  <p className="font-black text-xl tracking-tight leading-none">I have an Account</p>
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">Sign in with Email</p>
                </div>
                <div className="p-2.5 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98, translateY: 0 }}
                onClick={() => setLoginRole('parent')}
                className="group relative overflow-hidden p-5 bg-white border-2 border-slate-200 text-slate-800 rounded-[2rem] shadow-sm transition-all flex items-center justify-between border-b-6 border-slate-300 min-h-[56px]"
              >
                <div className="text-left relative z-10">
                  <p className="font-black text-xl tracking-tight leading-none text-slate-900">Parent Portal</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Track Progress</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                  <UserCheck className="w-6 h-6 text-slate-600" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    const isBuddyLogin = loginRole === 'buddy';

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 bg-indigo-50`}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border-4 sm:border-8 border-indigo-100 w-full max-w-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-spark-primary via-spark-secondary to-spark-accent" />
          
          <button 
            onClick={() => {
              setLoginRole(null);
              setIsSignUp(false);
              setAuthError(null);
            }}
            className="absolute top-6 sm:top-8 left-6 sm:left-8 p-2 text-gray-300 hover:text-spark-primary transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-center mb-6 sm:mb-10">
            <Logo size="md" className="justify-center mb-6" showText={false} />
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
              {isSignUp ? (isBuddyLogin ? 'New Quest' : 'Join Us') : 'Welcome Back'}
            </h2>
            <p className="text-spark-primary font-black uppercase text-[10px] tracking-[0.2em]">
              {isBuddyLogin ? 'Buddy Access' : 'Parent Portal'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 sm:space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  className="w-full p-4 sm:p-6 bg-gray-50 border-2 sm:border-4 border-gray-100 rounded-2xl sm:rounded-3xl font-black text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-spark-primary/30 transition-all shadow-inner min-h-[56px]"
                  placeholder="YOUR NAME"
                />
              </div>
            )}
            <div className="space-y-3 sm:space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 sm:p-6 bg-gray-50 border-2 sm:border-4 border-gray-100 rounded-2xl sm:rounded-3xl font-black text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-spark-primary/30 transition-all shadow-inner min-h-[56px]"
                placeholder="EMAIL ADDRESS"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!resetSent}
                className="w-full p-4 sm:p-6 bg-gray-50 border-2 sm:border-4 border-gray-100 rounded-2xl sm:rounded-3xl font-black text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-spark-primary/30 transition-all shadow-inner min-h-[56px]"
                placeholder="PASSWORD"
              />
            </div>

            {resetSent && (
              <p className="p-4 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-tighter rounded-2xl border-2 border-emerald-100 text-center">
                Reset link sent!
              </p>
            )}

            {authError && (
              <p className="p-4 bg-rose-50 text-rose-500 text-xs font-black uppercase tracking-tighter rounded-2xl border-2 border-rose-100 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-6 bg-spark-primary text-white text-2xl font-black rounded-[2rem] shadow-xl shadow-spark-primary/20 hover:bg-spark-secondary transition-all active:scale-95 disabled:opacity-50 border-b-6 border-spark-primary/80"
            >
              {isLoggingIn ? '...' : (isSignUp ? 'Create Spark ✨' : 'Let\'s Go! 🚀')}
            </button>

            <div className="flex flex-col gap-4 text-center pt-2">
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-indigo-400 font-bold hover:text-indigo-600 transition-colors text-xs"
                >
                  Forgot your secret code?
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                }}
                className="text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (view === 'role-selection') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg p-10 rounded-[3rem] shadow-2xl border-8 border-white/20 w-full max-w-md text-center"
        >
          <h2 className="text-3xl font-black text-indigo-700 mb-8">Who are you?</h2>
          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelection('buddy')}
              className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-3"
            >
              <Users className="w-12 h-12" />
              <span className="text-2xl font-black">I'm a Buddy</span>
            </button>
            <button
              onClick={() => handleRoleSelection('parent')}
              className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-3"
            >
              <UserCheck className="w-12 h-12" />
              <span className="text-2xl font-black">I'm a Parent</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (userProfile?.role === 'buddy' && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg p-10 rounded-[3rem] shadow-2xl border-8 border-white/20 w-full max-w-md text-center"
        >
          <h2 className="text-3xl font-black text-indigo-700 mb-4">Setup your Profile</h2>
          <div className="mb-8">
            <p className="text-gray-500 mb-4 font-bold uppercase text-xs tracking-widest">Pick your Buddy</p>
            <div className="flex justify-center gap-4">
              {['🦁', '🐘', '🦏', '🐆', '🐃', '🦓'].map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className={`text-4xl p-3 rounded-2xl border-4 transition-all ${selectedAvatar === a ? 'border-indigo-500 bg-indigo-50 scale-110 shadow-lg' : 'border-gray-100 bg-white'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full p-5 bg-white border-4 border-indigo-100 rounded-2xl text-xl font-bold focus:outline-none focus:border-indigo-300 text-indigo-700 shadow-inner"
            />
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-2xl font-black rounded-2xl shadow-xl transform active:scale-95 transition-all"
            >
              Let's Go!
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (userProfile?.role === 'parent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="max-w-4xl mx-auto">
          <ParentPortal 
            userProfile={userProfile}
            onLogout={logout}
            onFeedback={() => setIsFeedbackOpen(true)}
            onShare={handleShare}
            onClose={() => setView('welcome')}
          />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const buddyMood = session.correctInARow >= 2 ? 'excited' : profile.streak > 0 ? 'happy' : session.wrongInARow > 0 ? 'sad' : 'neutral';

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto pb-24 px-0 sm:px-0">
      {profile && profile.questionsToday < (profile.dailyGoal || 5) && view === 'welcome' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-spark-energy text-slate-900 overflow-hidden"
        >
          <div className="px-6 py-2 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Flame className="w-3 h-3 fill-current" />
              Time for 5 minutes of maths! Fuel your spark today.
            </p>
            <button 
              onClick={() => setView('topics')}
              className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-tighter"
            >
              Start Now
            </button>
          </div>
        </motion.div>
      )}
      <div className="bg-slate-900 text-white py-2 text-center w-full z-50 rounded-b-3xl mb-4 shadow-xl">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          Early Access Phase 🇿🇦
        </p>
      </div>
      <header className="p-4 sm:p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b border-spark-primary/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo size="sm" showText={false} />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-spark-primary/10 text-xl sm:text-2xl relative">
              {profile.avatar}
              <span className="absolute -bottom-1 -right-1 text-[10px]">🇿🇦</span>
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-sm sm:text-lg leading-none truncate max-w-[100px] sm:max-w-none">{profile.name}</h2>
              <p className="text-spark-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-1">Grade 4 Explorer</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('shop')}
            className="p-2.5 sm:p-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={logout}
            className="p-2.5 sm:p-3 bg-rose-100 text-rose-500 rounded-xl hover:bg-rose-200 transition-colors shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {tutorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={() => speechService.speak(tutorMessage.text)}
              className={`fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 p-4 sm:p-6 rounded-[2rem] shadow-2xl border-4 border-white flex items-center gap-3 sm:gap-4 max-w-md w-[92%] sm:w-[90%] cursor-pointer
                ${tutorMessage.type === 'up' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="font-black text-xs sm:text-base leading-tight flex-1">{tutorMessage.text}</p>
              <div className="bg-white/20 p-2 rounded-xl">
                <Volume2 className="w-4 h-4" />
              </div>
            </motion.div>
          )}

          {view === 'welcome' && (
            <ViewContainer>
              <div className="space-y-10 py-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-spark-primary/10 rounded-full blur-3xl animate-pulse" />
                    <Buddy avatar={profile.avatar} mood={buddyMood} isPro={profile.isPro} />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Ready for a <br/><span className="text-spark-primary underline decoration-spark-accent/30 decoration-6 underline-offset-4">Math Adventure?</span></h3>
                    <div className="flex flex-col items-center gap-2 mt-4">
                      <div className="px-4 py-1.5 bg-white border-2 border-slate-100 rounded-full shadow-sm">
                        <p className="text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-spark-energy fill-spark-energy" />
                          {profile.stars} Stars Saved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <DailyGoalBanner 
                    questionsToday={profile.questionsToday || 0}
                    dailyGoal={profile.dailyGoal || 5}
                    streak={profile.dailyLearningStreak || 1}
                    onStartPractice={() => setView('topics')}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02, translateY: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="premium-gradient p-1 rounded-[3rem] shadow-premium group cursor-pointer"
                    onClick={() => {
                      speechService.speak('Start Learning');
                      setView('topics');
                    }}
                  >
                    <div className="bg-slate-900/5 backdrop-blur-sm p-8 rounded-[2.9rem] flex items-center justify-between text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-3xl font-black tracking-tight">Start Learning</h3>
                          <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30 text-[9px] font-black uppercase tracking-widest">CAPS 🇿🇦</div>
                        </div>
                        <p className="text-white/70 text-sm font-bold">Pick a topic and earn rewards!</p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg border-2 border-white/20">
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>
                  </motion.div>

                  {ProgressService.isDailyChallengeAvailable(profile) && (
                    <motion.div
                      whileHover={{ scale: 1.02, translateY: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-2 rounded-[3rem] shadow-premium border-2 border-amber-100 cursor-pointer group"
                      onClick={() => {
                        speechService.speak('Daily Quest');
                        handleStartDaily();
                      }}
                    >
                      <div className="bg-amber-50 p-6 rounded-[2.8rem] flex items-center justify-between border border-amber-200/50">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-amber-400 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Sparkles className="w-8 h-8 fill-current" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-amber-900 tracking-tight">Daily Quest</h4>
                            <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Bonus Stars Waiting ✨</p>
                          </div>
                        </div>
                        <ChevronRight className="w-8 h-8 text-amber-300" />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 pb-4">
                  <motion.div 
                    whileHover={{ scale: 1.02, translateY: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      speechService.speak('My Stats');
                      setView('dashboard');
                    }}
                    className="bg-white p-8 rounded-[3rem] shadow-premium border-2 border-slate-50 flex flex-col items-center text-center cursor-pointer hover:border-spark-primary/20 transition-all group lg:aspect-square justify-center relative"
                  >
                    <div className="w-16 h-16 bg-spark-primary/5 text-spark-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all border border-spark-primary/5">
                      <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">My Stats</span>
                    <Volume2 className="w-3 h-3 text-slate-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, translateY: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => speechService.speak(`My Rank is ${profile.difficulty === Difficulty.EASY ? 'Novice' : profile.difficulty === Difficulty.MEDIUM ? 'Pro' : 'Elite'}`)}
                    className="bg-white p-8 rounded-[3rem] shadow-premium border-2 border-slate-50 flex flex-col items-center text-center group lg:aspect-square justify-center cursor-pointer relative"
                  >
                    <div className="w-16 h-16 bg-spark-accent/5 text-spark-accent rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all border border-spark-accent/5">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Rank {profile.difficulty === Difficulty.EASY ? 'Novice' : profile.difficulty === Difficulty.MEDIUM ? 'Pro' : 'Elite'}</span>
                    <Volume2 className="w-3 h-3 text-slate-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-10 pb-6">
                  <button 
                    onClick={() => setIsFeedbackOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:bg-slate-50 transition-all group w-full sm:w-auto"
                  >
                    <div className="w-8 h-8 bg-spark-primary/5 rounded-xl flex items-center justify-center text-spark-primary group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feedback</span>
                  </button>

                  <button 
                    onClick={() => handleShare(profile.name, profile.stars)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] shadow-premium hover:bg-slate-800 transition-all group w-full sm:w-auto"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-spark-accent group-hover:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Refer a Friend</span>
                  </button>
                </div>
              </div>
            </ViewContainer>
          )}

          {view === 'practice' && currentQuestion && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-8 gap-8 w-full"
            >
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between items-end px-2">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Adventure Progress</p>
                  <p className="text-xs font-black text-indigo-600">Step {sessionStats.total + 1} of {SESSION_LIMIT}</p>
                </div>
                <ProgressBar current={sessionStats.total} total={SESSION_LIMIT} />
              </div>

              <div className="flex items-center gap-4">
                <Buddy avatar={profile.avatar} mood={buddyMood} isPro={profile.isPro} />
                <ScoreBoard 
                  stars={profile.stars} 
                  streak={profile.streak} 
                  difficulty={profile.difficulty} 
                  dailyStreak={profile.dailyLearningStreak}
                />
              </div>
              <QuestionCard 
                question={currentQuestion} 
                onAnswer={handleAnswer} 
              />
              <button
                onClick={() => setView('welcome')}
                className="text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-widest"
              >
                Quit Quest
              </button>
            </motion.div>
          )}

          {view === 'daily' && currentQuestion && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-8 gap-8 w-full"
            >
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between items-end px-2">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Daily Spark Quest</p>
                  <p className="text-xs font-black text-amber-600">{dailyCount} / 5 Done</p>
                </div>
                <ProgressBar current={dailyCount} total={5} />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                   <div className="absolute -inset-2 bg-amber-400/20 rounded-full blur-lg animate-pulse" />
                   <Buddy avatar={profile.avatar} mood="excited" isPro={profile.isPro} />
                </div>
                <div className="bg-amber-50 px-6 py-4 rounded-[2rem] border-4 border-white shadow-xl">
                  <p className="text-amber-600 font-black text-2xl">Quest Mode!</p>
                </div>
              </div>
              <QuestionCard 
                question={currentQuestion} 
                onAnswer={handleAnswer} 
              />
              <button
                onClick={() => setView('welcome')}
                className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-600"
              >
                Cancel Day Quest
              </button>
            </motion.div>
          )}

          {view === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <SessionSummary 
                stats={{
                  correct: sessionStats.correct,
                  total: sessionStats.total,
                  starsEarned: sessionStats.starsEarned,
                  streak: sessionStats.bestStreak
                }}
                avatar={profile.avatar}
                onFinish={() => setView('welcome')}
                onRestart={() => handleStartPractice(practiceTopic === 'all' ? undefined : practiceTopic as Operation)}
              />
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10 py-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-indigo-50">
                    <LayoutDashboard className="text-indigo-600 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">Super Stats</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Your math journey</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-8 border-indigo-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <p className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-1">Success Brain</p>
                        <h4 className="text-6xl font-black text-gray-900 leading-none">
                          {profile.totalQuestions > 0 
                            ? Math.round((profile.correctAnswers / profile.totalQuestions) * 100) 
                            : 0}%
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 font-black text-xs bg-gray-50 px-4 py-2 rounded-full border-2 border-gray-100 shadow-inner">
                          {profile.correctAnswers} Correct
                        </p>
                      </div>
                    </div>
                    <div className="h-6 bg-spark-primary/10 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${profile.totalQuestions > 0 ? (profile.correctAnswers / profile.totalQuestions) * 100 : 0}%` }}
                        className="h-full bg-gradient-to-r from-spark-primary to-spark-secondary"
                      />
                    </div>
                    <p className="text-center text-gray-400 text-xs font-bold mt-4">Out of {profile.totalQuestions} questions solved!</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-emerald-50 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                      <TrendingUp className="text-emerald-500 w-6 h-6" />
                    </div>
                    <p className="text-2xl font-black text-gray-900 leading-none">{profile.dailyLearningStreak || 1}</p>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Day Streak</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-amber-50 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3">
                      <Star className="text-amber-500 w-6 h-6 fill-current" />
                    </div>
                    <p className="text-2xl font-black text-gray-900 leading-none">{profile.stars}</p>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Stars Gained</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <Sparkles className="text-indigo-500 w-6 h-6" />
                  Your Badges
                </h4>
                <div className="flex flex-wrap gap-4">
                  {profile.badges.length > 0 ? (
                    profile.badges.map(badge => (
                      <RewardBadge key={badge} name={badge} />
                    ))
                  ) : (
                    <div className="w-full py-12 bg-white/50 border-4 border-dashed border-gray-100 rounded-[2.5rem] text-center">
                      <p className="text-gray-400 font-bold italic">Start questing to earn legendary badges!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setView('welcome')}
                  className="w-full py-6 bg-spark-primary text-white font-black text-xl rounded-[2rem] shadow-xl hover:bg-spark-secondary transition-all active:scale-95 border-b-6 border-spark-primary/80"
                >
                  Back to Adventure
                </button>
              </div>
            </motion.div>
          )}

          {view === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-2xl shadow-sm">
                    <ShoppingBag className="text-amber-500 w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">Buddy Shop</h3>
                </div>
                <button 
                  onClick={() => setView('welcome')}
                  className="px-4 py-2 bg-amber-50 text-amber-600 font-black rounded-xl hover:bg-amber-100 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 rounded-[3rem] shadow-2xl border-4 border-white/20 flex items-center justify-between text-white">
                <div>
                  <p className="text-white/80 font-black uppercase text-xs tracking-widest mb-1">Your Stars</p>
                  <p className="text-5xl font-black flex items-center gap-3 drop-shadow-md">
                    <Sparkles className="w-10 h-10 text-amber-200" />
                    {profile.stars}
                  </p>
                </div>
                <p className="text-white/90 text-sm font-black italic max-w-[120px] text-right leading-tight">
                  Answer questions to earn more!
                </p>
              </div>

              <AvatarShop 
                currentStars={profile.stars}
                unlockedAvatars={profile.unlockedAvatars}
                onPurchase={handlePurchase}
                onSelect={handleSelectAvatar}
                currentAvatar={profile.avatar}
              />
            </motion.div>
          )}

          {view === 'parent' && userProfile && (
            <div className="py-8">
              <ParentPortal 
                userProfile={userProfile}
                onClose={() => setView('welcome')} 
                onUpdate={(updated) => setUserProfile(updated)}
                onLogout={handleLogout}
                onUpgrade={handleUpgrade}
              />
            </div>
          )}

          {view === 'topics' && (
            <div className="py-8">
              <TopicSelector 
                profile={profile}
                onSelect={handleStartPractice}
                onBack={() => setView('welcome')}
                onMultiplicationTable={() => setView('multiplication-table')}
                onTermChange={handleTermChange}
              />
            </div>
          )}

          {view === 'multiplication-table' && (
            <div className="py-8">
              <MultiplicationTable 
                onBack={() => setView('topics')}
              />
            </div>
          )}

          {view === 'division-table' && (
            <div className="py-8">
              <DivisionTable 
                onBack={() => setView('topics')}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      <Guide message={guideMsg} />

      {userProfile?.role === 'buddy' && (
        <nav className="fixed bottom-6 left-6 right-6 h-24 glass-morphism rounded-[2.5rem] flex items-stretch max-w-lg mx-auto z-50 p-2 gap-2 overflow-hidden shadow-2xl border-t border-white/50">
          <button 
            onClick={() => {
              speechService.speak('Adventure Home');
              setView('welcome');
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-3xl transition-all ${view === 'welcome' ? 'bg-spark-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Play className={`w-7 h-7 ${view === 'welcome' ? 'fill-white' : ''}`} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Quest</span>
          </button>

          <div className="w-24 -mt-12 mb-2 flex items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.1, translateY: -8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                speechService.speak('Start Math Adventure');
                handleStartPractice();
              }}
              className="w-24 h-24 premium-gradient rounded-[3rem] shadow-premium border-8 border-white group relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="text-white w-11 h-11" />
            </motion.button>
          </div>

          <button 
            onClick={() => {
              speechService.speak('My Stats');
              setView('dashboard');
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-3xl transition-all ${view === 'dashboard' ? 'bg-spark-secondary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-7 h-7" />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Stats</span>
          </button>
        </nav>
      )}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
}
