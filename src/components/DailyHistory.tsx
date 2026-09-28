import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Flame,
  Plus,
  Scale,
  Sparkles,
  Download,
  Utensils,
  Clock
} from 'lucide-react';
import { MealLogEntry, UserNutritionGoal } from '../types/food';
import { calculateDailyTotals, deleteMealLog, clearLogsForDate } from '../services/storage';

interface DailyHistoryProps {
  logs: MealLogEntry[];
  goals: UserNutritionGoal;
  onRefreshLogs: () => void;
  onScanNewMeal: () => void;
  onOpenGoalsModal: () => void;
}

export const DailyHistory: React.FC<DailyHistoryProps> = ({
  logs,
  goals,
  onRefreshLogs,
  onScanNewMeal,
  onOpenGoalsModal,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Filter logs for selected date
  const dateLogs = logs.filter((log) => log.date === selectedDate);
  const dailyTotals = calculateDailyTotals(dateLogs);

  // Calorie calculations
  const remainingCalories = goals.dailyCalories - dailyTotals.calories;
  const calPercent = Math.min(
    100,
    Math.round((dailyTotals.calories / goals.dailyCalories) * 100)
  );

  // Macro percentages
  const proteinPercent = Math.min(
    100,
    Math.round((dailyTotals.protein / (goals.dailyProtein || 1)) * 100)
  );
  const carbsPercent = Math.min(
    100,
    Math.round((dailyTotals.carbs / (goals.dailyCarbs || 1)) * 100)
  );
  const fatPercent = Math.min(
    100,
    Math.round((dailyTotals.fat / (goals.dailyFat || 1)) * 100)
  );
  const fiberPercent = Math.min(
    100,
    Math.round((dailyTotals.fiber / (goals.dailyFiber || 1)) * 100)
  );

  const shiftDay = (days: number) => {
    const current = new Date(selectedDate + 'T12:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  const formatDateLabel = (dateStr: string) => {
    if (dateStr === todayStr) return "Today's Log";
    const d = new Date(dateStr + 'T12:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
      return "Yesterday's Log";
    }
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this meal from your daily history?')) {
      deleteMealLog(id);
      onRefreshLogs();
    }
  };

  const handleClearDay = () => {
    if (
      window.confirm(
        `Are you sure you want to clear all ${dateLogs.length} entries for ${formatDateLabel(
          selectedDate
        )}?`
      )
    ) {
      clearLogsForDate(selectedDate);
      onRefreshLogs();
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ date: selectedDate, totals: dailyTotals, meals: dateLogs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pixical-daily-history-${selectedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-fadeIn">
      {/* Date Header & Switcher */}
      <div className="cute-card-static p-4 sm:p-5 bg-[#111828] border-2 border-slate-700/80 text-white flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => shiftDay(-1)}
            className="p-2 rounded-xl bg-[#151e33] hover:bg-[#1c2742] border border-slate-700 text-slate-300 transition cursor-pointer active:scale-95"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="font-cute text-xl font-black text-white">
              {formatDateLabel(selectedDate)}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1 text-[11px] font-cute font-bold bg-[#0d1322] text-slate-300 rounded-lg border border-slate-700 focus:outline-none focus:border-[#0084FF]"
            />
          </div>

          <button
            type="button"
            onClick={() => shiftDay(1)}
            disabled={isToday}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isToday
                ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900 border border-slate-800'
                : 'bg-[#151e33] hover:bg-[#1c2742] border border-slate-700 text-slate-300 active:scale-95'
            }`}
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {dateLogs.length > 0 && (
            <button
              type="button"
              onClick={handleClearDay}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-[#FF334B] text-xs font-bold border border-red-500/40 transition cursor-pointer"
              title="Clear Day"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onScanNewMeal}
            className="cute-btn-green px-3 py-1.5 text-xs font-black flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Calorie Gauge & Macro Targets Widget */}
      <div className="cute-card-static p-4 sm:p-5 bg-[#111828] border-2 border-slate-700/80 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#1e293b"
                  strokeWidth="7"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#FF7A00"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * calPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <Flame className="w-4 h-4 text-[#FF7A00] fill-[#FF7A00]" />
                <span className="font-cute text-base font-black text-white leading-none">
                  {dailyTotals.calories}
                </span>
                <span className="font-sans text-[8px] font-bold text-slate-400">kcal</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-cute">
                Daily Budget
              </span>
              <div className="font-cute text-2xl font-black text-white">
                {dailyTotals.calories}{' '}
                <span className="font-sans text-xs font-bold text-slate-400">
                  / {goals.dailyCalories} kcal
                </span>
              </div>
              <div className="text-xs font-bold font-cute">
                {remainingCalories >= 0 ? (
                  <span className="text-[#00C853]">
                    {remainingCalories} kcal left today 🎯
                  </span>
                ) : (
                  <span className="text-[#FF334B]">
                    {Math.abs(remainingCalories)} kcal over target
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGoalsModal}
            className="cute-btn-blue px-3 py-2 text-[11px] font-bold cursor-pointer"
          >
            Adjust Goals
          </button>
        </div>

        {/* 4 Macro Progress Bars */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
          <div className="bg-red-950/20 p-2 rounded-xl border border-red-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-cute font-extrabold">
              <span className="text-[#FF334B]">Protein</span>
              <span className="text-slate-300">{dailyTotals.protein}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF334B] rounded-full" style={{ width: `${proteinPercent}%` }} />
            </div>
          </div>

          <div className="bg-orange-950/20 p-2 rounded-xl border border-orange-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-cute font-extrabold">
              <span className="text-[#FF7A00]">Carbs</span>
              <span className="text-slate-300">{dailyTotals.carbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: `${carbsPercent}%` }} />
            </div>
          </div>

          <div className="bg-blue-950/20 p-2 rounded-xl border border-blue-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-cute font-extrabold">
              <span className="text-[#0084FF]">Fats</span>
              <span className="text-slate-300">{dailyTotals.fat}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#0084FF] rounded-full" style={{ width: `${fatPercent}%` }} />
            </div>
          </div>

          <div className="bg-green-950/20 p-2 rounded-xl border border-green-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-cute font-extrabold">
              <span className="text-[#00C853]">Fiber</span>
              <span className="text-slate-300">{dailyTotals.fiber}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#00C853] rounded-full" style={{ width: `${fiberPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <h3 className="font-cute text-base font-black text-white flex items-center space-x-1.5">
            <Utensils className="w-4 h-4 text-[#0084FF]" />
            <span>Meals on {formatDateLabel(selectedDate)}</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400 font-cute">
            {dateLogs.length} saved
          </span>
        </div>

        {dateLogs.length === 0 ? (
          <div className="cute-card-static p-8 text-center space-y-2.5 bg-[#111828] border-2 border-slate-700/80">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Calendar className="w-6 h-6 text-[#0084FF]" />
            </div>
            <h4 className="font-cute text-lg font-bold text-white">No meals logged for this day</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
              Snap a meal photo to calculate calories and save it into your PixiCal history.
            </p>
            <button
              type="button"
              onClick={onScanNewMeal}
              className="cute-btn-green inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Snap Food Now! 📸</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dateLogs.map((entry) => {
              const isExpanded = expandedLogId === entry.id;
              const formattedTime = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="rounded-2xl bg-[#111828] border-2 border-slate-700/80 overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : entry.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/50"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                        {entry.imageThumbnail ? (
                          <img
                            src={entry.imageThumbnail}
                            alt={entry.analysis.mealTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Utensils className="w-5 h-5 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 text-[10px] font-cute font-bold">
                          <span className="px-1.5 py-0.5 rounded bg-[#0084FF] text-white">
                            {entry.mealType}
                          </span>
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formattedTime}</span>
                          </span>
                        </div>
                        <h4 className="font-cute font-bold text-sm text-white truncate mt-0.5">
                          {entry.analysis.mealTitle}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {entry.analysis.items.length} items &bull;{' '}
                          {entry.analysis.items.map((i) => i.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-center flex-shrink-0">
                      <div className="text-right">
                        <div className="font-cute font-black text-base text-white">
                          {entry.analysis.totalCalories}{' '}
                          <span className="text-[10px] text-[#FF7A00] font-sans">kcal</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-cute font-bold">
                          P:{entry.analysis.macros?.protein || 0}g &bull; C:
                          {entry.analysis.macros?.carbs || 0}g &bull; F:
                          {entry.analysis.macros?.fat || 0}g
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-1.5 text-slate-500 hover:text-[#FF334B] rounded-lg transition cursor-pointer"
                        title="Delete meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-800 bg-[#0d1322]/80 space-y-2.5 animate-fadeIn">
                      {entry.userNotes && (
                        <div className="text-xs text-slate-300 italic bg-slate-900 p-2 rounded-xl border border-slate-800">
                          Notes: {entry.userNotes}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <h5 className="font-cute text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Components Breakdown
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {entry.analysis.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1"
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-cute font-bold text-xs text-white">{item.name}</span>
                                <span className="font-cute font-black text-[#FF7A00] text-[11px]">
                                  {item.calories} kcal
                                </span>
                              </div>
                              <div className="text-slate-400 text-[10px]">
                                Portion: {item.estimatedPortion}
                              </div>
                              <div className="flex items-center space-x-2 text-slate-300 font-cute text-[10px] pt-1 border-t border-slate-800">
                                <span className="text-[#FF334B]">P: {item.protein}g</span>
                                <span className="text-[#FF7A00]">C: {item.carbs}g</span>
                                <span className="text-[#0084FF]">F: {item.fat}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
