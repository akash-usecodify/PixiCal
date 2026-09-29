import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
  Scale,
  PlusCircle,
  Tag,
  Heart,
  Utensils,
  Award
} from 'lucide-react';
import { MealAnalysis, FoodItemComponent } from '../types/food';

interface AnalysisResultProps {
  analysis: MealAnalysis;
  imagePreviewUrl?: string | null;
  onSaveToLog: (
    analysis: MealAnalysis,
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage',
    notes?: string,
    date?: string
  ) => void;
  onScanAnother: () => void;
  isSaved?: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  imagePreviewUrl,
  onSaveToLog,
  onScanAnother,
  isSaved = false,
}) => {
  const [selectedMealType, setSelectedMealType] = useState<
    'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage'
  >(
    (analysis.mealType as any) ||
      (() => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Breakfast';
        if (hour < 16) return 'Lunch';
        if (hour < 21) return 'Dinner';
        return 'Snack';
      })()
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [saveNotes, setSaveNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(isSaved);

  const items = Array.isArray(analysis?.items) ? analysis.items : [];
  const { protein = 0, carbs = 0, fat = 0, fiber = 0, sugar = 0, sodium = 0 } =
    analysis?.macros || {};
  const totalCalories = analysis?.totalCalories || (protein * 4 + carbs * 4 + fat * 9) || 0;

  // Calculate macro calorie percentages
  const proteinKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatKcal = fat * 9;
  const macroSumKcal = Math.max(1, proteinKcal + carbsKcal + fatKcal);

  const proteinPct = Math.round((proteinKcal / macroSumKcal) * 100);
  const carbsPct = Math.round((carbsKcal / macroSumKcal) * 100);
  const fatPct = Math.round((fatKcal / macroSumKcal) * 100);

  const handleSave = () => {
    onSaveToLog(analysis, selectedMealType, saveNotes.trim() || undefined, selectedDate);
    setSavedSuccess(true);
  };

  const getConfidenceBadge = (confidence: FoodItemComponent['confidence']) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-cute bg-[#00C853]/20 text-[#00E676] border border-[#00C853]/40 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-[#00E676]" />
            <span>High Accuracy</span>
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-cute bg-[#FF7A00]/20 text-[#FFA726] border border-[#FF7A00]/40 flex items-center space-x-1">
            <Info className="w-3 h-3 text-[#FFA726]" />
            <span>Estimated</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-cute bg-slate-800 text-slate-300 border border-slate-700">
            Moderate
          </span>
        );
    }
  };

  // PixiCal 5-Color rotation
  const itemColors = [
    { bg: 'bg-[#00C853]', text: 'text-[#00C853]', border: 'border-[#00C853]' },
    { bg: 'bg-[#0084FF]', text: 'text-[#0084FF]', border: 'border-[#0084FF]' },
    { bg: 'bg-[#FF7A00]', text: 'text-[#FF7A00]', border: 'border-[#FF7A00]' },
    { bg: 'bg-[#FF334B]', text: 'text-[#FF334B]', border: 'border-[#FF334B]' },
    { bg: 'bg-[#38BDF8]', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-fadeIn">
      {!analysis.isFood ? (
        <div className="cute-card-static p-6 sm:p-8 text-center space-y-4 bg-[#111828] border-2 border-slate-700 text-white">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border-2 border-[#FF334B] mx-auto flex items-center justify-center text-[#FF334B]">
            <Utensils className="w-7 h-7" />
          </div>
          <h2 className="font-cute text-2xl font-black text-white">Oops! No Food Detected 🍽️</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
            PixiCal couldn&apos;t identify any clear edible dish in this photo. Please ensure good lighting and snap directly at your plate!
          </p>
          <button
            type="button"
            onClick={onScanAnother}
            className="cute-btn-blue px-5 py-2.5 text-xs font-bold cursor-pointer"
          >
            Snap Another Photo
          </button>
        </div>
      ) : (
        <>
          {/* Top Result Banner */}
          <div className="cute-card-static p-5 sm:p-6 bg-[#111828] border-2 border-slate-700/80 text-white relative overflow-hidden shadow-2xl">
            {/* Colorful top border stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B]" />

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold font-cute bg-[#0084FF] text-white shadow-xs">
                  {analysis.mealType || 'Meal'} 🍽️
                </span>

                {analysis.healthScore && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold font-cute bg-[#00C853] text-white flex items-center space-x-1">
                    <Heart className="w-3 h-3 fill-white" />
                    <span>Health: {analysis.healthScore}/10</span>
                  </span>
                )}

                <span className="text-[11px] font-bold text-slate-400 font-cute">
                  {items.length} items detected
                </span>
              </div>

              {/* Title & Image row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <h2 className="font-cute text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {analysis.mealTitle}
                  </h2>
                  {analysis.summary && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium line-clamp-3">
                      {analysis.summary}
                    </p>
                  )}
                </div>

                {imagePreviewUrl && (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-md flex-shrink-0">
                    <img
                      src={imagePreviewUrl}
                      alt={analysis.mealTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Big Calorie Callout Strip */}
              <div className="bg-[#151e33] p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[#FF7A00] fill-[#FF7A00] animate-bounce" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-cute leading-none">
                      Total Energy
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">
                      Entire portion scanned
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-cute text-3xl font-black text-white leading-none">
                    {totalCalories}
                  </span>
                  <span className="font-sans text-xs font-bold text-[#FF7A00] ml-1">kcal</span>
                </div>
              </div>

              {/* Dietary Tags */}
              {analysis.dietaryTags && analysis.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {analysis.dietaryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold font-cute bg-[#1a233a] text-slate-200 border border-slate-700"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#00C853]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Macronutrient Mobile Card */}
          <div className="cute-card-static p-4 sm:p-5 bg-[#111828] border-2 border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-cute text-base font-black text-white flex items-center space-x-2">
                <span>🥗</span>
                <span>Macronutrient Breakdown</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400 font-cute">Ratios</span>
            </div>

            {/* Distribution Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700 shadow-inner">
                <div
                  className="bg-[#FF334B] h-full transition-all"
                  style={{ width: `${proteinPct}%` }}
                  title={`Protein: ${proteinPct}%`}
                />
                <div
                  className="bg-[#FF7A00] h-full transition-all"
                  style={{ width: `${carbsPct}%` }}
                  title={`Carbs: ${carbsPct}%`}
                />
                <div
                  className="bg-[#0084FF] h-full transition-all"
                  style={{ width: `${fatPct}%` }}
                  title={`Fat: ${fatPct}%`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold font-cute text-slate-300 px-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF334B]" />
                  <span>Protein ({proteinPct}%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
                  <span>Carbs ({carbsPct}%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0084FF]" />
                  <span>Fats ({fatPct}%)</span>
                </span>
              </div>
            </div>

            {/* 4 Primary Macro Badges */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-red-950/30 p-2.5 rounded-xl border border-red-500/40 text-center">
                <span className="text-[10px] text-[#FF334B] font-extrabold uppercase font-cute block">Protein</span>
                <div className="font-cute text-lg font-black text-white mt-0.5">{protein}g</div>
                <span className="text-[9px] text-slate-400 font-medium">{proteinKcal} kcal</span>
              </div>
              <div className="bg-orange-950/30 p-2.5 rounded-xl border border-orange-500/40 text-center">
                <span className="text-[10px] text-[#FF7A00] font-extrabold uppercase font-cute block">Carbs</span>
                <div className="font-cute text-lg font-black text-white mt-0.5">{carbs}g</div>
                <span className="text-[9px] text-slate-400 font-medium">{carbsKcal} kcal</span>
              </div>
              <div className="bg-blue-950/30 p-2.5 rounded-xl border border-blue-500/40 text-center">
                <span className="text-[10px] text-[#0084FF] font-extrabold uppercase font-cute block">Fats</span>
                <div className="font-cute text-lg font-black text-white mt-0.5">{fat}g</div>
                <span className="text-[9px] text-slate-400 font-medium">{fatKcal} kcal</span>
              </div>
              <div className="bg-green-950/30 p-2.5 rounded-xl border border-green-500/40 text-center">
                <span className="text-[10px] text-[#00C853] font-extrabold uppercase font-cute block">Fiber</span>
                <div className="font-cute text-lg font-black text-white mt-0.5">{fiber}g</div>
                <span className="text-[9px] text-slate-400 font-medium">Gut health</span>
              </div>
            </div>
          </div>

          {/* Component-by-Component Calorie Share */}
          {analysis.items.length > 1 && (
            <div className="cute-card-static p-4 sm:p-5 bg-[#111828] border-2 border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-cute text-sm font-black text-white flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-[#0084FF]" />
                  <span>Calorie Contribution by Item</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-400 font-cute">Share</span>
              </div>

              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700">
                {items.map((item, idx) => {
                  const sharePct = Math.max(
                    3,
                    Math.round(((item.calories || 0) / (totalCalories || 1)) * 100)
                  );
                  const color = itemColors[idx % itemColors.length];
                  return (
                    <div
                      key={idx}
                      className={`${color.bg} h-full transition-all`}
                      style={{ width: `${sharePct}%` }}
                      title={`${item.name}: ${item.calories} kcal (${sharePct}%)`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold font-cute">
                {items.map((item, idx) => {
                  const sharePct = Math.round(
                    ((item.calories || 0) / (totalCalories || 1)) * 100
                  );
                  const color = itemColors[idx % itemColors.length];
                  return (
                    <span key={idx} className="flex items-center space-x-1 text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                      <span className="truncate max-w-[120px]">{item.name}</span>
                      <span className="text-slate-400 font-sans text-[10px]">({sharePct}%)</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recognized Components List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-cute text-lg font-black text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                <span>Components &amp; Breakdown</span>
              </h3>
              <span className="text-xs font-bold font-cute text-[#00C853] bg-[#00C853]/15 px-2.5 py-0.5 rounded-lg border border-[#00C853]/30">
                {items.length} Items 🥑
              </span>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const color = itemColors[idx % itemColors.length];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#111828] border-2 border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        <span className={`w-3 h-3 rounded-full ${color.bg} mt-1 flex-shrink-0`} />
                        <div>
                          <h4 className="font-cute font-bold text-base text-white leading-snug">
                            {item.name}
                          </h4>
                          <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5 font-medium">
                            <Scale className="w-3 h-3 text-slate-500" />
                            <span>Portion: <strong>{item.estimatedPortion}</strong></span>
                          </div>
                        </div>
                      </div>

                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 font-cute font-black text-xs text-[#FF7A00]">
                        {item.calories} <span className="text-[9px] font-sans text-slate-400">kcal</span>
                      </span>
                    </div>

                    {item.portionVisualClue && (
                      <p className="text-[11px] text-slate-300 bg-[#0d1322] p-2 rounded-xl border border-slate-800 italic font-medium">
                        &ldquo;{item.portionVisualClue}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <div className="flex items-center space-x-2.5 font-cute font-bold text-[11px]">
                        <span className="text-[#FF334B]">P: {item.protein}g</span>
                        <span className="text-[#FF7A00]">C: {item.carbs}g</span>
                        <span className="text-[#0084FF]">F: {item.fat}g</span>
                      </div>
                      {getConfidenceBadge(item.confidence)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dietitian Tip */}
          {analysis.dietaryAdvice && (
            <div className="bg-[#0f1d18] border border-[#00C853]/40 rounded-2xl p-4 text-xs flex items-start space-x-3">
              <Award className="w-5 h-5 text-[#00C853] flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-cute font-bold text-[#00C853] block text-sm">
                  Dietitian &amp; Nutrition Tip
                </span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {analysis.dietaryAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Save to Log Mobile Card */}
          <div className="cute-card-static p-4 sm:p-5 bg-[#111828] border-2 border-slate-700/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-cute text-base font-black text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#0084FF]" />
                <span>Save to Daily History</span>
              </h3>
              {savedSuccess && (
                <div className="flex items-center space-x-1 text-[#00C853] text-[11px] font-bold font-cute">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved! 🎉</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold font-cute text-slate-400 mb-1">
                  Course
                </label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-[#0d1322] text-white rounded-xl border border-slate-700 text-xs font-cute font-bold focus:outline-none focus:border-[#0084FF]"
                >
                  <option value="Breakfast">Breakfast 🍳</option>
                  <option value="Lunch">Lunch 🥗</option>
                  <option value="Dinner">Dinner 🍲</option>
                  <option value="Snack">Snack 🍎</option>
                  <option value="Beverage">Beverage 🥤</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-cute text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#0d1322] text-white rounded-xl border border-slate-700 text-xs font-bold focus:outline-none focus:border-[#0084FF]"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="Personal notes (e.g. Post workout)"
                className="w-full px-3 py-2 bg-[#0d1322] text-white placeholder-slate-500 rounded-xl border border-slate-700 text-xs font-medium focus:outline-none focus:border-[#0084FF]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={savedSuccess}
                className={`flex-1 py-3 rounded-xl font-bold font-cute text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                  savedSuccess
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                    : 'cute-btn-green'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Logged in History</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save to History ⭐</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onScanAnother}
                className="px-4 py-3 bg-[#151e33] hover:bg-[#1a2640] text-slate-200 text-xs font-bold font-cute rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Snap Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
