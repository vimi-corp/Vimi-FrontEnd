import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { EditableText, EditableImage, EditableButton } from './EditableElements';
import StructuredCompleteStore from './StructuredCompleteStore';
import clsx from 'clsx';

function DraggableNode({ id, initialX, initialY, onDragEnd, children }) {
  const [pos, setPos] = useState({ x: initialX || 0, y: initialY || 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    setPos({ x: initialX || 0, y: initialY || 0 });
  }, [initialX, initialY]);

  const handlePointerDown = (e) => {
    if (e.target.closest('button, input, textarea, [contenteditable="true"]')) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    wasDraggedRef.current = false;
    dragRef.current = { startX: e.clientX, startY: e.clientY, initX: pos.x, initY: pos.y, hasDragged: false };

    const handleMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.hasDragged = true;
      }
      setPos({ x: dragRef.current.initX + dx, y: dragRef.current.initY + dy });
    };

    const handleUp = (ev) => {
      setIsDragging(false);
      wasDraggedRef.current = dragRef.current && dragRef.current.hasDragged;

      if (dragRef.current && onDragEnd && dragRef.current.hasDragged) {
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        onDragEnd(id, dragRef.current.initX + dx, dragRef.current.initY + dy);
      }
      dragRef.current = null;
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  const handleClickCapture = (e) => {
    if (wasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      wasDraggedRef.current = false;
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={clsx(
        "absolute top-0 left-0 transition-shadow duration-200",
        isDragging ? "cursor-grabbing z-[100] shadow-2xl ring-2 ring-purple-500 rounded-lg scale-[1.02]" : "cursor-grab hover:ring-2 hover:ring-purple-300 hover:rounded-lg"
      )}
    >
      {children}
    </div>
  );
}

export default function TemplatePreview({ template, colorScheme, fontOption, overrides, onOverrideChange }) {
  const primary = colorScheme?.primary || template.primaryColor;
  const secondary = colorScheme?.secondary || template.accentColor;
  const fontFamily = fontOption?.value || 'sans-serif';

  const content = { ...template.defaultContent, ...overrides };
  const positions = overrides.positions || {};
  const elements = [...(template.defaultContent?.elements || []), ...(overrides.elements || [])];

  const handleDragEnd = (id, x, y) => {
    onOverrideChange('positions', { ...positions, [id]: { x, y } });
  };

  const handleReset = () => {
    Object.keys(overrides).forEach(k => onOverrideChange(k, undefined));
  };

  // Dual Mode Architecture: Render structured responsive layouts for Complete Store template
  if (template.id === 'tmpl_complete_store') {
    return (
      <StructuredCompleteStore 
        template={template}
        colorScheme={colorScheme}
        fontOption={fontOption}
        overrides={overrides}
        onOverrideChange={onOverrideChange}
      />
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col bg-white" style={{ fontFamily }}>
      {/* Browser Chrome Header (Mac Style) */}
      <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="flex-1 mx-6 bg-white rounded-md h-6 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold tracking-wider">
          {(() => {
            const raw = content.storeName || template.name;
            const text = typeof raw === 'string' ? raw : (raw?.text || '');
            return text ? `${text.replace(/\s+/g, '').toLowerCase()}.vimi.id.vn` : 'your-store.vimi.id.vn';
          })()}
        </div>
      </div>

      {/* Free-form Canvas Mode */}
      <div className="flex-1 relative overflow-hidden select-none transition-colors duration-500" style={{ backgroundColor: secondary }}>

        <div className="absolute top-4 right-4 z-[200]">
          <button onClick={handleReset} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white/70 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm transition-all hover:bg-white hover:scale-105 border border-white">
            <RotateCcw size={12} /> Reset Positions & Edits
          </button>
        </div>

        {/* Store Name Header Element */}
        <DraggableNode id="header" initialX={positions.header?.x || 40} initialY={positions.header?.y || 40} onDragEnd={handleDragEnd}>
          <div className="font-black text-2xl tracking-tighter" style={{ color: primary }}>
            <EditableText as="span" value={content.storeName || template.name} onChange={(val) => onOverrideChange('storeName', val)} />
          </div>
        </DraggableNode>

        {/* Hero Title */}
        <DraggableNode id="heroTitle" initialX={positions.heroTitle?.x || 60} initialY={positions.heroTitle?.y || 160} onDragEnd={handleDragEnd}>
          <EditableText as="h1" className="text-5xl md:text-6xl font-black text-slate-900 drop-shadow-sm leading-tight max-w-xl" value={content.heroTitle || 'Discover the new collection'} onChange={(val) => onOverrideChange('heroTitle', val)} />
        </DraggableNode>

        {/* Hero Subtitle */}
        <DraggableNode id="heroSub" initialX={positions.heroSub?.x || 60} initialY={positions.heroSub?.y || 320} onDragEnd={handleDragEnd}>
          <EditableText as="p" className="text-lg font-medium text-slate-600 max-w-[400px] leading-relaxed" value={content.heroSubtitle || 'Elevate your lifestyle with our premium handpicked products tailored just for you. Shop the trend.'} onChange={(val) => onOverrideChange('heroSubtitle', val)} />
        </DraggableNode>

        {/* CTA Button */}
        <DraggableNode id="heroCta" initialX={positions.heroCta?.x || 60} initialY={positions.heroCta?.y || 440} onDragEnd={handleDragEnd}>
          <EditableButton
            className="px-8 py-3.5 outline-none rounded-2xl text-white font-bold shadow-lg shadow-black/10 transition-transform active:scale-95"
            style={{ backgroundColor: primary }}
            value={content.ctaText || 'Shop Now'}
            onChange={(val) => onOverrideChange('ctaText', val)}
          />
        </DraggableNode>

        {/* Product Image Node 1 */}
        <DraggableNode id="img1" initialX={positions.img1?.x || 600} initialY={positions.img1?.y || 100} onDragEnd={handleDragEnd}>
          <div className="w-[320px] h-[400px] rounded-[32px] overflow-hidden shadow-2xl shadow-black/15 relative group bg-white p-3 rotate-2 hover:rotate-0 transition-transform duration-300">
            <EditableImage
              src={content.productImage1 || template.previewImages?.[0] || template.thumbnail}
              className="w-full h-full object-cover rounded-2xl"
              onChange={(val) => onOverrideChange('productImage1', val)}
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="font-bold text-sm text-slate-800">Featured Item</p>
              <p className="text-xs font-black mt-1" style={{ color: primary }}>$129.00</p>
            </div>
          </div>
        </DraggableNode>

        {/* Decorative Element */}
        <DraggableNode id="decor1" initialX={positions.decor1?.x || 850} initialY={positions.decor1?.y || 400} onDragEnd={handleDragEnd}>
          <div className="w-40 h-40 rounded-full mix-blend-multiply opacity-20 blur-2xl pointer-events-none" style={{ backgroundColor: primary }} />
        </DraggableNode>

        {/* Custom Injected Elements via Sidebar */}
        {elements.map((el) => (
          <DraggableNode key={el.id} id={el.id} initialX={positions[el.id]?.x || el.x} initialY={positions[el.id]?.y || el.y} onDragEnd={handleDragEnd}>
            {el.type === 'text' && (
              <EditableText as="div" className="text-xl font-bold text-slate-800" value={content[el.id] || { text: 'New Text Block' }} onChange={(val) => onOverrideChange(el.id, val)} />
            )}
            {el.type === 'button' && (
              <EditableButton className="px-6 py-2.5 rounded-xl text-white font-bold bg-slate-900 shadow-md backdrop-blur-md transition-transform hover:scale-105 active:scale-95" value={content[el.id] || 'New Button'} onChange={(val) => onOverrideChange(el.id, val)} />
            )}
          </DraggableNode>
        ))}

      </div>
    </div>
  )
}
