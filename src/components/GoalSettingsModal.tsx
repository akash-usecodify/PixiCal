import React, { useState } from 'react';
import { X, Target, Sparkles, Check, RotateCcw } from 'lucide-react';
import { UserNutritionGoal } from '../types/food';
import { DEFAULT_GOALS } from '../services/storage';

interface GoalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: UserNutritionGoal;
  onSaveGoals: (goals: UserNutritionGoal) => void;
}

export const GoalSettingsModal: React.FC<GoalSettingsModalProps> = ({
  isOpen,
  onClose,
  currentGoals,
  onSaveGoals,
}) => {
  const [goals, setGoals] = useState<UserNutritionGoal>(currentGoals);

  if (!isOpen) return null;

  const presets = [
    {
      name: 'Balanced Healthy 🥗',
      calories: 2000,
      protein: 130,
      carbs: 220,
      fat: 65,
      fiber: 30,
      description: 'Standard maintenance nutrition with whole foods',
      color: 'border-[#00C853] hover:border-[#00C853] hover:bg-[#00C853]/10',
      badge: 'bg-[#00C853]',
    },
    {
      name: 'Weight Loss / Cut 🔥',
      calories: 1700,
      protein: 145,
      carbs: 140,
      fat: 55,
      fiber: 32,
      description: 'Caloric deficit with high protein to stay lean',
      color: 'border-[#FF334B] hover:border-[#FF334B] hover:bg-[#FF334B]/10',
      badge: 'bg-[#FF334B]',
    },
    {
      name: 'Muscle Gain / Bulk 💪',
      calories: 2600,
      protein: 165,
      carbs: 310,
      fat: 75,
      fiber: 35,
      description: 'Nutrient-rich caloric surplus for muscle growth',
      color: 'border-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10',
      badge: 'bg-[#FF7A00]',
    },
    {
      name: 'Low Carb / Keto 🥑',
      calories: 1850,
      protein: 125,
      carbs: 35,
      fat: 135,
      fiber: 25,
      description: 'Healthy fats & low glycemic carbohydrate targets',
      color: 'border-[#0084FF] hover:border-[#0084FF] hover:bg-[#0084FF]/10',
      badge: 'bg-[#0084FF]',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setGoals({
      dailyCalories: p.calories,
      dailyProtein: p.protein,
      dailyCarbs: p.carbs,
      dailyFat: p.fat,
      dailyFiber: p.fiber,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(goals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="cute-card-static bg-[#111828] border-2 border-slate-700/90 w-full max-w-lg overflow-hidden shadow-2xl p-0 relative">
        {/* Colorful top border stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B]" />

        {/* Header */}
        <div className="p-5 border-b border-slate-700/80 flex items-center justify-between bg-[#151d30]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0084FF]/20 text-[#0084FF] flex items-center justify-center border border-[#0084FF]/40 shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cute text-xl sm:text-2xl font-black text-white">Daily Nutrition Goals</h3>
              <p className="text-xs text-slate-400 font-medium">Set your daily calorie allowance and macro targets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-cute font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Quick Presets</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-left p-3 rounded-2xl bg-[#0d1322] border-2 transition cursor-pointer hover:-translate-y-0.5 ${preset.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cute text-xs sm:text-sm font-bold text-white">{preset.name}</span>
                    <span className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full ${preset.badge}`}>
                      {preset.calories} kcal
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.description}</div>
                  <div className="text-[10px] font-bold text-slate-300 mt-1.5 flex space-x-2">
                    <span className="text-[#FF334B]">P: {preset.protein}g</span>
                    <span className="text-[#FF7A00]">C: {preset.carbs}g</span>
                    <span className="text-[#00C853]">F: {preset.fat}g</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Calories Target */}
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="dailyCalories" className="font-cute text-sm font-bold text-white flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                <span>Daily Energy Target</span>
              </label>
              <div className="text-xs font-bold text-[#FF7A00] font-cute">
                {goals.dailyCalories} kcal / day
              </div>
            </div>
            <div className="relative">
              <input
                id="dailyCalories"
                type="number"
                min="800"
                max="6000"
                step="50"
                value={goals.dailyCalories}
                onChange={(e) =>
                  setGoals({ ...goals, dailyCalories: parseInt(e.target.value) || 2000 })
                }
                className="w-full bg-[#151d30] border-2 border-slate-700 rounded-xl px-4 py-2.5 text-white font-cute font-bold text-lg focus:outline-none focus:border-[#FF7A00] transition"
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">kcal</span>
            </div>
          </div>

          {/* Macronutrients Grid */}
          <div>
            <span className="text-xs font-cute font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Target Macronutrients
            </span>
            <div className="grid grid-cols-2 gap-3">
              {/* Protein */}
              <div className="p-3 rounded-2xl bg-[#0d1322] border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs font-cute font-bold text-[#FF334B]">
                  <span>Protein</span>
                  <span>g</span>
                </div>
                <input
                  type="number"
                  min="20"
                  max="350"
                  value={goals.dailyProtein}
                  onChange={(e) =>
                    setGoals({ ...goals, dailyProtein: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#151d30] border-2 border-slate-700 rounded-xl px-3 py-1.5 text-white font-cute font-bold text-base focus:outline-none focus:border-[#FF334B] transition"
                />
              </div>

              {/* Carbs */}
              <div className="p-3 rounded-2xl bg-[#0d1322] border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs font-cute font-bold text-[#FF7A00]">
                  <span>Carbohydrates</span>
                  <span>g</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="600"
                  value={goals.dailyCarbs}
                  onChange={(e) =>
                    setGoals({ ...goals, dailyCarbs: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#151d30] border-2 border-slate-700 rounded-xl px-3 py-1.5 text-white font-cute font-bold text-base focus:outline-none focus:border-[#FF7A00] transition"
                />
              </div>

              {/* Fat */}
              <div className="p-3 rounded-2xl bg-[#0d1322] border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs font-cute font-bold text-[#00C853]">
                  <span>Healthy Fats</span>
                  <span>g</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="250"
                  value={goals.dailyFat}
                  onChange={(e) =>
                    setGoals({ ...goals, dailyFat: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#151d30] border-2 border-slate-700 rounded-xl px-3 py-1.5 text-white font-cute font-bold text-base focus:outline-none focus:border-[#00C853] transition"
                />
              </div>

              {/* Fiber */}
              <div className="p-3 rounded-2xl bg-[#0d1322] border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs font-cute font-bold text-[#0084FF]">
                  <span>Dietary Fiber</span>
                  <span>g</span>
                </div>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={goals.dailyFiber}
                  onChange={(e) =>
                    setGoals({ ...goals, dailyFiber: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#151d30] border-2 border-slate-700 rounded-xl px-3 py-1.5 text-white font-cute font-bold text-base focus:outline-none focus:border-[#0084FF] transition"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setGoals(DEFAULT_GOALS)}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition font-cute font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cute-btn-blue flex items-center space-x-1.5 px-5 py-2.5 text-xs font-black cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Nutrition Goals</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
