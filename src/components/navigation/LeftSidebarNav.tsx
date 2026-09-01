import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Home,
  User,
  Briefcase,
  Globe,
  FolderGit2,
  Cpu,
  Mail,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const navItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'live-apps', label: 'Live Apps', icon: Globe },
  { id: 'github-section', label: 'GitHub', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export const LeftSidebarNav: React.FC = () => {
  const { activeSection, scrollToSection } = usePortfolio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      id="desktop-left-sidebar"
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center transition-all duration-300 ${
        isExpanded ? 'w-48' : 'w-16'
      }`}
    >
      <div className="w-full glass-panel rounded-2xl p-2.5 shadow-xl shadow-neutral-950/10 dark:shadow-black/40 flex flex-col items-center gap-1.5 transition-all">
        {/* Toggle Expand/Collapse */}
        <button
          id="sidebar-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          className="w-full flex items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

        {/* Nav Items */}
        <nav className="w-full flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                {isExpanded && (
                  <span className="truncate whitespace-nowrap transition-opacity duration-200 font-medium">
                    {item.label}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {!isExpanded && (
                  <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold whitespace-nowrap opacity-0 shadow-lg -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
