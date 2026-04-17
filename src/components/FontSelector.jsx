import React from 'react';
import { Check } from 'lucide-react';

export default function FontSelector({ options, selected, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Typography</h3>
      <div className="grid grid-cols-1 gap-3">
        {options.map((font) => {
          const isSelected = selected?.name === font.name;
          return (
            <button
              key={font.name}
              onClick={() => onChange(font)}
              className={`relative flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                isSelected 
                  ? 'border-canva-purple bg-canva-purple/5 shadow-[0_2px_10px_rgba(139,61,255,0.1)]' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className={`text-sm mb-1 ${isSelected ? 'text-canva-purple font-medium' : 'text-slate-500'}`}>
                  {font.name}
                </span>
                <span className="text-xl text-slate-900" style={{ fontFamily: font.value }}>
                  Ag
                </span>
              </div>
              {isSelected && <Check size={18} className="text-canva-purple" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
