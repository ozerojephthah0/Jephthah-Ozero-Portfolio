import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sun,
  Moon,
  Laptop,
  Search,
  Shield,
  Menu,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    data,
    theme,
    setTheme,
    isAdmin,
    setIsAuthModalOpen,
    setIsAdminDashboardOpen,
    setIsSearchModalOpen,
    scrollToSection,
  } = usePortfolio();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const unreadMessagesCount = data.messages?.filter((m) => !m.read).length || 0;

  return (
    <header
      id="main-top-header"
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-200 glass-panel border-b border-neutral-200/80 dark:border-neutral-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            id="header-brand-btn"
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {data.profile.name || 'Jephthah'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[150px] sm:max-w-xs">{data.profile.availability}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 border border-neutral-200/60 dark:border-neutral-700/60 transition-all"
            aria-label="Search portfolio items"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search showcase...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              id="header-theme-toggle-btn"
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors flex items-center gap-1"
              aria-label="Change theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4 text-neutral-500" />
              )}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isThemeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 py-1.5 glass-panel rounded-xl shadow-xl shadow-neutral-950/10 dark:shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left ${
                    theme === 'light' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-neutral-100 dark:bg-neutral-800' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left ${
                    theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-neutral-100 dark:bg-neutral-800' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left ${
                    theme === 'system' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-neutral-100 dark:bg-neutral-800' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-neutral-500" /> System
                </button>
              </div>
            )}
          </div>

          {/* Admin Dashboard / Login Button */}
          {isAdmin ? (
            <button
              id="header-admin-dashboard-btn"
              onClick={() => setIsAdminDashboardOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-sm shadow-indigo-500/25 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          ) : (
            <button
              id="header-admin-login-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-700/60 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-trigger-btn"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile menu"
            className="lg:hidden p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
