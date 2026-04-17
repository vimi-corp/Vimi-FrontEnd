import React, { useState } from 'react';
import { Type, MousePointer2 } from 'lucide-react';
import ColorPaletteSelector from './ColorPaletteSelector';
import FontSelector from './FontSelector';

export default function EditorSidebar({ 
  template, 
  state, 
  onUpdateGlobal, 
  onUpdateColor, 
  onUpdateFont,
  onAddElement
}) {
  const [tab, setTab] = useState('Elements');

  return (
    <div className="w-[300px] bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col h-full z-30 shrink-0">
      
      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-100 p-2 gap-1 shrink-0">
        {['Elements', 'Theme', 'Background'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs font-bold rounded-lg flex-1 transition-all ${tab === t ? 'bg-white shadow-sm text-canva-purple shadow-black/5 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-slate-200'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
         {tab === 'Elements' && (
           <div className="space-y-4 animate-fade-in">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Insert Blocks</h3>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onAddElement('text')} className="flex flex-col items-center justify-center gap-3 p-5 border border-slate-200 bg-white rounded-2xl hover:border-canva-purple hover:bg-purple-50 transition-all text-slate-600 hover:text-canva-purple hover:shadow-md group">
                  <Type size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Text Box</span>
                </button>
                <button onClick={() => onAddElement('button')} className="flex flex-col items-center justify-center gap-3 p-5 border border-slate-200 bg-white rounded-2xl hover:border-canva-purple hover:bg-purple-50 transition-all text-slate-600 hover:text-canva-purple hover:shadow-md group">
                  <MousePointer2 size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Button</span>
                </button>
             </div>
             
             <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
               <p className="text-xs font-medium text-blue-800 leading-relaxed text-center">
                 Click an element on the canvas to edit its properties, or drag it to reposition.
               </p>
             </div>
           </div>
         )}
         
         {tab === 'Theme' && (
           <div className="space-y-10 animate-fade-in pb-10">
             <div className="space-y-4">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand Colors</h3>
               <ColorPaletteSelector schemes={template.colorSchemes} selected={state.color} onChange={onUpdateColor} />
             </div>
             <div className="w-full h-px bg-slate-100" />
             <div className="space-y-4">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Typography</h3>
               <FontSelector options={template.fontOptions} selected={state.font} onChange={onUpdateFont} />
             </div>
           </div>
         )}

         {tab === 'Background' && (
           <div className="space-y-5 animate-fade-in">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Canvas Setup</h3>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700 bg-white shadow-sm p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                Page Color
                <div className="flex items-center gap-2">
                   <span className="text-xs font-mono text-slate-400 uppercase">{state.global?.bg || '#F8F9FA'}</span>
                   <input type="color" value={state.global?.bg || '#F8F9FA'} onChange={(e) => onUpdateGlobal('bg', e.target.value)} className="w-7 h-7 rounded shrink-0 cursor-pointer border border-slate-200" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700 bg-white shadow-sm p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                Boxed Layout
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={state.global?.boxed || false} onChange={(e) => onUpdateGlobal('boxed', e.target.checked)} />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-canva-purple"></div>
                </label>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
