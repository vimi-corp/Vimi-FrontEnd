import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, Check, Eye, Palette,
  Sparkles, SlidersHorizontal, X, ArrowRight, ArrowLeft,
  ChevronLeft, ChevronRight, Zap, Star, Clock, Monitor,
  LayoutDashboard, CreditCard, Lightbulb, BookOpen,
  TrendingUp, HelpCircle, Wand2, PlusCircle,
} from 'lucide-react';
import { MOCK_TEMPLATES, TEMPLATE_CATEGORIES, THEME_COLORS } from './mockTemplates';
import InteractivePreview from '../../components/InteractivePreview';

// ---------------------------------------------------------------------------
// TemplateGallery — Shown once to new users so they can choose a store theme.
// After selection, sets localStorage flag and redirects to /dashboard.
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest',  label: 'Newest'  },
  { value: 'az',      label: 'A – Z'   },
];

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-surface-border shadow-card animate-pulse">
      <div className="aspect-[16/11] bg-gradient-to-br from-surface-hover to-surface-border" />
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-md bg-surface-hover" />
          <div className="h-5 w-14 rounded-full bg-surface-hover" />
        </div>
        <div className="h-3.5 w-full rounded-md bg-surface-hover" />
        <div className="h-3.5 w-3/4 rounded-md bg-surface-hover" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 flex-1 rounded-xl bg-surface-hover" />
          <div className="h-8 flex-1 rounded-xl bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}

// ── Template Preview Thumbnail (Rich CSS Wireframe) ─────────────────────────
function TemplatePreviewThumbnail({ template }) {
  const p = template.primaryColor || '#8B3DFF';
  const s = template.accentColor  || '#F0E8FF';
  const hl = template.heroLayout  || 'fullwidth';
  const ls = template.layoutStyle || 'grid';
  const br = template.borderRadius === 'large' ? '8px' : template.borderRadius === 'small' ? '4px' : '0';

  // Hero strip variants
  const heroStrip = hl === 'split'
    ? <div className="w-full h-10 flex gap-0 overflow-hidden" style={{borderRadius: br}}>
        <div className="w-1/2 h-full flex flex-col justify-center pl-2 gap-0.5" style={{backgroundColor: s}}>
          <div className="w-8 h-1 rounded-full bg-slate-400" />
          <div className="w-5 h-0.5 rounded-full bg-slate-300" />
          <div className="w-3 h-1" style={{backgroundColor: p, borderRadius: br, marginTop: 2}} />
        </div>
        <div className="w-1/2 h-full" style={{backgroundColor: p, opacity: .35}} />
      </div>
    : hl === 'centered'
    ? <div className="w-full h-10 flex flex-col items-center justify-center gap-0.5" style={{backgroundColor: s, borderRadius: br}}>
        <div className="w-10 h-1 rounded-full" style={{backgroundColor: p}} />
        <div className="w-6 h-0.5 rounded-full bg-slate-300" />
        <div className="w-4 h-1 mt-0.5" style={{backgroundColor: p, opacity: .6, borderRadius: '999px'}} />
      </div>
    : <div className="w-full h-10 flex items-end overflow-hidden relative" style={{borderRadius: br, background: `linear-gradient(135deg, ${p}55 0%, ${p}22 100%)`}}>
        <div className="absolute inset-0" style={{background: `linear-gradient(to right, ${p}88 0%, transparent 100%)`}} />
        <div className="relative z-1 p-1.5 flex flex-col gap-0.5">
          <div className="w-10 h-1 rounded-full bg-white/80" />
          <div className="w-6 h-0.5 rounded-full bg-white/50" />
        </div>
      </div>;

  // Product area variants
  const prodsArea = ls === 'list'
    ? <div className="flex flex-col gap-0.5 px-1 mt-0.5">
        {[.9,.65,.45].map((op,i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-3 h-3 flex-shrink-0" style={{backgroundColor: p, opacity: op, borderRadius: br}} />
            <div className="flex-1 h-0.5 rounded-full bg-slate-200" />
            <div className="w-3 h-0.5 rounded-full" style={{backgroundColor: p, opacity: op}} />
          </div>
        ))}
      </div>
    : ls === 'masonry'
    ? <div className="grid gap-0.5 px-1 mt-0.5" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div className="flex flex-col gap-0.5">
          <div className="w-full" style={{height: 16, backgroundColor: p, opacity:.8, borderRadius: br}} />
          <div className="w-full" style={{height: 10, backgroundColor: p, opacity:.4, borderRadius: br}} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="w-full" style={{height: 10, backgroundColor: p, opacity:.5, borderRadius: br}} />
          <div className="w-full" style={{height: 16, backgroundColor: p, opacity:.7, borderRadius: br}} />
        </div>
      </div>
    : <div className="grid grid-cols-4 gap-0.5 px-1 mt-0.5">
        {[.9,.65,.45,.25].map((op,i) => (
          <div key={i} className="aspect-[3/4]" style={{backgroundColor: p, opacity: op, borderRadius: br}} />
        ))}
      </div>;

  return (
    <div className="w-full h-full bg-white py-1 px-1.5 flex flex-col gap-1 transition-transform duration-500 group-hover:scale-[1.04]" style={{fontFamily: template.defaultFont}}>
      {/* Nav bar */}
      <div className="w-full h-2 border-b border-slate-100 flex items-center justify-between pb-0.5">
        <div className="w-5 h-[3px]" style={{backgroundColor: p, borderRadius: '999px'}} />
        <div className="flex gap-1">
          {[1,2,3].map(i => <div key={i} className="w-2 h-0.5 rounded-full bg-slate-200" />)}
        </div>
      </div>
      {/* Hero */}
      {heroStrip}
      {/* Products */}
      {prodsArea}
      {/* Footer bar */}
      <div className="mt-auto w-full h-2.5" style={{backgroundColor: '#111', borderRadius: `${br} ${br} 0 0`}} />
    </div>
  );
}

