import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Award, ExternalLink, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { achievements } = data;

  return (
    <section id="achievements" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Award className="w-3.5 h-3.5" />
            <span>Honors & Certifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Recognitions & Industry Credentials
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Validated certifications, hackathon awards, and recognized engineering achievements.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              id={`achievement-card-${ach.id}`}
              className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
                    {ach.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {ach.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{ach.issuer}</span>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <span className="text-neutral-400 dark:text-neutral-500 font-normal">{ach.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Credential Link */}
              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Credential
                </span>

                {ach.credentialUrl && (
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1"
                  >
                    <span>View Proof</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
