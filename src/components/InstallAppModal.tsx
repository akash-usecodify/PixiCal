import React, { useState } from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  Smartphone,
  Apple,
  Globe,
  Zap,
  WifiOff,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PixiCalLogo } from './PixiCalLogo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onInstall: () => Promise<boolean>;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  onInstall,
}) => {
  // Pre-select tab according to detected platform
  const defaultTab = isIOS ? 'ios' : isAndroid ? 'android' : isInstallable ? 'android' : 'desktop';
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleTriggerInstall = async () => {
    setIsInstalling(true);
    const success = await onInstall();
    setIsInstalling(false);
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
        setInstallSuccess(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0d1322] border-2 border-slate-700/80 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(0,200,83,0.15)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00C853] via-[#0084FF] to-[#FF7A00]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0c1324] to-[#151f38] border-2 border-slate-700 flex items-center justify-center shadow-md p-1.5">
              <img src="/pwa-192x192.png" alt="PixiCal App Icon" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-cute font-extrabold text-xl text-white">Install PixiCal</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/40">
                  Web App (PWA)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Add to your phone or desktop for an ultra-fast mobile app experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* If already installed banner */}
          {isInstalled && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center space-x-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-[#00C853] shrink-0" />
              <div>
                <p className="font-cute font-bold text-sm text-white">PixiCal is Installed!</p>
                <p className="text-xs text-emerald-300/80">You are already running PixiCal in standalone mobile app mode.</p>
              </div>
            </div>
          )}

          {/* Quick One-Click Install Button if supported by current browser */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00C853]/15 to-[#0084FF]/15 border-2 border-[#00C853]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#00C853] text-white flex items-center justify-center shadow-md shrink-0">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-cute font-extrabold text-sm text-white">One-Click Direct Install</h4>
                  <p className="text-xs text-slate-300">Fast install ready for your device</p>
                </div>
              </div>

              <button
                onClick={handleTriggerInstall}
                disabled={isInstalling || installSuccess}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-cute font-extrabold text-sm text-white bg-gradient-to-r from-[#00C853] to-[#00B04A] hover:brightness-110 active:scale-95 shadow-[0_4px_14px_rgba(0,200,83,0.4)] transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {installSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Installed!</span>
                  </>
                ) : isInstalling ? (
                  <span>Installing...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Install PixiCal App</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Platform Guide Tabs */}
          <div>
            <div className="flex rounded-2xl bg-[#141b2c] p-1 border border-slate-700/80 mb-4">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-cute font-bold transition cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-[#00C853] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android</span>
                {isAndroid && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-cute font-bold transition cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-[#0084FF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone / iOS</span>
                {isIOS && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-cute font-bold transition cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-[#FF7A00] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Desktop</span>
              </button>
            </div>

            {/* TAB: Android Guide */}
            {activeTab === 'android' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Tap the Chrome Menu</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open this page in Google Chrome on your Android device and tap the <strong className="text-slate-200">three dots (⋮)</strong> at the top-right corner.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Select "Install app" or "Add to Home screen"</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      In the Chrome menu, tap <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Launch PixiCal!</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tap <strong className="text-slate-200">Install</strong>. PixiCal will appear on your Android home screen & app drawer, launching instantly in full-screen with no browser borders.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: iOS Safari Guide */}
            {activeTab === 'ios' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  💡 <strong className="text-white">Note for iOS:</strong> Apple requires using <strong className="text-white">Safari</strong> browser to install Progressive Web Apps to your home screen.
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0084FF]/20 text-[#0084FF] border border-[#0084FF]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Tap the Safari Share Button</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      At the bottom of your iPhone screen (or top on iPad), tap the <strong className="text-white">Share button</strong> (the square icon with an arrow pointing up <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">⎋</span>).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0084FF]/20 text-[#0084FF] border border-[#0084FF]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Tap "Add to Home Screen"</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Scroll down the share sheet and select <strong className="text-[#38BDF8]">"Add to Home Screen"</strong> (with the plus <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold">➕</span> icon).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0084FF]/20 text-[#0084FF] border border-[#0084FF]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Tap "Add" in Top Right</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Confirm by tapping <strong className="text-slate-200">Add</strong>. PixiCal will now be on your iOS home screen with the official app icon and pure dark splash screen!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Desktop Guide */}
            {activeTab === 'desktop' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Look at Browser Address Bar</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      In Chrome, Microsoft Edge, or Brave, look at the right side of the URL address bar for the <strong className="text-orange-400">Install App (⊕)</strong> icon.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-700/60 flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-cute font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-cute font-bold text-sm text-white">Click "Install PixiCal"</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click Install to launch PixiCal in a standalone, distraction-free desktop application window with dock/taskbar pinning.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
            <div className="p-2.5 rounded-xl bg-[#101728] border border-slate-800/80 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <div>
                <p className="font-cute font-bold text-xs text-white">Lightning Fast</p>
                <p className="text-[10px] text-slate-400">Instant app boot</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101728] border border-slate-800/80 flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-[#0084FF] shrink-0" />
              <div>
                <p className="font-cute font-bold text-xs text-white">Works Offline</p>
                <p className="text-[10px] text-slate-400">Cached food logs</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101728] border border-slate-800/80 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-[#00C853] shrink-0" />
              <div>
                <p className="font-cute font-bold text-xs text-white">Full Screen</p>
                <p className="text-[10px] text-slate-400">No browser address bar</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101728] border border-slate-800/80 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FF334B] shrink-0" />
              <div>
                <p className="font-cute font-bold text-xs text-white">Zero App Store</p>
                <p className="text-[10px] text-slate-400">Free & instant update</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0f1d] border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            PixiCal • Mobile Web App Optimized
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-cute font-bold transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
