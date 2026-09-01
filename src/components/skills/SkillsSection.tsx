import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { IconRenderer } from '../common/IconRenderer';
import { Cpu, CheckCircle2, Star, Layers, Sparkles, Code2, Wrench } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { skills, skillCategories } = data;

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const coreSkills = skills.filter((s) => s.category === 'Core Development Skills');
  const techSkills = skills.filter((s) => s.category === 'Technologies & Tools');

  const categoriesList = ['All', 'Core Development Skills', 'Technologies & Tools'];

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === 'All') return true;
    return skill.category === activeCategory;
  });

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Technologies and technical abilities used to design, develop, and deploy modern digital products.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`skills-category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dual Section View when 'All' is selected, or filtered grid */}
        {activeCategory === 'All' ? (
          <div className="space-y-12">
            {/* Section 1: Core Development Skills */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Core Development Skills
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {coreSkills.map((skill) => (
                  <div
                    key={skill.id}
                    id={`skill-card-${skill.id}`}
                    className="glass-panel rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                          <IconRenderer name={skill.iconName || 'Code'} className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
                          {skill.levelLabel}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-1">
                        {skill.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                      <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                        <span>Proficiency</span>
                        <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Technologies & Tools */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Technologies & Tools
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {techSkills.map((skill) => (
                  <div
                    key={skill.id}
                    id={`skill-card-${skill.id}`}
                    className="glass-panel rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 dark:hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                          <IconRenderer name={skill.iconName || 'Wrench'} className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
                          {skill.levelLabel}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-1">
                        {skill.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                      <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                        <span>Mastery</span>
                        <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Filtered Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                id={`skill-card-${skill.id}`}
                className="glass-panel rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <IconRenderer name={skill.iconName || 'Code'} className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
                      {skill.levelLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block mb-2">
                    {skill.category}
                  </span>

                  {skill.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                      {skill.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                    <span>Proficiency</span>
                    <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
