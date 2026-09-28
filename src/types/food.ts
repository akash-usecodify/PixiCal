export interface FoodItemComponent {
  name: string;
  estimatedPortion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: 'high' | 'medium' | 'low';
  portionVisualClue?: string;
  micronutrientHighlights?: string[];
}

export interface MacroSummary {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface MealAnalysis {
  isFood: boolean;
  mealTitle: string;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage';
  summary?: string;
  totalCalories: number;
  macros: MacroSummary;
  items: FoodItemComponent[];
  healthScore?: number;
  dietaryTags?: string[];
  dietaryAdvice?: string;
}

export interface MealLogEntry {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage';
  imageThumbnail?: string; // base64 or placeholder URL
  analysis: MealAnalysis;
  userNotes?: string;
}

export interface UserNutritionGoal {
  dailyCalories: number;
  dailyProtein: number; // in grams
  dailyCarbs: number; // in grams
  dailyFat: number; // in grams
  dailyFiber: number; // in grams
  dailyWaterMl?: number;
}

export interface SampleFoodImage {
  id: string;
  title: string;
  category: string;
  calories: number;
  thumbnail: string;
  dataUrl?: string;
  description: string;
}
