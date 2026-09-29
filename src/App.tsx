/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { DailyHistory } from './components/DailyHistory';
import { GoalSettingsModal } from './components/GoalSettingsModal';
import { FoodTipsModal } from './components/FoodTipsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { InstallBanner } from './components/InstallBanner';
import { usePWAInstall } from './hooks/usePWAInstall';
import { MealAnalysis, MealLogEntry, UserNutritionGoal } from './types/food';
import { PixiCalLogo } from './components/PixiCalLogo';
import {
  getStoredLogs,
  saveMealLog,
  getStoredGoals,
  saveStoredGoals,
  getLogsForDate,
} from './services/storage';
import {
  AlertCircle,
  CheckCircle2,
  X,
  RotateCcw,
  Download,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysis | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PWA Install state
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Storage states
  const [logs, setLogs] = useState<MealLogEntry[]>([]);
  const [goals, setGoals] = useState<UserNutritionGoal>(getStoredGoals());

  // Modals & feedback
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState<boolean>(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load logs on mount
  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = () => {
    setLogs(getStoredLogs());
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper to create compressed thumbnail for storage
  const createThumbnail = (dataUrl: string, maxDim: number = 240): Promise<string> => {
    return new Promise((resolve) => {
      if (dataUrl.startsWith('data:image/svg')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const [lastAnalysisRequest, setLastAnalysisRequest] = useState<{
    base64Image: string;
    mimeType: string;
    notes?: string;
  } | null>(null);

  // Trigger computer vision food analysis
  const handleAnalyzeFood = async (
    base64Image: string,
    mimeType: string,
    notes?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentImagePreview(base64Image);
    setLastAnalysisRequest({ base64Image, mimeType, notes });

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType,
          notes,
        }),
      });

      // Safely read response as text first to guard against non-JSON (HTML 413, 502, 504 errors)
      let responseText = '';
      try {
        responseText = await response.text();
      } catch {
        throw new Error('Network error reading server response. Please tap "Retry Snap".');
      }

      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[PixiCal Client] Failed to parse response as JSON. Status:', response.status, responseText.slice(0, 200));
        if (response.status === 413) {
          throw new Error('Image size is too large. Please take a new snapshot or choose a smaller photo.');
        } else if (response.status === 504 || response.status === 502) {
          throw new Error('Vision analysis timed out. Please tap "Retry Snap" in a moment.');
        } else if (!response.ok) {
          throw new Error(`Server temporarily unavailable (${response.status}). Please try again in a moment.`);
        } else {
          throw new Error('Unexpected response format from computer vision service. Please retry.');
        }
      }

      if (!response.ok) {
        let msg = data?.error || 'Computer vision service temporarily unavailable';
        if (typeof msg === 'string' && (msg.includes('{') || msg.includes('Unexpected token'))) {
          try {
            const parsed = JSON.parse(msg);
            if (parsed.error?.message) {
              msg = parsed.error.message;
            }
          } catch {
            msg = 'Vision recognition encountered a temporary issue. Please tap "Retry Snap".';
          }
        }
        throw new Error(msg);
      }

      const analysis: MealAnalysis = data.analysis || data;
      if (!analysis || (!analysis.mealTitle && analysis.totalCalories === undefined)) {
        throw new Error('Analysis completed but did not return recognizable meal information.');
      }

      setCurrentAnalysis(analysis);
      showToast('Plate analyzed successfully! 🥑', 'success');
    } catch (err: any) {
      let friendlyError =
        err.message || 'Could not analyze food image. Please check lighting or retry.';
      if (friendlyError.includes('503') || friendlyError.includes('high demand')) {
        friendlyError =
          'Vision models are currently at high capacity. Please tap "Retry Snap" in a moment.';
      } else if (friendlyError.includes('Unexpected token') || friendlyError.includes('not valid JSON')) {
        friendlyError =
          'Server returned an unreadable response format. Please tap "Retry Snap".';
      }
      setErrorMessage(friendlyError);
      showToast('Vision recognition encountered an issue', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastAnalysis = () => {
    if (lastAnalysisRequest) {
      handleAnalyzeFood(
        lastAnalysisRequest.base64Image,
        lastAnalysisRequest.mimeType,
        lastAnalysisRequest.notes
      );
    }
  };

  const handleSaveToLog = async (
    analysis: MealAnalysis,
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage',
    notes?: string,
    date?: string
  ) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      let thumbnail: string | undefined = undefined;

      if (currentImagePreview) {
        thumbnail = await createThumbnail(currentImagePreview, 240);
      }

      saveMealLog(
        analysis,
        mealType,
        thumbnail,
        notes,
        targetDate
      );

      refreshLogs();
      showToast('Saved to your Daily Nutrition Journal! 🥑', 'success');
      setActiveTab('history');
      setCurrentAnalysis(null);
      setCurrentImagePreview(null);
    } catch (e: any) {
      showToast('Failed to save meal entry', 'error');
    }
  };

  const handleSaveGoals = (newGoals: UserNutritionGoal) => {
    saveStoredGoals(newGoals);
    setGoals(newGoals);
    showToast('Daily nutrition targets updated successfully!', 'success');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = getLogsForDate(todayStr);

  // Main page layout with rich vibrant gradient background and full-page layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050811] via-[#0a1224] to-[#040710] text-[#F1F5F9] flex flex-col selection:bg-[#00C853] selection:text-white relative overflow-x-hidden">
      {/* Luminous Ambient Mesh Gradients in PixiCal 5 signature colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#00C853]/22 via-[#00C853]/5 to-transparent blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-10 right-[-100px] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#0084FF]/24 via-[#0070F3]/8 to-transparent blur-[130px] pointer-events-none" />
        <div className="absolute top-[45%] left-[-150px] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FF7A00]/16 via-[#FF6200]/5 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#FF334B]/18 via-[#FF334B]/5 to-transparent blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#6366F1]/12 to-[#8B5CF6]/6 blur-[140px] pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#111828]/95 backdrop-blur-md text-white border-2 border-slate-700 shadow-2xl animate-fadeIn">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#00C853] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#FF334B] flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-cute font-bold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 ml-2 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Full-Width Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        todayLogs={todayLogs}
        goals={goals}
        onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* Main Full-Page Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 z-10 flex flex-col pb-24 md:pb-12">
        {/* Install Mobile Web App Banner (dismissible, hidden if installed) */}
        <InstallBanner
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          isIOS={isIOS}
          isAndroid={isAndroid}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onInstall={install}
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="w-full max-w-xl mx-auto mb-5 p-4 rounded-2xl bg-[#1f131a]/90 backdrop-blur-md border-2 border-[#FF334B] text-rose-200 text-sm flex items-start justify-between gap-3 animate-fadeIn shadow-[0_4px_16px_rgba(255,51,75,0.25)]">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#FF334B] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-cute font-bold text-white text-sm">
                  PixiCal Vision Alert
                </strong>
                <p className="text-xs text-rose-300 font-medium mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {lastAnalysisRequest && (
                <button
                  onClick={handleRetryLastAnalysis}
                  disabled={isLoading}
                  className="cute-btn-red px-3 py-1.5 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Retry</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="text-[#FF334B] hover:text-white p-1 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Analyze Food */}
        {activeTab === 'analyze' && (
          <div className="w-full">
            {currentAnalysis ? (
              <AnalysisResult
                analysis={currentAnalysis}
                imagePreviewUrl={currentImagePreview}
                onSaveToLog={handleSaveToLog}
                onScanAnother={() => {
                  setCurrentAnalysis(null);
                  setCurrentImagePreview(null);
                  setErrorMessage(null);
                }}
              />
            ) : (
              <ImageUploader
                onAnalyze={handleAnalyzeFood}
                isLoading={isLoading}
                onOpenTips={() => setIsTipsModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Tab 2: Daily History & Logs */}
        {activeTab === 'history' && (
          <div className="w-full">
            <DailyHistory
              logs={logs}
              goals={goals}
              onRefreshLogs={refreshLogs}
              onScanNewMeal={() => {
                setCurrentAnalysis(null);
                setCurrentImagePreview(null);
                setActiveTab('analyze');
              }}
              onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        todayLogs={todayLogs}
        onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
        onOpenTipsModal={() => setIsTipsModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* Cute PixiCal Footer with Akash Suresh LinkedIn Credit */}
      <footer className="border-t-2 border-slate-800/80 bg-[#0d1322]/95 backdrop-blur-md py-6 text-xs text-slate-400 font-medium z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2.5">
            <PixiCalLogo variant="icon" size="sm" />
            <div className="flex items-baseline space-x-2">
              <span className="font-cute font-extrabold text-base text-white">PixiCal</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-[#FF7A00] font-cute font-bold">
                Snap Your Food. Know Your Calories.
              </span>
            </div>
          </div>

          {/* User Requested Credit: made with love by akash suresh linked to linkedin */}
          <div className="flex items-center space-x-1.5 font-cute text-sm font-bold text-slate-200 bg-[#151e33] px-4 py-2 rounded-2xl border-2 border-slate-700 shadow-md">
            <span>Made with</span>
            <span className="text-[#FF334B] animate-pulse text-base inline-block">❤️</span>
            <span>by</span>
            <a
              href="https://www.linkedin.com/in/akashsuresh24/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0084FF] hover:text-[#38BDF8] underline decoration-2 underline-offset-4 font-black transition-colors"
            >
              Akash Suresh
            </a>
          </div>

          {/* Quick links with cute colored icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 font-cute font-bold text-xs flex-wrap justify-center">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#00C853] hover:underline transition cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App 📲</span>
            </button>
            <button
              onClick={() => setIsTipsModalOpen(true)}
              className="text-slate-300 hover:text-[#0084FF] transition cursor-pointer"
            >
              Snapping Tips 💡
            </button>
            <button
              onClick={() => setIsGoalsModalOpen(true)}
              className="text-slate-300 hover:text-[#00C853] transition cursor-pointer"
            >
              Calorie Goals 🎯
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GoalSettingsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        currentGoals={goals}
        onSaveGoals={handleSaveGoals}
      />

      <FoodTipsModal
        isOpen={isTipsModalOpen}
        onClose={() => setIsTipsModalOpen(false)}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isAndroid={isAndroid}
        onInstall={install}
      />
    </div>
  );
}
