import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Difficulty, Operation, StruggledQuestion, Term } from '../types';
import { ProgressService, UserProfile } from '../services/ProgressService';
import { ProgressBar } from './ProgressBar';
import { Logo } from './ui/Logo';
import { 
  XCircle, 
  ChevronLeft,
  ShieldCheck,
  UserPlus,
  Users,
  LogOut,
  Star,
  Plus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle,
  XCircle as XIcon,
  Info,
  Zap,
  School,
  Mail,
  TrendingDown,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Share2
} from 'lucide-react';

interface ParentPortalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onLogout?: () => void;
  onUpdate?: (profile: UserProfile) => void;
  onUpgrade?: (buddyUid: string, buddyName: string) => void;
  onFeedback?: () => void;
  onGoalChange?: (buddyUid: string, goal: number) => void;
  onShare?: (name: string, stats: number) => void;
}

import { BuddyProgressCard } from './BuddyProgressCard';
import { Skeleton } from './ui/LoadingStates';
import { ViewContainer } from '../App';

export const ParentPortal: React.FC<ParentPortalProps> = ({ userProfile, onClose, onLogout, onUpdate, onUpgrade, onFeedback, onGoalChange, onShare }) => {
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Parent state
  const [buddies, setBuddies] = useState<UserProfile[]>([]);
  const [buddyEmailInput, setBuddyEmailInput] = useState('');
  const [isLoadingBuddies, setIsLoadingBuddies] = useState(false);

  // Weak areas state
  const [expandedBuddy, setExpandedBuddy] = useState<string | null>(null);
  const [struggledQuestions, setStruggledQuestions] = useState<Record<string, StruggledQuestion[]>>({});
  const [isLoadingWeakAreas, setIsLoadingWeakAreas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userProfile.role === 'parent') {
      loadBuddies();
    }
  }, [userProfile]);

  const loadBuddies = async () => {
    setIsLoadingBuddies(true);
    const linkedBuddies = await ProgressService.findBuddiesByParentEmail(userProfile.email);
    setBuddies(linkedBuddies);
    setIsLoadingBuddies(false);
  };

  const loadWeakAreas = async (buddyUid: string) => {
    if (struggledQuestions[buddyUid]) return;

    setIsLoadingWeakAreas(prev => ({ ...prev, [buddyUid]: true }));
    try {
      const questions = await ProgressService.getStruggledQuestions(buddyUid);
      setStruggledQuestions(prev => ({ ...prev, [buddyUid]: questions }));
    } catch (err) {
      console.error('Failed to load weak areas:', err);
    } finally {
      setIsLoadingWeakAreas(prev => ({ ...prev, [buddyUid]: false }));
    }
  };

  const toggleWeakAreas = useCallback((buddyUid: string) => {
    setExpandedBuddy(prev => {
      const next = prev === buddyUid ? null : buddyUid;
      if (next) loadWeakAreas(next);
      return next;
    });
  }, [struggledQuestions]);

  const handleTermChange = useCallback(async (buddyUid: string, term: Term) => {
    try {
      await ProgressService.updateBuddyProfile(buddyUid, { currentTerm: term });
      setBuddies(prev => prev.map(b => {
        if (b.uid === buddyUid && b.buddyData) {
          return { ...b, buddyData: { ...b.buddyData, currentTerm: term } };
        }
        return b;
      }));
    } catch (err) {
      console.error('Failed to update term:', err);
    }
  }, []);

  const handleGoalChange = useCallback(async (buddyUid: string, goal: number) => {
    try {
      await ProgressService.updateBuddyProfile(buddyUid, { dailyGoal: goal });
      setBuddies(prev => prev.map(b => {
        if (b.uid === buddyUid && b.buddyData) {
          return { ...b, buddyData: { ...b.buddyData, dailyGoal: goal } };
        }
        return b;
      }));
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  }, []);

  const handleAddBuddy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyEmailInput.trim()) return;
    
    setIsSaving(true);
    setError('');
    try {
      await ProgressService.linkBuddyByEmail(userProfile.uid, buddyEmailInput.trim());
      await loadBuddies();
      setBuddyEmailInput('');
      alert('Buddy linked successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to link buddy.');
    } finally {
      setIsSaving(false);
    }
  };

  if (userProfile.role !== 'parent') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-[3rem] shadow-2xl border-8 border-rose-50 max-w-md mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center shadow-inner border-2 border-rose-100">
            <XCircle className="text-rose-500 w-10 h-10 drop-shadow-sm" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Access Denied</h2>
        <p className="text-gray-400 text-sm font-bold mb-8 uppercase tracking-widest">This portal is for parents only</p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl shadow-lg hover:bg-rose-600 transition-all active:scale-95"
        >
          Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden"
    >
      <div className="bg-slate-900 px-6 py-6 sm:px-10 sm:py-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-spark-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Logo size="sm" showText={false} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none">Parent HQ</h2>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-1">Management Portal 🇿🇦</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          {onFeedback && (
            <button 
              onClick={onFeedback}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95 group"
              title="Share Feedback"
            >
              <MessageSquare className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </button>
          )}
          {onLogout && (
            <button 
              onClick={onLogout}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95 group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-95 border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-10 sm:space-y-12 max-h-[85vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Protected Account</h4>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Your student's data is encrypted and secure.</p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-spark-primary rounded-full" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Manage Buddies
            </h3>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-400">
              <UserPlus className="w-5 h-5" />
              <p className="text-xs font-black uppercase tracking-widest">Connect New Student</p>
            </div>
            <form onSubmit={handleAddBuddy} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  value={buddyEmailInput}
                  onChange={(e) => setBuddyEmailInput(e.target.value)}
                  placeholder="buddy@adventure.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:outline-none focus:border-spark-primary/20 text-slate-700 shadow-inner transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-10 h-[68px] bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? '...' : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Link Buddy</span>
                  </>
                )}
              </button>
            </form>
            {error && <p className="px-6 py-3 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 inline-block">{error}</p>}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-spark-secondary rounded-full" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Students</h3>
            </div>
            <button 
              onClick={loadBuddies}
              className="text-spark-primary font-black text-xs uppercase tracking-widest hover:underline"
            >
              Refresh Data
            </button>
          </div>

          <div className="space-y-8">
            {isLoadingBuddies ? (
              [1, 2].map(i => (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 animate-pulse">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl" />
                    <div className="space-y-3">
                      <div className="w-48 h-6 bg-slate-100 rounded-full" />
                      <div className="w-32 h-4 bg-slate-50 rounded-full" />
                    </div>
                  </div>
                  <div className="h-32 bg-slate-50 rounded-[2rem]" />
                </div>
              ))
            ) : buddies.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">No active students</p>
                <p className="text-slate-900 font-bold max-w-xs mx-auto">Link a student using their email address to track performance.</p>
              </div>
            ) : (
              buddies.map(buddy => (
                <ViewContainer key={buddy.uid}>
                  <BuddyProgressCard
                    buddy={buddy}
                    isExpanded={expandedBuddy === buddy.uid}
                    isLoadingWeakAreas={!!isLoadingWeakAreas[buddy.uid]}
                    struggledQuestions={struggledQuestions[buddy.uid] || []}
                    onToggleWeakAreas={toggleWeakAreas}
                    onTermChange={handleTermChange}
                    onGoalChange={handleGoalChange}
                    onUpgrade={onUpgrade}
                    onShare={onShare}
                  />
                </ViewContainer>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-spark-accent rounded-full" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Future Insights (Premium)</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-200 flex flex-col justify-between group opacity-60">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-slate-100 text-slate-500 rounded-md">Coming Soon</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">PDF Monthly Reports</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Deep-dive performance summaries sent to your inbox.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-200 flex flex-col justify-between group opacity-60">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-slate-100 text-slate-500 rounded-md">Coming Soon</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">AI Tutor Analysis</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Personalized tips on why your child might be struggling with specific steps.</p>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-2xl">Premium features will be unlocked June 2026</p>
        </section>

        <section className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-spark-primary/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-spark-accent/20 rounded-full blur-[60px]" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0">
              <School className="w-12 h-12 text-spark-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-black tracking-tight mb-2">MathSpark for Schools</h3>
              <p className="text-slate-400 font-bold text-lg max-w-md">Empower your entire classroom with our CAPS-aligned adventure platform.</p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-spark-primary font-black uppercase text-[10px] tracking-widest mb-2">Teacher Tools</p>
              <p className="text-sm font-bold text-slate-300">Detailed classroom dashboards & performance trends.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-spark-secondary font-black uppercase text-[10px] tracking-widest mb-2">Bulk Pricing</p>
              <p className="text-sm font-bold text-slate-300">Special academic rates for South African institutions.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-spark-energy font-black uppercase text-[10px] tracking-widest mb-2">Easy Setup</p>
              <p className="text-sm font-bold text-slate-300">Integrate with existing school management systems.</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = 'mailto:hello@mathspark.co.za?subject=School Partnership Inquiry'}
            className="relative z-10 w-full py-6 bg-white text-slate-900 font-black text-xl rounded-3xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
          >
            <Mail className="w-6 h-6" />
            Request Educator Access
          </button>
        </section>
      </div>
    </motion.div>
  );
};
