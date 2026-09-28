import React from 'react';
import { X, Camera, Sun, Utensils, Sparkles, Lightbulb } from 'lucide-react';

interface FoodTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoodTipsModal: React.FC<FoodTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tips = [
    {
      icon: <Camera className="w-5 h-5 text-[#00C853]" />,
      bg: 'bg-[#00C853]/15 border-[#00C853]/40',
      title: 'Top-Down or 45° Angle 📸',
      desc: 'Snap your photo directly overhead or at a 45-degree angle so all food items, toppings, and portion depth are clearly visible to PixiCal.',
    },
    {
      icon: <Sun className="w-5 h-5 text-[#FF7A00]" />,
      bg: 'bg-[#FF7A00]/15 border-[#FF7A00]/40',
      title: 'Good Natural Lighting ☀️',
      desc: 'Avoid heavy dark shadows or blinding flash. Soft daylight helps PixiCal identify cooking style, dressings, sauces, and garnishes.',
    },
    {
      icon: <Utensils className="w-5 h-5 text-[#0084FF]" />,
      bg: 'bg-[#0084FF]/15 border-[#0084FF]/40',
      title: 'Keep Utensils or Plate Rim in View 🍴',
      desc: 'Showing a fork, spoon, or bowl rim helps PixiCal gauge plate scale and calculate accurate portion weights in grams.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#FF334B]" />,
      bg: 'bg-[#FF334B]/15 border-[#FF334B]/40',
      title: 'Add Hidden Ingredients in Notes 📝',
      desc: 'If your meal was cooked in lots of butter, extra virgin olive oil, or has hidden sugar syrup, add a quick note for pinpoint calorie accuracy!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="cute-card-static bg-[#111828] border-2 border-slate-700/90 w-full max-w-md overflow-hidden shadow-2xl p-0 relative">
        {/* Colorful top border stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00C853] via-[#0084FF] via-[#FF7A00] to-[#FF334B]" />

        {/* Header */}
        <div className="p-5 border-b border-slate-700/80 flex items-center justify-between bg-[#151d30]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C853]/20 text-[#00C853] flex items-center justify-center border border-[#00C853]/40 shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cute text-xl font-black text-white">Food Snapping Tips</h3>
              <p className="text-xs text-slate-400 font-medium">How to get accurate calorie results</p>
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

        {/* Content */}
        <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#0d1322] border border-slate-700/80 flex items-start space-x-3.5 hover:border-slate-600 transition"
            >
              <div className={`p-2 rounded-xl flex-shrink-0 border ${tip.bg}`}>
                {tip.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-cute text-sm font-bold text-white">{tip.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{tip.desc}</p>
              </div>
            </div>
          ))}

          <div className="p-3 rounded-xl bg-[#0084FF]/10 border border-[#0084FF]/30 text-xs text-blue-200 flex items-center space-x-2">
            <span className="text-base">✨</span>
            <span>Tip: PixiCal can recognize multiple courses and side dishes in a single snapshot!</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/80 bg-[#151d30] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cute-btn-green px-5 py-2 text-xs font-black cursor-pointer"
          >
            Got it, Let&apos;s Snap! 📸
          </button>
        </div>
      </div>
    </div>
  );
};
