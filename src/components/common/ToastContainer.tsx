import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 border backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-neutral-900/95 border-emerald-500/40 text-neutral-900 dark:text-white'
              : toast.type === 'error'
              ? 'bg-white/95 dark:bg-neutral-900/95 border-rose-500/40 text-neutral-900 dark:text-white'
              : 'bg-white/95 dark:bg-neutral-900/95 border-indigo-500/40 text-neutral-900 dark:text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          )}

          <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
