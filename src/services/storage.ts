import { MealLogEntry, UserNutritionGoal, MealAnalysis } from '../types/food';

const STORAGE_KEYS = {
  MEAL_LOGS: 'nutrilens_meal_logs_v1',
  NUTRITION_GOALS: 'nutrilens_goals_v1',
};

export const DEFAULT_GOALS: UserNutritionGoal = {
  dailyCalories: 2000,
  dailyProtein: 130, // grams
  dailyCarbs: 220,   // grams
  dailyFat: 65,      // grams
  dailyFiber: 30,    // grams
  dailyWaterMl: 2500,
};

export function getStoredGoals(): UserNutritionGoal {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NUTRITION_GOALS);
    if (raw) {
      return { ...DEFAULT_GOALS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse nutrition goals from storage', e);
  }
  return DEFAULT_GOALS;
}

export function saveStoredGoals(goals: UserNutritionGoal): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save nutrition goals to storage', e);
  }
}

export function getStoredLogs(): MealLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEAL_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse meal logs from storage', e);
  }
  return [];
}

export function saveMealLog(
  analysis: MealAnalysis,
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage',
  imageThumbnail?: string,
  userNotes?: string,
  customDate?: string
): MealLogEntry {
  const now = new Date();
  const dateStr = customDate || now.toISOString().split('T')[0];
  
  const entry: MealLogEntry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: now.toISOString(),
    date: dateStr,
    mealType,
    imageThumbnail,
    analysis,
    userNotes,
  };

  const currentLogs = getStoredLogs();
  const updatedLogs = [entry, ...currentLogs];
  
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(updatedLogs));
  } catch (e) {
    // If quota exceeded due to large thumbnail, compress or omit thumbnail
    console.warn('Storage quota hit, saving without high-res thumbnail', e);
    entry.imageThumbnail = undefined;
    const retryLogs = [entry, ...currentLogs];
    localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(retryLogs));
  }

  return entry;
}

export function deleteMealLog(id: string): void {
  const currentLogs = getStoredLogs();
  const filtered = currentLogs.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(filtered));
}

export function clearLogsForDate(dateStr: string): void {
  const currentLogs = getStoredLogs();
  const filtered = currentLogs.filter(l => l.date !== dateStr);
  localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(filtered));
}

export function getLogsForDate(dateStr: string): MealLogEntry[] {
  const currentLogs = getStoredLogs();
  return currentLogs.filter(l => l.date === dateStr);
}

export function calculateDailyTotals(logs: MealLogEntry[]) {
  return logs.reduce(
    (acc, log) => {
      const a = log.analysis;
      acc.calories += a.totalCalories || 0;
      acc.protein += a.macros?.protein || 0;
      acc.carbs += a.macros?.carbs || 0;
      acc.fat += a.macros?.fat || 0;
      acc.fiber += a.macros?.fiber || 0;
      acc.sodium += a.macros?.sodium || 0;
      acc.sugar += a.macros?.sugar || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 }
  );
}

export function getAvailableDates(): string[] {
  const logs = getStoredLogs();
  const dates = Array.from(new Set(logs.map(l => l.date))).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  if (!dates.includes(today)) {
    dates.unshift(today);
  }
  return dates;
}
