import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Send, X, Heart } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        uid: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'anonymous',
        rating,
        comment,
        timestamp: serverTimestamp(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setRating(0);
        setComment('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[3rem] shadow-premium overflow-hidden p-8 sm:p-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>

            {isSuccess ? (
              <div className="text-center py-10 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
                >
                  <Heart className="w-10 h-10 fill-current" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">You're Awesome!</h3>
                  <p className="text-slate-500 font-bold mt-2">Thanks for helping us make MathSpark better for everyone. 🇿🇦</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-spark-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-spark-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Is this helping you?</h3>
                  <p className="text-slate-400 font-bold text-sm mt-1">We'd love to hear your thoughts!</p>
                </div>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
                          (hoveredRating || rating) >= star 
                            ? 'text-spark-energy fill-spark-energy' 
                            : 'text-slate-100 fill-slate-100'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                    Any specific suggestions?
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you love or what we can improve..."
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:outline-none focus:border-spark-primary/20 text-slate-700 shadow-inner transition-all min-h-[120px] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="w-full py-6 bg-slate-900 text-white text-xl font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isSubmitting ? '...' : (
                    <>
                      <Send className="w-5 h-5 text-spark-accent" />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
