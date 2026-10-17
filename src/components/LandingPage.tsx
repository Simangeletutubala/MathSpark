import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './ui/Logo';
import { 
  ShieldCheck, 
  Trophy, 
  ChevronRight, 
  Star, 
  CheckCircle2,
  Flag,
  Target,
  MessageCircle,
  ChevronDown,
  BarChart3,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onQuickPlay?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onQuickPlay }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Sipho M.",
      location: "Johannesburg",
      text: "My daughter was struggling with long division. Math Spark's step-by-step guidance made it click for her in one week!",
      role: "Parent of Grade 4 Student"
    },
    {
      name: "Tarryn L.",
      location: "Cape Town",
      text: "The local examples (Rands and Biltong) make math feel real. It's perfectly aligned with her CAPS workload.",
      role: "Homeschooling Mother"
    },
    {
      name: "Mr. Pillay",
      location: "Durban",
      text: "I recommend this to all my students. The Parent Portal gives me the exact data I need to help where they struggle.",
      role: "Grade 4 Mathematics Teacher"
    }
  ];

  const faqs = [
    {
      q: "Is this strictly CAPS aligned?",
      a: "Yes! Every quest and challenge is built according to the 2026 South African Grade 4 Mathematics ATP (Annual Teaching Plan)."
    },
    {
      q: "How does the Parent Portal work?",
      a: "Parents get a separate login to view detailed analytics, see weak areas, and even adjust difficulty levels to suit their child's pace."
    },
    {
      q: "Can I use it on a tablet?",
      a: "Absolutely! Math Spark is fully responsive and works perfectly on iPad, Android tablets, and smartphones."
    },
    {
      q: "Is there a free version?",
      a: "Yes, our Basic plan is free forever and covers all the core practice needs. No credit card required to start."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Sticky Top Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <a href="#how" className="hover:text-spark-primary transition-colors">Method</a>
            <a href="#features" className="hover:text-spark-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-spark-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            {onQuickPlay && (
              <button 
                onClick={onQuickPlay}
                className="px-5 py-3 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <span>🚀 Play Now</span>
              </button>
            )}
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-premium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1000px] bg-spark-primary/5 rounded-full blur-[140px] opacity-40 -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-10 border border-emerald-100"
            >
              <Flag className="w-4 h-4 fill-emerald-600" />
              100% CAPS 2026 Aligned 🇿🇦
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-7xl sm:text-8xl xl:text-[10rem] font-black tracking-tighter leading-[0.8] mb-10 text-slate-900"
            >
              Math <br />
              With A <br />
              <span className="premium-gradient bg-clip-text text-transparent italic">Soul.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl text-slate-400 font-bold max-w-xl mx-auto lg:mx-0 mb-14 leading-relaxed"
            >
              The digital tutor that feels like family. Local word problems, smart tracking, and a buddy that never stops cheering.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {onQuickPlay && (
                <button
                  onClick={onQuickPlay}
                  className="w-full sm:w-auto px-10 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl sm:text-2xl font-black rounded-3xl shadow-xl border-b-6 border-emerald-700 hover:brightness-105 transition-all hover:translate-y-[-3px] flex items-center justify-center gap-3"
                >
                  <span>🚀 Instant Play (Learner)</span>
                </button>
              )}
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-6 bg-slate-900 text-white text-xl sm:text-2xl font-black rounded-3xl shadow-premium border-b-6 border-slate-700 hover:bg-slate-800 transition-all hover:translate-y-[-3px] flex items-center justify-center gap-3"
              >
                <span>Sign In / Register</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] blur-3xl opacity-20 -z-10 animate-pulse" />
            <div className="bg-white p-8 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-8 border-gray-50 max-w-lg mx-auto">
              <div className="bg-indigo-50 p-6 rounded-[2.5rem] mb-6 border-b-4 border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase text-indigo-600">Question 3/5</div>
                </div>
                <div className="text-center py-12">
                  <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-2">Math Quest</p>
                  <h3 className="text-4xl font-black text-gray-900 leading-tight">What is<br/>453 + 287?</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl border-b-2 border-gray-200">🦁</div>
                <div>
                  <p className="text-indigo-600 font-black text-xl">"You got this!"</p>
                  <p className="text-xs text-gray-400 font-bold">Your Math Buddy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-gray-50 bg-white shadow-sm overflow-hidden flex justify-center">
        <div className="flex items-center gap-12 sm:gap-24 grayscale opacity-40 overflow-hidden">
           <span className="text-xl font-black italic tracking-tighter whitespace-nowrap">REDHILL SCHOOL</span>
           <span className="text-xl font-black italic tracking-tighter whitespace-nowrap">CURRO</span>
           <span className="text-xl font-black italic tracking-tighter whitespace-nowrap">ADVTTECH</span>
           <span className="text-xl font-black italic tracking-tighter whitespace-nowrap">ST STITHIANS</span>
           <span className="text-xl font-black italic tracking-tighter whitespace-nowrap lg:inline hidden">HERITAGE ACADEMY</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-32 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-7xl font-black tracking-tight mb-4">How it works.</h2>
            <p className="text-xl text-gray-500 font-bold">Turning math into an adventure in 3 easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Heart className="text-rose-500" />,
                title: "Choose Your Buddy",
                desc: "From robots to kittens, every learner picks a buddy that grows and levels up with them."
              },
              {
                step: "02",
                icon: <Target className="text-indigo-500" />,
                title: "Master CAPS Quests",
                desc: "Adaptive questions focus on Grade 4 ZA curriculum. Struggling? Your buddy gives hints!"
              },
              {
                step: "03",
                icon: <Trophy className="text-amber-500" />,
                title: "Collect & Dominate",
                desc: "Earn stars, unlock new shop items, and build a consistent daily learning streak."
              }
            ].map((s, i) => (
              <div key={i} className="group relative p-10 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border-4 border-white hover:border-indigo-100 transition-all">
                <div className="absolute top-8 right-8 text-4xl font-black text-gray-100 group-hover:text-indigo-50 transition-colors uppercase">{s.step}</div>
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                  {React.cloneElement(s.icon as any, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{s.title}</h3>
                <p className="text-gray-500 font-bold leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MathSpark Section */}
      <section id="features" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl sm:text-7xl font-black tracking-tight mb-8">
                Designed for the <br />
                <span className="text-indigo-600">SA Classroom.</span>
              </h2>
              
              <div className="space-y-8">
                {[
                  {
                    icon: <CheckCircle2 className="text-emerald-500" />,
                    title: "Localized Context",
                    desc: "Word problems about Rands, biltong, and cricket. No weird overseas examples to confuse them."
                  },
                  {
                    icon: <ShieldCheck className="text-blue-500" />,
                    title: "Parent Intelligence",
                    desc: "Weekly reports via email. See exactly what your child is mastering and where they need a boost."
                  },
                  {
                    icon: <Sparkles className="text-purple-500" />,
                    title: "Magic Hints & Tutoring",
                    desc: "Our smart system detects struggles and provides step-by-step explanations instantly."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border-b-2 border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="pt-12 space-y-4">
                <div className="aspect-square bg-indigo-600 rounded-[2rem] flex flex-col items-center justify-center text-white p-6 shadow-2xl shadow-indigo-200 border-b-8 border-indigo-800">
                  <BarChart3 className="w-12 h-12 mb-4" />
                  <p className="text-sm font-black uppercase text-center tracking-widest">Adaptive Logic</p>
                </div>
                <div className="aspect-[4/3] bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 flex flex-col items-center justify-center p-6">
                  <p className="text-4xl font-black text-emerald-600 mb-1">92%</p>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center">Score Mastery</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-amber-50 rounded-[2rem] border-2 border-amber-100 flex flex-col items-center justify-center p-6">
                  <p className="text-4xl font-black text-amber-600 mb-1">R199</p>
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center">Lifetime Pro</p>
                </div>
                <div className="aspect-square bg-rose-50 rounded-[2rem] border-2 border-rose-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-rose-200/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Heart className="w-12 h-12 text-rose-500 mb-4 fill-rose-500 relative z-10" />
                  <p className="text-xs font-black text-rose-400 uppercase text-center relative z-10">Made in SA 🇿🇦</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-indigo-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 text-white">
            <h2 className="text-4xl sm:text-7xl font-black tracking-tight mb-4">Trusted by SA families.</h2>
            <p className="text-xl text-indigo-200 font-bold">Join thousands of families building math confidence.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-10 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/10 flex flex-col hover:bg-white/20 transition-all group">
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />)}
                </div>
                <p className="text-lg font-bold text-white mb-8 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-auto pt-6 border-t border-white/10">
                  <p className="text-white font-black">{t.name}</p>
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest leading-relaxed">{t.location} • {t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spark-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-spark-primary/20 animate-bounce">
              Early Access Live 🇿🇦
            </div>
            <h2 className="text-4xl sm:text-7xl font-black tracking-tight mb-4 text-fun-gradient">Invest in Their Future.</h2>
            <p className="text-xl text-gray-500 font-bold">Standard pricing below. <span className="text-spark-primary">Free during early access!</span></p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            {/* Free Plan */}
            <div className="p-12 bg-white rounded-[3rem] border border-slate-100 flex flex-col group hover:shadow-premium transition-all">
              <h3 className="text-2xl font-black mb-2 uppercase tracking-[0.2em] text-slate-400">Mini Spark</h3>
              <p className="text-slate-400 font-bold mb-10">Perfect for quick daily practice.</p>
              <div className="mb-12">
                <span className="text-7xl font-black text-slate-900">R0</span>
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] ml-3">Forever</span>
              </div>
              <ul className="space-y-5 mb-14 flex-1 text-left">
                {['Daily Challenges', 'Basic Arithmetic', '1 Buddy Avatar', 'Mobile Friendly'].map(f => (
                  <li key={f} className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-6 bg-slate-50 text-slate-400 text-lg font-black rounded-2xl hover:bg-slate-100 transition-all border-b-4 border-slate-200"
              >
                Sign Up Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-12 bg-white rounded-[3.5rem] border-2 border-spark-primary relative overflow-hidden shadow-premium flex flex-col scale-105 group">
              <div className="absolute top-0 right-0 p-8">
                <div className="bg-emerald-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">FREE NOW</div>
              </div>
              <h3 className="text-2xl font-black mb-2 text-spark-primary uppercase tracking-[0.2em]">Unlimited Pro</h3>
              <p className="text-slate-400 font-bold mb-10">Full Grade 4 mastery & insights.</p>
              <div className="mb-12">
                <div className="flex items-end gap-3">
                  <span className="text-7xl font-black text-slate-900 line-through opacity-20">R199</span>
                  <span className="text-4xl font-black text-emerald-500 mb-2">R0</span>
                </div>
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Early Access Early Bird</span>
              </div>
              <ul className="space-y-5 mb-14 flex-1 text-left">
                {[
                  'Full Parent Analytics Portal',
                  'Weak Areas History Detection',
                  'AI-Powered Tutor Explanations',
                  'Exclusive South African Heroes',
                  'Weekly Progress Email Reports',
                  'No Subscriptions, Lifetime Access'
                ].map(f => (
                  <li key={f} className="flex items-center gap-4 text-slate-900 font-black text-sm">
                    <Sparkles className="w-5 h-5 text-spark-primary shrink-0 fill-spark-primary/20" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-7 bg-slate-900 text-white text-xl font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all hover:translate-y-[-4px] border-b-6 border-slate-700 active:translate-y-0 active:border-b-0"
              >
                Get Pro Features (Free)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Got Questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-[2rem] border-2 border-gray-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
                >
                  <span className="text-lg font-black text-gray-900 pr-8">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8 text-gray-500 font-bold leading-relaxed border-t border-gray-50 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] opacity-30 -z-10" />
        <div className="max-w-4xl mx-auto">
          <MessageCircle className="w-16 h-16 text-indigo-400 mx-auto mb-8 animate-bounce" />
          <h2 className="text-6xl sm:text-9xl font-black tracking-tighter mb-8 italic">Ready to Spark?</h2>
          <p className="text-2xl text-gray-500 font-bold mb-12">Give your child the confidence they deserve in the classroom.</p>
          <button 
            onClick={onGetStarted}
            className="px-16 py-8 bg-indigo-600 text-white text-3xl font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 border-b-8 border-indigo-900"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <Logo size="md" className="mb-8" />
            <p className="text-gray-400 font-bold max-w-sm mb-8 leading-relaxed">
              Empowering South African Grade 4 learners with adaptive, CAPS-aligned math mastery through play. Built by experts, loved by families.
            </p>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-indigo-600">Product</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><a href="#how" className="hover:text-indigo-600 transition-colors">How it works</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing Options</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Teacher Portal</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-indigo-600">Support</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><a href="mailto:support@mathspark.co.za" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Data Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-12 items-center">
          <p className="text-gray-400 font-bold text-sm italic">
            Made with love in South Africa. 🇿🇦
          </p>
          <div className="flex gap-8 text-gray-400">
             <Star className="w-5 h-5" />
             <Flag className="w-5 h-5" />
             <Heart className="w-5 h-5" />
          </div>
          <p className="text-gray-400 font-bold text-sm">
            © 2026 MathSpark. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