// ── Preview Modal (Live Interactive) ────────────────────────────────────────
function PreviewModal({ template, onClose, onSelect }) {
  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on escape key
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 backdrop-blur-sm animate-fade-in-fast p-0"
      onClick={handleBackdrop}
    >
      <div className="relative bg-white w-full max-w-6xl h-screen max-h-screen flex flex-col animate-scale-in shadow-2xl md:mt-8 md:rounded-3xl md:h-[92vh] overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm shrink-0"
              style={{ background: template.primaryColor }}
            />
            <div>
              <h2 className="font-display font-bold text-base text-ink leading-tight">{template.name}</h2>
              <span className="text-[11px] text-ink-muted">{template.category} · Live Preview</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Monitor size={13} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Interactive – scroll &amp; hover inside</span>
            </div>
            <button
              onClick={() => onSelect(template)}
              className="btn-primary shrink-0 gap-1.5 text-xs py-2 px-4"
            >
              <Palette size={13} /> Customize
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-muted hover:bg-surface-hover hover:text-ink transition-all duration-150"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Interactive iframe preview */}
        <div className="flex-1 overflow-hidden bg-slate-100 relative">
          {/* Browser chrome */}
          <div className="w-full bg-slate-200 flex items-center gap-2 px-4 py-2 border-b border-slate-300 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
              {template.defaultContent?.storeName?.text || template.defaultContent?.storeName || template.name}.vimi.store
            </div>
          </div>
          <div className="w-full h-full">
            <InteractivePreview
              templateId={template.id}
              customizations={template.defaultContent || {}}
              template={template}
            />
          </div>
        </div>

        {/* Footer strip */}
        <div className="px-5 py-3 border-t border-surface-border flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {(template.tags || []).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-overlay text-ink-muted font-medium">{tag}</span>
            ))}
          </div>
          <p className="text-xs text-ink-muted hidden md:block max-w-sm line-clamp-1">{template.description}</p>
        </div>
      </div>
    </div>
  );
}

// ── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template, onPreview, onSelect, isSelected, index }) {
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-surface-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        {template.popular && (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-canva-yellow text-amber-900">
            <Star size={10} fill="currentColor" /> Popular
          </span>
        )}
        {template.isNew && (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-canva-cyan text-teal-900">
            <Zap size={10} /> New
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[16/11] overflow-hidden bg-surface-page">
        <TemplatePreviewThumbnail template={template} />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(template)}
            id={`preview-${template.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-ink text-xs font-semibold shadow-lg hover:bg-white transition-all duration-150 hover:scale-105"
          >
            <Eye size={13} /> Preview
          </button>
          <button
            onClick={() => onSelect(template)}
            id={`select-${template.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold shadow-lg hover:scale-105 transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #6B20EF)' }}
          >
            <Palette size={13} /> Customize
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-base text-ink leading-snug">
            {template.name}
          </h3>
          {/* Category badge */}
          <span className="shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-canva-purple-pale text-canva-purple">
            {template.category}
          </span>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-3">
          {template.description}
        </p>

        {/* Tags + color dot */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1">
            {(template.tags || []).slice(0, 2).map((tag) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-surface-overlay text-ink-subtle font-medium">
                {tag}
              </span>
            ))}
          </div>
          {/* Primary color dot */}
          <span
            className="w-4 h-4 rounded-full ring-2 ring-surface-border shrink-0"
            style={{ background: template.primaryColor }}
            title={`Theme: ${template.primaryColor}`}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(template)}
            className="btn-secondary flex-1 text-xs py-2 px-3 gap-1.5 hover:bg-slate-100"
          >
            <Eye size={13} /> Preview
          </button>
          <button
            onClick={() => onSelect(template)}
            className={`flex-1 text-xs py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] btn-primary bg-canva-purple text-white hover:bg-canva-purple-hover shadow-sm`}
          >
            <Palette size={13} /> Customize
          </button>
        </div>
      </div>

      {/* Selected ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-canva-purple pointer-events-none" />
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TemplateGallery() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [templates, setTemplates]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('All');
  const [activeColor, setActiveColor]   = useState(null);
  const [sort, setSort]                 = useState('popular');
  const [selectedId, setSelectedId]     = useState(null);
  const [previewTpl, setPreviewTpl]     = useState(null);
  const [selecting, setSelecting]       = useState(false);
  const [catOpen, setCatOpen]           = useState(false);
  const [sortOpen, setSortOpen]         = useState(false);

  // ── "Load" templates (simulated API call) ──────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setTemplates(MOCK_TEMPLATES);
      setLoading(false);
    }, 1200); // realistic 1.2s simulated delay
    return () => clearTimeout(timer);
  }, []);

  // ── Filtered + sorted templates ───────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...templates];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== 'All') {
      list = list.filter((t) => t.category === category);
    }

    // Color swatch
    if (activeColor) {
      list = list.filter((t) => t.primaryColor === activeColor);
    }

    // Sort
    if (sort === 'popular') {
      list = list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sort === 'newest') {
      list = list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sort === 'az') {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [templates, search, category, activeColor, sort]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelect = useCallback(async (template) => {
    setSelectedId(template.id);
    setSelecting(true);
    setPreviewTpl(null);

    try {
      // Navigate to customization wizard
      navigate(`/onboarding/customize/${template.id}`);
    } catch (err) {
      console.error('Failed to set template:', err);
      setSelecting(false);
    }
  }, [navigate]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setActiveColor(null);
    setSort('popular');
  };

  const hasActiveFilters = search || category !== 'All' || activeColor || sort !== 'popular';

  return (
    <div className="min-h-screen theme-bg relative overflow-x-hidden">

      {/* ── Background decorations ─────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-canva-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-canva-cyan/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-canva-pink/5 rounded-full blur-3xl" />
      </div>

      {/* ── Outer flex: left sidebar + gallery ─────────────────────────── */}
      <div className="relative z-10 flex">

      {/* ── Left Icon Rail (Canva-style) ─────────────────────────────────── */}
      <aside className="hidden xl:flex flex-col gap-1 shrink-0 sticky top-0 h-screen overflow-hidden
                        w-16 hover:w-64 transition-all duration-200 ease-in-out
                        border-r border-slate-200/60 bg-white/80 backdrop-blur-sm group/rail
                        z-20">

        {/* Logo — icon only when collapsed, logo+wordmark when expanded */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-100 shrink-0 min-h-[64px]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                          shadow-[0_0_0_2px_rgba(139,61,255,0.15)]"
               style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
            <img src="/favicon.svg" alt="Vimi"
                 className="w-5 h-5 object-contain drop-shadow-sm"
                 style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <span className="font-black text-slate-800 text-lg tracking-tight whitespace-nowrap
                           opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 delay-75"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            vimi
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: 'Dashboard',     onClick: () => navigate('/dashboard'),          color: 'text-slate-600', hoverBg: 'hover:bg-slate-100',  hoverText: 'hover:text-slate-900' },
            { icon: CreditCard,      label: 'Pricing Plans', onClick: () => navigate('/pricing'),            color: 'text-violet-500', hoverBg: 'hover:bg-violet-50',  hoverText: 'hover:text-violet-700' },
            { icon: PlusCircle,      label: 'Store Settings',onClick: () => navigate('/dashboard/settings'), color: 'text-slate-600', hoverBg: 'hover:bg-slate-100',  hoverText: 'hover:text-slate-900' },
          ].map(({ icon: Icon, label, onClick, color, hoverBg, hoverText }) => (
            <button
              key={label}
              onClick={onClick}
              title={label}
              className={`relative flex items-center gap-3 w-full rounded-xl px-2.5 py-2.5
                          ${hoverBg} ${hoverText} transition-all duration-150 group/item`}
            >
              <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                                ${color} bg-slate-50 group-hover/item:scale-105 transition-transform`}>
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap
                               opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 delay-75
                               overflow-hidden">
                {label}
              </span>
              {/* Tooltip shown only when rail is collapsed */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs
                               font-semibold rounded-lg whitespace-nowrap pointer-events-none
                               opacity-0 group-hover/item:opacity-100 group-hover/rail:hidden
                               transition-opacity duration-100 shadow-xl z-50">
                {label}
              </span>
            </button>
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-slate-100 mx-1" />

          {/* Help */}
          <button
            title="Help"
            className="relative flex items-center gap-3 w-full rounded-xl px-2.5 py-2.5
                       hover:bg-amber-50 hover:text-amber-700 transition-all group/item"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                              text-amber-500 bg-amber-50/60 group-hover/item:scale-105 transition-transform">
              <HelpCircle size={17} strokeWidth={2} />
            </span>
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap
                             opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 delay-75">
              Help &amp; Tips
            </span>
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs
                             font-semibold rounded-lg whitespace-nowrap pointer-events-none
                             opacity-0 group-hover/item:opacity-100 group-hover/rail:hidden
                             transition-opacity duration-100 shadow-xl z-50">
              Help &amp; Tips
            </span>
          </button>
        </nav>

        {/* Stats — only visible when expanded */}
        <div className="px-3 pb-4 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 delay-100 space-y-1.5 shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pb-1">Gallery</p>
          {[
            { label: 'Templates', value: MOCK_TEMPLATES.length,                         icon: Wand2 },
            { label: 'Featured',  value: MOCK_TEMPLATES.filter(t => t.featured).length, icon: Star  },
            { label: 'New',       value: MOCK_TEMPLATES.filter(t => t.isNew).length,    icon: Zap   },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <s.icon size={11} className="text-canva-purple" />
                {s.label}
              </div>
              <span className="text-xs font-bold text-slate-700">{s.value}</span>
            </div>
          ))}
        </div>

      </aside>


      {/* ── Main content column ──────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8">

        {/* ── Hero Header ───────────────────────────────────────────────── */}
        <header className="pt-20 pb-10 text-center animate-fade-in">
          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-purple-glow"
                style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}
              >
                <span className="font-display font-bold text-white text-2xl">V</span>
              </div>
              <div className="absolute -inset-1 rounded-[20px] border-2 border-canva-purple/20 animate-pulse-soft" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-ink mb-3 tracking-tight">
            Find the perfect look for your <span className="gradient-text">brand</span>
          </h1>
          <p className="text-base text-ink-muted max-w-lg mx-auto leading-relaxed">
            Select a template to launch into the customization studio. Build a storefront that represents you.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Palette size={14} className="text-canva-purple" />
              {MOCK_TEMPLATES.length} templates
            </span>
            <span className="w-px h-4 bg-surface-border" />
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-canva-cyan" />
              Fully customisable
            </span>
            <span className="w-px h-4 bg-surface-border" />
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-canva-pink" />
              Change anytime
            </span>
          </div>
        </header>

        {/* ── Sticky Filter Bar ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 glass rounded-2xl shadow-card mb-8 p-3 sm:p-4 animate-fade-in border border-white/60"
          style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                id="template-search"
                type="text"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-page border border-surface-border text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-canva-purple/30 focus:border-canva-purple/50 transition-all duration-150"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <button
                id="category-filter"
                onClick={() => { setCatOpen(!catOpen); setSortOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-page border border-surface-border text-sm font-medium text-ink hover:border-canva-purple/40 hover:bg-white transition-all duration-150"
              >
                <SlidersHorizontal size={13} className="text-ink-subtle" />
                {category}
                <ChevronDown size={13} className={`text-ink-subtle transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl shadow-modal border border-surface-border py-1.5 z-50 animate-scale-in">
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setCatOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-100 ${
                        category === cat
                          ? 'text-canva-purple font-semibold bg-canva-purple-pale'
                          : 'text-ink-body hover:bg-surface-hover'
                      }`}
                    >
                      {cat}
                      {category === cat && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {THEME_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(activeColor === c.hex ? null : c.hex)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all duration-150 ring-offset-1 ${
                    activeColor === c.hex
                      ? 'ring-2 ring-canva-purple scale-110 shadow-sm'
                      : 'ring-1 ring-surface-border hover:scale-110 hover:ring-canva-purple/40'
                  }`}
                  style={{ background: c.hex }}
                  aria-label={`Filter by ${c.label}`}
                />
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative ml-auto">
              <button
                id="sort-filter"
                onClick={() => { setSortOpen(!sortOpen); setCatOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-page border border-surface-border text-sm font-medium text-ink hover:border-canva-purple/40 hover:bg-white transition-all duration-150"
              >
                {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <ChevronDown size={13} className={`text-ink-subtle transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-2xl shadow-modal border border-surface-border py-1.5 z-50 animate-scale-in">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-100 ${
                        sort === opt.value
                          ? 'text-canva-purple font-semibold bg-canva-purple-pale'
                          : 'text-ink-body hover:bg-surface-hover'
                      }`}
                    >
                      {opt.label}
                      {sort === opt.value && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-canva-purple hover:bg-canva-purple-pale transition-all duration-150"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Active filter summary */}
          {hasActiveFilters && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-ink-muted pl-1">
              <span className="font-medium text-ink-body">{filtered.length}</span> template{filtered.length !== 1 ? 's' : ''} found
              {category !== 'All' && (
                <span className="px-2 py-0.5 rounded-full bg-canva-purple-pale text-canva-purple font-medium">
                  {category}
                </span>
              )}
              {activeColor && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-overlay text-ink-muted font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: activeColor }} />
                  {THEME_COLORS.find((c) => c.hex === activeColor)?.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Template Grid ─────────────────────────────────────────────── */}
        <main className="pb-20">
          {loading ? (
            // Skeleton grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-surface-hover flex items-center justify-center mb-5 shadow-inner">
                <Search size={32} className="text-ink-ghost" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink mb-2">No templates found</h3>
              <p className="text-sm text-ink-muted mb-6 max-w-xs leading-relaxed">
                Your filters didn't match any templates. Try adjusting your search or clearing the filters.
              </p>
              <button onClick={handleClearFilters} className="btn-primary gap-2">
                <X size={15} /> Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* Featured Section */}
              {filtered.filter(t => t.featured).length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Sparkles className="text-canva-purple" size={20} /> Featured Collections
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.filter(t => t.featured).map((template, index) => (
                      <TemplateCard key={template.id} template={template} index={index} onPreview={setPreviewTpl} onSelect={handleSelect} />
                    ))}
                  </div>
                </section>
              )}

              {/* Trending Section */}
              {filtered.filter(t => t.popular && !t.featured).length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Star className="text-canva-yellow" fill="currentColor" size={20} /> Trending Right Now
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.filter(t => t.popular && !t.featured).map((template, index) => (
                      <TemplateCard key={template.id} template={template} index={index} onPreview={setPreviewTpl} onSelect={handleSelect} />
                    ))}
                  </div>
                </section>
              )}

              {/* All Templates Grid */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  All Templates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.filter(t => !t.featured && !t.popular).map((template, index) => (
                    <TemplateCard key={template.id} template={template} index={index} onPreview={setPreviewTpl} onSelect={handleSelect} />
                  ))}
                </div>
              </section>

            </div>
          )}
        </main>
      </div>
      </div>{/* end flex row */}


      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      {previewTpl && (
        <PreviewModal
          template={previewTpl}
          onClose={() => setPreviewTpl(null)}
          onSelect={handleSelect}
        />
      )}

      {/* ── Selecting overlay ─────────────────────────────────────────────── */}
      {selecting && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in-fast">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-purple-glow"
                style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}
              >
                <Check size={28} className="text-white" />
              </div>
              <div className="absolute -inset-1.5 rounded-[22px] border-2 border-canva-purple/30 border-t-canva-purple animate-spin" />
            </div>
            <p className="font-display font-semibold text-ink text-lg">Setting up your store…</p>
            <p className="text-sm text-ink-muted">Taking you to your dashboard</p>
          </div>
        </div>
      )}

      {/* Close dropdowns on outside click */}
      {(catOpen || sortOpen) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setCatOpen(false); setSortOpen(false); }}
        />
      )}

    </div>
  );
}

