import React from 'react';
import { Camera, Calendar, Flame, SlidersHorizontal, Download, Check } from 'lucide-react';
import { MealLogEntry, UserNutritionGoal } from '../types/food';
import { PixiCalLogo } from './PixiCalLogo';

interface NavbarProps {
  activeTab: 'analyze' | 'history';
  setActiveTab: (tab: 'analyze' | 'history') => void;
  todayLogs: MealLogEntry[];
  goals: UserNutritionGoal;
  onOpenGoalsModal: () => void;
  onOpenInstallModal?: () => void;
  isInstalled?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  todayLogs,
  goals,
  onOpenGoalsModal,
  onOpenInstallModal,
  isInstalled = false,
}) => {
  const totalCaloriesToday = todayLogs.reduce(
    (sum, log) => sum + (log.analysis.totalCalories || 0),
    0
  );

  const calPercentage = Math.min(100, Math.round((totalCaloriesToday / goals.dailyCalories) * 100));

  return (
    <header className="sticky top-0 z-30 bg-[#0a1122]/85 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-lg shadow-black/30 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand with PixiCal Logo */}
        <div 
          onClick={() => setActiveTab('analyze')}
          className="cursor-pointer select-none group flex items-center space-x-2 transition-transform active:scale-95"
        >
          <PixiCalLogo size="md" variant="full" />
        </div>

        {/* Center Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center space-x-2 bg-[#10192e]/80 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cute transition-all cursor-pointer ${
              activeTab === 'analyze'
                ? 'bg-[#00C853] text-white shadow-[0_2px_12px_rgba(0,200,83,0.4)] transform -translate-y-0.5'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Snap Food</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cute transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0084FF] text-white shadow-[0_2px_12px_rgba(0,132,255,0.4)] transform -translate-y-0.5'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Journal</span>
            {todayLogs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF7A00] text-white font-black shadow-xs">
                {todayLogs.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right side: Install App + Calorie Quick Pill */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isInstalled
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/50'
                  : 'bg-gradient-to-r from-[#00C853]/20 to-[#0084FF]/20 hover:from-[#00C853]/30 hover:to-[#0084FF]/30 border-[#00C853]/50 text-white shadow-[0_0_12px_rgba(0,200,83,0.2)] hover:border-[#00C853]'
              }`}
              title={isInstalled ? 'PixiCal is installed on this device' : 'Install PixiCal on iOS or Android'}
            >
              {isInstalled ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00C853]" />
                  <span className="text-[11px] font-cute font-bold hidden sm:inline text-emerald-300">Installed</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#00C853] animate-pulse" />
                  <span className="text-[11px] font-cute font-bold">Install</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#00C853] text-black font-black hidden xs:inline">
                    App
                  </span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenGoalsModal}
            className="flex items-center space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-[#11192e] hover:bg-[#18233f] border-2 border-slate-700/80 text-white transition-all hover:border-[#FF7A00] group text-left cursor-pointer active:scale-95 shadow-md"
            title="Configure Daily Nutrition Goals"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 transform -rotate-90">
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="#1e293b"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="#FF7A00"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="69.1"
                  strokeDashoffset={69.1 - (69.1 * calPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <Flame className="w-3 h-3 text-[#FF7A00] absolute fill-[#FF7A00] animate-pulse" />
            </div>

            <div className="leading-tight">
              <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-cute">
                Calories
              </div>
              <div className="text-xs sm:text-sm font-black text-white flex items-center space-x-1 font-sans">
                <span className="text-[#FF7A00]">{totalCaloriesToday}</span>
                <span className="text-slate-500 text-[10px]">/</span>
                <span className="text-slate-300 text-[11px] hidden sm:inline">{goals.dailyCalories}</span>
              </div>
            </div>

            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0084FF] transition-colors ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
