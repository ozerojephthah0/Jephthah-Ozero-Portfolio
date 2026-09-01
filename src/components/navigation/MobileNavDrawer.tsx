import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { navItems } from './LeftSidebarNav';
import { X, Sparkles, Shield, Mail } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const {
    data,
    activeSection,
    scrollToSection,
    isAdmin,
    setIsAuthModalOpen,
    setIsAdminDashboardOpen,
  } = usePortfolio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-neutral-900 shadow-2xl p-5 flex flex-col justify-between border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-200 z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                {data.profile.name || 'Portfolio'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    scrollToSection(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
          {isAdmin ? (
            <button
              onClick={() => {
                setIsAdminDashboardOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Admin Login</span>
            </button>
          )}

          <button
            onClick={() => {
              scrollToSection('contact');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-indigo-600"
          >
            <Mail className="w-4 h-4" />
            <span>Send Direct Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
