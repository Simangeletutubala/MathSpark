import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'hero' | 'minimal' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running in standalone app mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // For browsers that haven't triggered beforeinstallprompt yet or desktop
      setShowIOSModal(true);
    }
  };

  if (justInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
        <Check className="w-3.5 h-3.5" />
        <span>Installed!</span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all"
        >
          <Smartphone className="w-4 h-4" />
          <span>Install App</span>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold">Free</span>
        </button>
        {showIOSModal && <PWAInstructionModal onClose={() => setShowIOSModal(false)} isIOS={isIOS} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install MathSpark App"
        title="Install MathSpark as a mobile or desktop app"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all text-xs font-bold shadow-xs"
      >
        <Download className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">App</span>
      </button>
      {showIOSModal && <PWAInstructionModal onClose={() => setShowIOSModal(false)} isIOS={isIOS} />}
    </>
  );
};

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('mathspark_pwa_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('mathspark_pwa_banner_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-4 py-2 sm:py-2.5 relative shadow-md z-30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong className="font-semibold text-amber-300">Website & App:</strong> Practice anywhere! Install MathSpark to your home screen for full-screen offline fun.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstall}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install MathSpark App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIOSModal && <PWAInstructionModal onClose={() => setShowIOSModal(false)} isIOS={isIOS} />}
    </>
  );
};

export const PWAInstructionModal: React.FC<{ onClose: () => void; isIOS: boolean }> = ({ onClose, isIOS }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Install MathSpark</h3>
              <p className="text-[11px] text-slate-500">App & Website experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="mt-4 space-y-3.5 text-xs text-slate-600">
            <p className="font-medium text-slate-800">
              To install MathSpark on your <strong>iPhone or iPad</strong>:
            </p>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <p className="pt-0.5">
                Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline text-indigo-600" /> Share</strong> button in the Safari bottom toolbar.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <p className="pt-0.5">
                Scroll down and select <strong className="text-slate-900 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline text-indigo-600" /> Add to Home Screen</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <p className="pt-0.5">
                Tap <strong>Add</strong> in the top-right corner. MathSpark will appear right on your home screen like any native app!
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-xs text-slate-600">
            <p className="font-medium text-slate-800">
              Install MathSpark to use offline and get an app icon on your device:
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>On Android (Chrome / Samsung Internet):</span>
              </div>
              <p className="pl-6 text-[11px] text-slate-500">
                Tap the 3-dot menu icon (⋮) at top right, then select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>On Desktop (Chrome, Edge):</span>
              </div>
              <p className="pl-6 text-[11px] text-slate-500">
                Click the <strong>Install</strong> icon in the address bar (right side of URL).
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-95"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};
