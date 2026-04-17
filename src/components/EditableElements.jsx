import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, X, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Link2, Type, SlidersHorizontal, Crop as CropIcon, Upload, Palette } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import debounce from 'lodash/debounce';
import 'react-image-crop/dist/ReactCrop.css';

/* ── EditableText ───────────────────────────────────────────────────────── */
export function EditableText({ as: Component = 'div', value, onChange, className, ...props }) {
  const [editing, setEditing] = useState(false);
  const isObj = typeof value === 'object' && value !== null;
  const initialText = isObj ? value.text || '' : value || '';
  const initialStyles = isObj ? value.styles || {} : {};
  
  const [tempStyles, setTempStyles] = useState(initialStyles);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    setTempStyles(isObj ? value.styles || {} : {});
  }, [value, isObj]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if they clicked inside the floating toolbar
      if (editing && containerRef.current && !containerRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing, tempStyles]);

  const handleSave = () => {
    if (!editing) return;
    onChange({ text: textRef.current?.innerText || '', styles: tempStyles });
    setEditing(false);
  };

  const debouncedOnChange = useCallback(
    debounce((newText, newStyles) => {
      onChange({ text: newText, styles: newStyles });
    }, 400),
    [onChange]
  );

  const toggleStyle = (key, val) => {
    setTempStyles(prev => {
      const next = { ...prev, [key]: prev[key] === val ? undefined : val };
      debouncedOnChange(textRef.current?.innerText || '', next);
      return next;
    });
  };

  const handleColorChange = (e) => {
    const val = e.target.value;
    setTempStyles(prev => {
      const next = { ...prev, color: val };
      // Use debounce for fast inputs without freezing UI
      debouncedOnChange(textRef.current?.innerText || '', next);
      return next;
    });
  };

  const combinedStyles = {
    ...props.style,
    fontWeight: tempStyles.bold ? 'bold' : 'normal',
    fontStyle: tempStyles.italic ? 'italic' : 'normal',
    textAlign: tempStyles.align ? tempStyles.align : 'inherit',
    color: tempStyles.color || props.style?.color,
    outline: editing ? '2px dashed #8B3DFF' : 'none',
    outlineOffset: '4px',
    cursor: editing ? 'text' : 'pointer',
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {editing && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[200] bg-white shadow-2xl rounded-xl p-2 border border-slate-200 animate-fade-in-up flex items-center gap-1 min-w-max">
           <button onPointerDown={(e)=>{e.preventDefault(); toggleStyle('bold', true);}} className={`p-1.5 rounded hover:bg-slate-100 ${tempStyles.bold ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}><Bold size={14} /></button>
           <button onPointerDown={(e)=>{e.preventDefault(); toggleStyle('italic', true);}} className={`p-1.5 rounded hover:bg-slate-100 ${tempStyles.italic ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}><Italic size={14} /></button>
           <div className="w-px h-5 bg-slate-200 mx-1" />
           <button onPointerDown={(e)=>{e.preventDefault(); toggleStyle('align', 'left');}} className={`p-1.5 rounded hover:bg-slate-100 ${tempStyles.align === 'left' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}><AlignLeft size={14} /></button>
           <button onPointerDown={(e)=>{e.preventDefault(); toggleStyle('align', 'center');}} className={`p-1.5 rounded hover:bg-slate-100 ${tempStyles.align === 'center' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}><AlignCenter size={14} /></button>
           <button onPointerDown={(e)=>{e.preventDefault(); toggleStyle('align', 'right');}} className={`p-1.5 rounded hover:bg-slate-100 ${tempStyles.align === 'right' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}><AlignRight size={14} /></button>
           <div className="w-px h-5 bg-slate-200 mx-1" />
           <div className="relative flex items-center group">
             <button className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"><Palette size={14} /></button>
             <input type="color" onInput={handleColorChange} value={tempStyles.color || '#000000'} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
           </div>
        </div>
      )}

      <Component
        ref={textRef}
        {...props}
        style={combinedStyles}
        className={`${className} hover:outline hover:outline-2 hover:outline-offset-4 hover:outline-blue-500/50 hover:bg-blue-50/10 transition-all rounded-sm`}
        onClick={() => !editing && setEditing(true)}
        contentEditable={editing}
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          if (editing && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        {initialText}
      </Component>
    </div>
  );
}

/* ── EditableImage ──────────────────────────────────────────────────────── */
export function EditableImage({ src, alt, onChange, className, ...props }) {
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('Upload'); // Upload | Crop
  
  const isObj = typeof src === 'object' && src !== null;
  const imageUrl = isObj ? src.url : src;
  const imageSettings = isObj ? src.settings || {} : {};

  const [tempSrc, setTempSrc] = useState(imageUrl);
  const [tempSettings, setTempSettings] = useState(imageSettings);
  const [crop, setCrop] = useState();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTempSrc(imageUrl);
    setTempSettings(imageSettings);
  }, [src, imageUrl, isObj]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editing && containerRef.current && !containerRef.current.contains(e.target) && !e.target.closest('.ReactCrop')) {
        setEditing(false);
        setTempSrc(imageUrl); // revert
        setTempSettings(imageSettings);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing, src, imageUrl, imageSettings]);

  const handleSave = async () => {
    let finalUrl = tempSrc;
    if (tab === 'Crop' && crop && imgRef.current) {
       finalUrl = await getCroppedImg(imgRef.current, crop);
    }
    onChange({ url: finalUrl, settings: tempSettings });
    setEditing(false);
    setCrop(undefined);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempSrc(ev.target.result);
        setTab('Crop'); // suggest crop after upload
      };
      reader.readAsDataURL(file);
    }
  };

  const cssFilter = `
    brightness(${tempSettings.brightness || 1}) 
    blur(${tempSettings.blur || 0}px) 
  `.trim();

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0, 0, crop.width, crop.height
    );
    return canvas.toDataURL('image/jpeg');
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full h-full group">
      <div 
        className={`w-full h-full cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-blue-500/50 transition-all rounded-sm relative`}
        onClick={() => setEditing(true)}
      >
        <img 
          src={imageUrl} 
          alt={alt} 
          className={className} 
          style={{ ...props.style, filter: cssFilter }} 
          {...props} 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <ImageIcon size={14} /> Edit Image
          </div>
        </div>
      </div>

      {editing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-white shadow-2xl rounded-xl p-3 border border-slate-200 w-[340px] animate-fade-in-up origin-center">
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
            <button onClick={() => setTab('Upload')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md ${tab === 'Upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><Upload size={13} /> Upload</button>
            <button onClick={() => setTab('Crop')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md ${tab === 'Crop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}><CropIcon size={13} /> Crop</button>
          </div>

          <div className="min-h-[120px]">
            {tab === 'Upload' && (
              <div className="flex flex-col items-center justify-center text-center h-[120px] border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <Upload size={24} className="text-slate-400 mb-2" />
                 <span className="text-sm font-semibold text-canva-purple">Click to browse</span>
                 <span className="text-xs text-slate-400 mt-1">PNG, JPG, WebP</span>
                 <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>
            )}

            {tab === 'Crop' && (
              <div className="flex flex-col items-center">
                <p className="text-[11px] text-slate-500 font-medium mb-2">Drag to crop (Applies immediately on Save)</p>
                <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                  <img ref={imgRef} src={tempSrc} style={{ maxHeight: '180px' }} className="rounded-md mx-auto" />
                </ReactCrop>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
             <button className="w-full py-2 bg-canva-purple text-white hover:bg-canva-purple-hover rounded-lg text-sm font-semibold shadow-sm transition-transform active:scale-95" onClick={handleSave}>
               Apply Image
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── EditableButton ─────────────────────────────────────────────────────── */
export function EditableButton({ value, onChange, className, style, ...props }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const containerRef = useRef(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editing && containerRef.current && !containerRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing, tempValue]);

  const handleSave = () => {
    if(!editing) return;
    onChange(tempValue);
    setEditing(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full text-center">
      <button
        {...props}
        className={`${className} cursor-pointer hover:outline hover:outline-2 hover:outline-offset-4 hover:outline-blue-500/50 transition-all ${editing ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        onClick={() => setEditing(true)}
      >
        {value}
      </button>

      {editing && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center">
          <input
            autoFocus
            type="text"
            className={`${className} !outline-none !ring-4 !ring-purple-500/40 text-center w-full !bg-white !text-slate-900 border !border-slate-200 shadow-2xl z-50`}
            style={style}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') { setEditing(false); setTempValue(value); }
            }}
          />
        </div>
      )}
    </div>
  );
}
