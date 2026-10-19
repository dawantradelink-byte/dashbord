import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-rose-500/40 shadow-2xl p-6 text-white">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shrink-0 shadow-lg">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">{message}</p>
            {itemName && (
              <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-rose-300 truncate">
                {itemName}
              </div>
            )}
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-white/10 text-rose-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};
