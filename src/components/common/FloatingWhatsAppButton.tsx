import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '2349019016049';
  const directLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hello Jephthah, I came across your portfolio and would like to discuss a project with you!")}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick chat popup bubble */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] glass-panel rounded-3xl p-4 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 animate-in slide-in-from-bottom-4 duration-200 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Jephthah Ozero
                </h4>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Typically replies in minutes
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
            <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 rounded-tl-sm text-neutral-800 dark:text-neutral-200">
              Hello! 👋 Have a web, app, game, or e-commerce project in mind? Let's chat directly on WhatsApp.
            </div>
          </div>

          <a
            id="whatsapp-modal-launch-btn"
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp (+234 901 901 6049)</span>
          </a>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        id="floating-whatsapp-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
        aria-label="Open WhatsApp Chat"
      >
        <MessageCircle className="w-5 h-5 fill-current shrink-0" />
        <span className="text-xs font-bold hidden sm:inline-block pr-1">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-900 animate-ping" />
      </button>
    </div>
  );
};
