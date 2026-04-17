import React from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

export function EditableSection({ id, index, children, onDelete, onAddSection }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative group bg-white/0 hover:bg-slate-50/50 transition-colors ${
            snapshot.isDragging ? 'shadow-2xl z-50 rounded-xl overflow-hidden' : ''
          }`}
        >
          {/* Drag Handle (Left) */}
          <div
            {...provided.dragHandleProps}
            className="absolute top-1/2 -left-3 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-lg transition-all"
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </div>

          {/* Core Content Layer */}
          <div className="relative group-hover:outline group-hover:outline-2 group-hover:outline-blue-500/50 rounded-sm">
            {children}
            
            {/* Delete Action (Top Right) */}
            <button
               onClick={onDelete}
               className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg shadow-sm transition-all"
               title="Delete section"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Add Section Divider (Bottom) */}
          <div className="opacity-0 group-hover:opacity-100 h-0 relative z-30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none">
              <div className="w-full border-t-2 border-dashed border-blue-400/30" />
            </div>
            <button
              onClick={onAddSection}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 font-bold px-3 py-1 text-xs rounded-full shadow-sm flex items-center gap-1 transition-all z-40"
              title="Add Section Below"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

        </div>
      )}
    </Draggable>
  );
}
