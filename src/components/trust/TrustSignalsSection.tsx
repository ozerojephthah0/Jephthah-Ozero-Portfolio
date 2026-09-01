import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Code2,
  Smartphone,
  Layers,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';

export const TrustSignalsSection: React.FC = () => {
  const { data, scrollToSection } = usePortfolio();
  const { profile } = data;

  const trustMetrics = [
    {
      id: 'metric-1',
      icon: Layers,
      value: `${profile.completedProjectsCount}+`,
      title: 'Production Projects Built',
      description: 'Full-stack applications & interactive games deployed live',
      color: 'from-indigo-500 to-indigo-700',
      badge: 'Live on Web',
    },
    {
      id: 'metric-2',
      icon: Smartphone,
      value: 'Web & App Creator',
      title: 'Full-Stack & Mobile Engineering',
      description: 'E-commerce, synthesizers, trivia apps & financial tools',
      color: 'from-purple-500 to-purple-700',
      badge: 'Multi-Platform',
    },
    {
      id: 'metric-3',
      icon: Flame,
      value: 'Firebase • JS • HTML • CSS',
      title: 'Modern Architecture',
      description: 'Real-time database, auth, dynamic UI & Google AI Studio',
      color: 'from-amber-500 to-orange-600',
      badge: 'Modern Tech',
    },
    {
      id: 'metric-4',
      icon: GraduationCap,
      value: 'Devtonic Academy',
      title: 'Graduate & Technical Scholar',
      description: 'Hands-on practical development & problem-solving training',
      color: 'from-emerald-500 to-teal-700',
      badge: 'Verified Foundation',
    },
  ];

  return (
    <section id="trust-signals" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container with glowing border */}
        <div className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-neutral-200/80 dark:border-neutral-800 shadow-xl overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    Proven Technical Execution & Foundation
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Trusted engineering metrics, verified skillsets, and rapid digital delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  Explore All 6 Projects
                </button>
              </div>
            </div>

            {/* 4 Trust Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trustMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.id}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${metric.color} flex items-center justify-center text-white shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                          {metric.badge}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white leading-tight font-display mb-1">
                        {metric.value}
                      </h4>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
                        {metric.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {metric.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified & Production-Ready</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
