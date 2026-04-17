import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Undo2, Redo2, Info } from 'lucide-react';
import { MOCK_TEMPLATES } from './mockTemplates';
import api from '@/lib/api';
import { useHistory } from '../../hooks/useHistory';

// Temporary mock until useAuth is properly located
const useAuth = () => ({
  activeStore: { id: 'demo', name: 'Demo Store', subdomain: 'demo' }
});

import EditorSidebar from '../../components/EditorSidebar';
import TemplatePreview from '../../components/TemplatePreview';
import InteractivePreview from '../../components/InteractivePreview';
import toast from 'react-hot-toast';

export default function CustomizeWizard() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  const { current: state, setContent: setState, undo, redo, canUndo, canRedo } = useHistory({
    color: null,
    font: null,
    global: {
      bg: '#F8F9FA',
      boxed: false,
      sections: []
    },
    overrides: { elements: [] }
  });

  const { color: selectedColor, font: selectedFont, global, overrides: elementOverrides } = state || {};

  const updateOverride = (key, value) => {
    setState(prev => ({
      ...prev,
      overrides: { ...prev.overrides, [key]: value }
    }));
  };

  const updateGlobal = (key, value) => {
    setState(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }));
  };

  const updateColor = (color) => setState(prev => ({ ...prev, color }));
  const updateFont = (font) => setState(prev => ({ ...prev, font }));

  const addElement = (type) => {
    console.log("Add Element trigger", type);
    const id = `el_${Date.now()}`;
    const newEl = { id, type, x: 100, y: 150 };

    setState(prev => {
      const arr = prev.overrides?.elements || [];
      return {
        ...prev,
        overrides: { ...prev.overrides, elements: [...arr, newEl] }
      };
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = MOCK_TEMPLATES.find(t => t.id === templateId);
      if (found) {
        setTemplate(found);
        setState({
          color: found.colorSchemes[0],
          font: found.fontOptions[0],
          global: {
            bg: found.primaryColor + '10' || '#F8F9FA',
            boxed: false,
            sections: []
          },
          overrides: { elements: [] }
        });
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [templateId, setState]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-canva-purple mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading creative suite...</p>
      </div>
    );
  }

  if (!template || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
          <button onClick={() => navigate('/onboarding/templates')} className="text-canva-purple font-medium">Head back to gallery</button>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.patch('/store/config', { 
        templateId: template.id, 
        customization: elementOverrides,
        status: 'draft' 
      });
      toast.success('Draft saved');
    } catch (err) {
      toast.error('Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setApplying(true);
    try {
      await api.patch('/store/config', { 
        templateId: template.id, 
        customization: elementOverrides,
        status: 'published' 
      });
      localStorage.setItem('vimi_template_selected', 'true');
      toast.success('Store published!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('There was an issue publishing your configuration.');
      setApplying(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8F9FA] flex flex-col overflow-hidden animate-fade-in relative z-0">

      {/* Top Navbar */}
      <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/onboarding/templates')}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-bold text-slate-800 text-sm">{template.name}</h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Unsaved Changes</p>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
            <button disabled={!canUndo} onClick={undo} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"><Undo2 size={16} /></button>
            <button disabled={!canRedo} onClick={redo} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"><Redo2 size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 mr-4 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <Info size={14} className="text-blue-500" />
            <span className="text-xs font-semibold text-blue-800 tracking-tight">Free Trial: Upgrade to publish custom domains</span>
          </div>

          <button
            onClick={handleSaveDraft}
            disabled={saving || applying}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={applying || saving}
            className="bg-gradient-to-r from-[#8B3DFF] to-[#00C4CC] text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] shadow-sm disabled:opacity-60"
          >
            {applying ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={14} /> Publish Store</>}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden w-full h-full relative p-0 m-0">

        {/* Left Side: Canva Tools Panel */}
        <EditorSidebar
          template={template}
          state={state}
          onUpdateGlobal={updateGlobal}
          onUpdateColor={updateColor}
          onUpdateFont={updateFont}
          onAddElement={addElement}
        />

        {/* Right Side: Live Canvas Workspace */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative flex flex-col items-center p-8 lg:p-12 transition-colors duration-500" style={{ backgroundColor: global?.bg || '#F8F9FA' }}>
          <div className={`transition-all duration-300 w-full flex flex-col ${global?.boxed ? 'max-w-6xl rounded-3xl shadow-2xl my-2 border border-slate-200/50' : 'h-full shrink-0'}`}>
            {template.id === 'tmpl_nike_dynamic' ? (
              <InteractivePreview templateId={template.id} customizations={elementOverrides} />
            ) : (
              <TemplatePreview
                template={template}
                colorScheme={selectedColor}
                fontOption={selectedFont}
                overrides={elementOverrides || {}}
                onOverrideChange={updateOverride}
              />
            )}
          </div>
          {/* Added spacer to permit overscroll */}
          <div className="h-32 w-full shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
