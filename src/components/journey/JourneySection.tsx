import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TimelineItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { GitCommit, Briefcase, GraduationCap, Award, Flag, Calendar, ExternalLink } from 'lucide-react';

export const JourneySection: React.FC = () => {
  const { data } = usePortfolio();
  const [filterType, setFilterType] = useState<string>('All');

  const types = ['All', 'Experience', 'Education', 'Certification', 'Milestone'];

  const filteredItems = (data.journey || []).filter((item) => {
    if (filterType === 'All') return true;
    return item.type === filterType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Experience':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Education':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Certification':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Milestone':
      default:
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <section id="journey" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <GitCommit className="w-3.5 h-3.5" />
            <span>Career Path & History</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Journey, Milestones & Evolution
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            A chronological timeline of roles, engineering breakthroughs, and educational milestones.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {types.map((t) => {
            const isActive = filterType === t;
            return (
              <button
                key={t}
                id={`journey-filter-${t.toLowerCase()}`}
                onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-800'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`journey-item-${item.id}`}
              className="relative group"
            >
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border-2 border-indigo-600 dark:border-indigo-400 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              </div>

              {/* Date on Left (Desktop) */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-24">
                <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                  {item.startDate}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                  {item.current ? 'Present' : item.endDate}
                </span>
              </div>

              {/* Content Card */}
              <div className="glass-panel rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all shadow-sm">
                
                {/* Mobile date pill */}
                <div className="sm:hidden flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-500 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {item.startDate} — {item.current ? 'Present' : item.endDate}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border mb-1.5 ${getTypeBadge(item.type)}`}>
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.organization}
                    </span>
                  </div>

                  {item.current && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Current Position
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed my-3">
                  {item.description}
                </p>

                {/* Bullet Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    {item.highlights.map((h, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.link && (
                  <div className="mt-3 pt-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Verification & Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
