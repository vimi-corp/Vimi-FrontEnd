import React from 'react';
import { Check } from 'lucide-react';

export default function ColorPaletteSelector({ schemes, selected, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Color Palette</h3>
      <div className="grid grid-cols-2 gap-3">
        {schemes.map((scheme) => {
          const isSelected = selected?.name === scheme.name;
          return (
            <button
              key={scheme.name}
              onClick={() => onChange(scheme)}
              className={`relative flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                isSelected 
                  ? 'border-canva-purple bg-canva-purple/5 shadow-[0_2px_10px_rgba(139,61,255,0.1)]' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: scheme.primary }} />
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: scheme.secondary }} />
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-canva-purple' : 'text-slate-700'}`}>
                  {scheme.name}
                </span>
              </div>
              {isSelected && <Check size={16} className="text-canva-purple" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
