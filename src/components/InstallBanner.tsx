import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Apple, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface InstallBannerProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onOpenInstallModal: () => void;
  onInstall: () => Promise<boolean>;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  onOpenInstallModal,
  onInstall,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if dismissed previously in session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pixical_install_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem('pixical_install_banner_dismissed', 'true');
  };

  // If already installed as standalone PWA or dismissed, don't show the banner
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 mb-3 pt-2">
      <div 
        onClick={onOpenInstallModal}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d172c] via-[#101b33] to-[#0c1426] border-2 border-slate-700/80 hover:border-[#00C853]/60 p-3 sm:p-3.5 shadow-lg shadow-black/40 transition-all hover:scale-[1.008]"
      >
        {/* Glow ambient highlight */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-[#00C853]/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-28 h-28 bg-[#0084FF]/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          {/* Left: Icon & Pitch */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C853] to-[#0084FF] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                {isIOS ? (
                  <Apple className="w-5 h-5 text-white" />
                ) : (
                  <Smartphone className="w-5 h-5 text-[#00C853]" />
                )}
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00C853]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="font-cute font-extrabold text-xs sm:text-sm text-white group-hover:text-[#00C853] transition-colors">
                  Install PixiCal as Mobile App
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-[#0084FF]/20 text-[#38BDF8] border border-[#0084FF]/40">
                  {isIOS ? 'iOS Ready' : isAndroid ? 'Android Ready' : 'Installable'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                {isIOS 
                  ? 'Add to iPhone Home Screen: Tap Share ⎋ then "Add to Home Screen"'
                  : isInstallable 
                  ? 'Tap to install directly onto your home screen for full-screen mode'
                  : 'Get instant full-screen mobile app experience with zero app store download'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {isInstallable ? (
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await onInstall();
                }}
                className="px-3 sm:px-4 py-1.5 rounded-xl font-cute font-extrabold text-xs text-white bg-[#00C853] hover:bg-[#00B04A] shadow-[0_2px_10px_rgba(0,200,83,0.35)] transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenInstallModal}
                className="px-3 sm:px-4 py-1.5 rounded-xl font-cute font-extrabold text-xs text-white bg-[#0084FF] hover:bg-[#0070E0] shadow-[0_2px_10px_rgba(0,132,255,0.35)] transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <span>How to Install</span>
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
