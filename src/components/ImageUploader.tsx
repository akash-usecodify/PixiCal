import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  HelpCircle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_MEALS, SampleMeal } from '../data/sampleFoods';
import { PixiCalLogo } from './PixiCalLogo';

interface ImageUploaderProps {
  onAnalyze: (base64Image: string, mimeType: string, notes?: string) => Promise<void>;
  isLoading: boolean;
  onOpenTips: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  isLoading,
  onOpenTips,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const loadingMessages = [
    '📸 Snapping plate image with PixiCal AI...',
    '🥑 Spotting each yummy food item & component...',
    '⚖️ Estimating portion sizes and volumetric weight...',
    '✨ Calculating calories & full nutrition breakdown...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = (e.target?.result as string) || '';
      const img = new Image();
      img.onload = () => {
        // Downscale large camera photos to max 1024px to ensure fast, reliable upload
        const maxDim = 1024;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setSelectedImage(compressed);
          setMimeType('image/jpeg');
        } else {
          setSelectedImage(rawDataUrl);
          setMimeType('image/jpeg');
        }
      };
      img.onerror = () => {
        setSelectedImage(rawDataUrl);
        setMimeType(file.type || 'image/jpeg');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleSelectSample = (sample: SampleMeal) => {
    setSelectedImage(sample.svgDataUrl);
    setMimeType('image/svg+xml');
    setUserNotes(`Sample meal: ${sample.name}. ${sample.description}. ${sample.chefCues}`);
  };

  const handleAnalyzeClick = () => {
    if (!selectedImage) return;
    onAnalyze(selectedImage, mimeType, userNotes.trim() || undefined);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* PixiCal Cute Mobile Hero Header */}
      <div className="text-center space-y-2.5 pt-1">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#131b2e] border border-slate-700 shadow-md text-xs font-bold font-cute">
          <span className="w-2 h-2 rounded-full bg-[#00C853] animate-ping" />
          <span className="text-slate-200">AI Food Vision Scanner</span>
          <span className="text-slate-600">|</span>
          <span className="text-[#FF7A00]">Super Fast ⚡</span>
        </div>

        <h1 className="font-cute text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Snap Your Food. <br />
          <span className="bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B] bg-clip-text text-transparent">
            Know Your Calories.
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm font-medium px-4 max-w-md mx-auto">
          Take or drop a photo of any meal. PixiCal automatically breaks down each ingredient, calories, and macros! 🥑🍕
        </p>
      </div>

      {/* Main Upload / Camera Mobile Card */}
      <div className="cute-card-static p-4 sm:p-6 relative bg-[#111828] border-2 border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Colorful top border stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B]" />

        {isCameraActive ? (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-video flex items-center justify-center border-2 border-slate-700 shadow-inner">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder corner brackets matching PixiCal Logo */}
            <div className="absolute inset-6 sm:inset-10 pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-[#00C853] rounded-tl-xl" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-[#0084FF] rounded-tr-xl" />
              </div>
              <div className="flex justify-center">
                <span className="text-[11px] font-bold font-cute text-white bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-sm shadow-md">
                  Point at your plate 📸
                </span>
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-[#00C853] rounded-bl-xl" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-[#FF7A00] rounded-br-xl" />
              </div>
            </div>

            {/* Camera controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3 px-4">
              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-2 bg-slate-900/90 text-slate-300 rounded-xl text-xs font-bold font-cute border border-slate-700 cursor-pointer hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureSnapshot}
                className="cute-btn-green flex items-center space-x-2 px-5 py-2.5 text-xs font-extrabold cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Plate!</span>
              </button>
            </div>
          </div>
        ) : selectedImage ? (
          /* Preview state */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#0a0e17] border-2 border-slate-700 aspect-[4/3] sm:aspect-video max-h-[340px] flex items-center justify-center shadow-inner">
              <img
                src={selectedImage}
                alt="Selected meal preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/90 hover:bg-[#FF334B] text-white rounded-xl backdrop-blur-sm transition cursor-pointer border border-slate-700"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#0d1322]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold font-cute text-[#00C853] flex items-center space-x-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready to analyze! 🚀</span>
              </div>
            </div>

            {/* Preparation Notes */}
            <div className="bg-[#151d30] p-3.5 rounded-2xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-cute text-slate-200 flex items-center space-x-1.5">
                  <span>📝</span>
                  <span>Extra dish notes (optional)</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  e.g. olive oil, butter, dressing
                </span>
              </div>
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Mention any cooking fats or custom portion notes"
                className="w-full px-3.5 py-2 bg-[#0d1322] text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl border border-slate-700 focus:border-[#0084FF] focus:outline-none transition font-sans font-medium"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="w-full sm:flex-1 py-3.5 px-5 cute-btn-green text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Food &amp; Calories...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Calories &amp; Breakdown ✨</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-3 bg-[#1a233a] hover:bg-[#222e4c] text-slate-300 rounded-xl text-xs font-bold font-cute border border-slate-700 transition cursor-pointer"
              >
                Retake
              </button>
            </div>
          </div>
        ) : (
          /* Mobile Dropzone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
              isDragOver
                ? 'border-[#0084FF] bg-blue-950/30 scale-[0.99]'
                : 'border-slate-700 hover:border-[#0084FF] bg-[#0d1322]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />

            {/* Cute Logo Camera Emblem */}
            <div className="w-20 h-20 mx-auto mb-3 bg-[#131b2e] rounded-3xl border-2 border-slate-700 p-2 shadow-lg flex items-center justify-center transform hover:rotate-3 transition-transform">
              <PixiCalLogo variant="icon" size="lg" />
            </div>

            <h3 className="font-cute text-xl sm:text-2xl font-black text-white mb-1">
              Snap or Drop Your Meal!
            </h3>
            <p className="text-xs text-slate-400 mb-5 max-w-xs mx-auto font-medium">
              Upload any plate, snack, or drink photo to instantly decode calories and macros.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cute-btn-blue flex items-center space-x-2 px-4 py-2.5 text-xs font-bold cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Choose Photo</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="cute-btn-orange flex items-center space-x-2 px-4 py-2.5 text-xs font-bold cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera</span>
              </button>

              <button
                type="button"
                onClick={onOpenTips}
                className="flex items-center space-x-1 px-2.5 py-2 text-slate-400 hover:text-white text-xs font-bold font-cute transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>Tips</span>
              </button>
            </div>

            {cameraError && (
              <div className="mt-4 p-3 bg-red-950/40 border border-[#FF334B]/60 rounded-xl text-[#FF334B] text-xs font-bold flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading status stepper */}
        {isLoading && (
          <div className="mt-5 p-4 rounded-xl bg-[#0d1322] border border-slate-700 space-y-2.5 shadow-md">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-4 h-4 text-[#0084FF] animate-spin flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold font-cute text-white truncate">
                  {loadingMessages[loadingStep]}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  PixiCal Vision Engine analyzing components
                </p>
              </div>
              <span className="text-[10px] font-bold font-cute text-white bg-[#0084FF] px-2.5 py-0.5 rounded-full">
                {loadingStep + 1}/4
              </span>
            </div>
            {/* Cute progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B] transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preset Cute Sample Foods - Horizontal Swipe on Mobile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <h4 className="font-cute text-base font-bold text-white">
              Try a Quick Sample Dish
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-400 font-cute">
            Swipe &rarr;
          </span>
        </div>

        {/* Horizontal mobile carousel */}
        <div className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto sm:overflow-visible pb-2 snap-x snap-mandatory scrollbar-none">
          {SAMPLE_MEALS.map((sample, idx) => {
            const badgeColors = [
              'bg-[#00C853] text-white',
              'bg-[#FF7A00] text-white',
              'bg-[#0084FF] text-white',
              'bg-[#FF334B] text-white',
            ];
            const badgeColor = badgeColors[idx % badgeColors.length];

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="cute-card text-left p-3 flex flex-col justify-between cursor-pointer group min-w-[210px] sm:min-w-0 snap-start bg-[#111828] border-2 border-slate-700/80 hover:border-[#0084FF]"
              >
                <div>
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 mb-2 border border-slate-700 relative shadow-inner">
                    <img
                      src={sample.svgDataUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-extrabold font-cute flex items-center space-x-1 shadow-sm border border-slate-700">
                      <Flame className="w-3 h-3 text-[#FF7A00] fill-[#FF7A00]" />
                      <span>~{sample.calories} kcal</span>
                    </div>
                  </div>

                  <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md font-cute mb-1 ${badgeColor}`}>
                    {sample.category}
                  </span>

                  <h5 className="font-cute font-bold text-sm text-white leading-snug group-hover:text-[#0084FF] transition-colors truncate">
                    {sample.name}
                  </h5>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-bold font-cute text-[#FF7A00] flex items-center justify-between">
                  <span>Snap this food &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
