import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-panel border shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100 shadow-emerald-900/30'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-rose-950/85 text-rose-100 shadow-rose-900/30'
                : 'border-blue-500/40 bg-blue-950/80 text-blue-100 shadow-blue-900/30'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.message}</p>
              {toast.description && (
                <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
