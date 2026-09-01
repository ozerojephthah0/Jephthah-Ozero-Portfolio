import React, { useState, useEffect, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Search, X, Briefcase, Cpu, Layers, GitCommit, Award, ArrowRight, Sparkles } from 'lucide-react';
import { navItems } from '../navigation/LeftSidebarNav';

export const GlobalSearchModal: React.FC = () => {
  const {
    data,
    isSearchModalOpen,
    setIsSearchModalOpen,
    scrollToSection,
    setSelectedProject,
  } = usePortfolio();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Search Results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Project' | 'Skill' | 'Service' | 'Milestone' | 'Section';
      icon: any;
      action: () => void;
    }> = [];

    // Sections
    navItems.forEach((nav) => {
      if (nav.label.toLowerCase().includes(q)) {
        items.push({
          id: `nav-${nav.id}`,
          title: nav.label,
          subtitle: `Navigate to ${nav.label} section`,
          category: 'Section',
          icon: nav.icon,
          action: () => {
            scrollToSection(nav.id);
            setIsSearchModalOpen(false);
          },
        });
      }
    });

    // Projects
    data.projects?.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          id: `p-${p.id}`,
          title: p.title,
          subtitle: `${p.category} — ${p.tags.slice(0, 3).join(', ')}`,
          category: 'Project',
          icon: Briefcase,
          action: () => {
            scrollToSection('projects');
            setSelectedProject(p);
            setIsSearchModalOpen(false);
          },
        });
      }
    });

    // Skills
    data.skills?.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) {
        items.push({
          id: `s-${s.id}`,
          title: s.name,
          subtitle: `${s.category} (${s.levelLabel})`,
          category: 'Skill',
          icon: Cpu,
          action: () => {
            scrollToSection('skills');
            setIsSearchModalOpen(false);
          },
        });
      }
    });

    // Services
    data.services?.forEach((srv) => {
      if (srv.name.toLowerCase().includes(q) || srv.description.toLowerCase().includes(q)) {
        items.push({
          id: `srv-${srv.id}`,
          title: srv.name,
          subtitle: srv.description,
          category: 'Service',
          icon: Layers,
          action: () => {
            scrollToSection('services');
            setIsSearchModalOpen(false);
          },
        });
      }
    });

    // Journey / Milestones
    data.journey?.forEach((j) => {
      if (j.title.toLowerCase().includes(q) || j.organization.toLowerCase().includes(q)) {
        items.push({
          id: `j-${j.id}`,
          title: j.title,
          subtitle: `${j.organization} (${j.startDate})`,
          category: 'Milestone',
          icon: GitCommit,
          action: () => {
            scrollToSection('journey');
            setIsSearchModalOpen(false);
          },
        });
      }
    });

    return items;
  }, [query, data, scrollToSection, setSelectedProject, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Search Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, skills, services, journey..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query ? (
            results.length > 0 ? (
              <div className="space-y-1">
                {results.map((res) => {
                  const Icon = res.icon;
                  return (
                    <button
                      key={res.id}
                      onClick={res.action}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
                            {res.title}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                            {res.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {res.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 space-y-1">
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">No results found for "{query}"</p>
                <p>Try searching for "React", "AI", "Mobile", or "Contact"</p>
              </div>
            )
          ) : (
            <div className="p-4 text-xs text-neutral-500 dark:text-neutral-400 space-y-3">
              <span className="font-semibold uppercase tracking-wider text-[10px] block text-neutral-400">
                Quick Navigation Shortcuts
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navItems.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        scrollToSection(n.id);
                        setIsSearchModalOpen(false);
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-xs truncate">{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Tip: Press ESC or click outside to dismiss</span>
          <span>Instant Indexing Active</span>
        </div>

      </div>
    </div>
  );
};
