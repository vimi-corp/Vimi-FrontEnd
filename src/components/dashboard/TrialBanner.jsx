import React, { useState } from 'react';
import { AlertCircle, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function TrialBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className={clsx(
      "relative mb-8 rounded-2xl overflow-hidden border border-[#8B3DFF]/20",
      "p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between animate-fade-in"
    )}>
      {/* Background with slight gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B3DFF]/5 to-[#00C4CC]/5" />
      
      <div className="relative flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#8B3DFF]/20 text-[#8B3DFF]">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink">You're on the free trial.</h3>
          <p className="text-xs text-ink-muted mt-0.5">Your trial expires in 14 days. Upgrade now to unlock custom domains and remove Vimi branding.</p>
        </div>
      </div>

      <div className="relative flex items-center gap-3 shrink-0 self-end sm:self-center">
        <button
          onClick={() => navigate('/pricing')}
          className="bg-[#1A1D23] hover:bg-[#2C313B] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Select a Plan
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-ink-subtle hover:text-ink transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
