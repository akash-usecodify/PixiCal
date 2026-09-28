import React from 'react';
import { Camera, Calendar, Target, HelpCircle, Download, Check } from 'lucide-react';
import { MealLogEntry } from '../types/food';

interface MobileBottomNavProps {
  activeTab: 'analyze' | 'history';
  setActiveTab: (tab: 'analyze' | 'history') => void;
  todayLogs: MealLogEntry[];
  onOpenGoalsModal: () => void;
  onOpenTipsModal: () => void;
  onOpenInstallModal?: () => void;
  isInstalled?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  todayLogs,
  onOpenGoalsModal,
  onOpenTipsModal,
  onOpenInstallModal,
  isInstalled = false,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1122]/95 backdrop-blur-xl border-t-2 border-slate-800/90 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {/* Tab 1: Snap Food */}
        <button
          type="button"
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'analyze'
              ? 'text-[#00C853] scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-2xl transition-all ${
              activeTab === 'analyze'
                ? 'bg-[#00C853]/20 shadow-[0_0_12px_rgba(0,200,83,0.3)]'
                : ''
            }`}
          >
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-cute font-bold mt-0.5">Snap Plate</span>
        </button>

        {/* Tab 2: Daily Journal */}
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer relative ${
            activeTab === 'history'
              ? 'text-[#0084FF] scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-2xl transition-all relative ${
              activeTab === 'history'
                ? 'bg-[#0084FF]/20 shadow-[0_0_12px_rgba(0,132,255,0.3)]'
                : ''
            }`}
          >
            <Calendar className="w-5 h-5" />
            {todayLogs.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#FF7A00] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-slate-900 shadow-xs">
                {todayLogs.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-cute font-bold mt-0.5">Journal</span>
        </button>

        {/* Tab 3: Install App (iOS/Android) */}
        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-[#00C853] transition-all cursor-pointer group"
          >
            <div className={`p-1.5 rounded-2xl transition-all ${isInstalled ? 'group-hover:bg-emerald-500/20' : 'bg-[#00C853]/15 group-hover:bg-[#00C853]/25 ring-1 ring-[#00C853]/40'}`}>
              {isInstalled ? (
                <Check className="w-5 h-5 text-[#00C853]" />
              ) : (
                <Download className="w-5 h-5 text-[#00C853] animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-cute font-bold mt-0.5 text-emerald-400">
              {isInstalled ? 'Installed' : 'Install'}
            </span>
          </button>
        )}

        {/* Tab 4: Calorie Goals */}
        <button
          type="button"
          onClick={onOpenGoalsModal}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-[#FF7A00] transition-all cursor-pointer group"
        >
          <div className="p-1.5 rounded-2xl group-hover:bg-[#FF7A00]/20 transition-all">
            <Target className="w-5 h-5 text-slate-400 group-hover:text-[#FF7A00]" />
          </div>
          <span className="text-[10px] font-cute font-bold mt-0.5">Goals</span>
        </button>

        {/* Tab 5: Photo Tips */}
        <button
          type="button"
          onClick={onOpenTipsModal}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-[#FF334B] transition-all cursor-pointer group"
        >
          <div className="p-1.5 rounded-2xl group-hover:bg-[#FF334B]/20 transition-all">
            <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-[#FF334B]" />
          </div>
          <span className="text-[10px] font-cute font-bold mt-0.5">Tips</span>
        </button>
      </div>
    </nav>
  );
};
