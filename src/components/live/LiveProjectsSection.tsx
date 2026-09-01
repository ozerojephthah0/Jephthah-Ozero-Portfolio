import React, { useState } from 'react';
import {
  ExternalLink,
  Play,
  Sparkles,
  Zap,
  Globe,
  Music,
  ShoppingBag,
  Gamepad2,
  HelpCircle,
  Keyboard,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

interface LiveApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  url: string;
  icon: any;
  accentColor: string;
  badge: string;
  technologies: string[];
}

export const liveApps: LiveApp[] = [
  {
    id: 'live-cartnova',
    name: 'CartNova Store',
    category: 'E-Commerce Marketplace',
    tagline: 'Shop Like a Trillionaire',
    description: 'Full-featured modern e-commerce platform connecting customers, merchants, and store administrators with live cart & Firebase real-time database.',
    url: 'https://cart-nova-inky.vercel.app/',
    icon: ShoppingBag,
    accentColor: 'from-blue-600 to-indigo-600',
    badge: 'Production Web App',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Google AI Studio'],
  },
  {
    id: 'live-beatbox',
    name: 'Beatbox Pro',
    category: 'Music & Audio Production',
    tagline: 'Record, Create & Save Custom Beats',
    description: 'Dynamic beat-making synthesizer for creating original drum loops, customizing tempo, recording live sessions, and saving beats to the cloud.',
    url: 'https://beatbox-pro.vercel.app/',
    icon: Music,
    accentColor: 'from-purple-600 to-pink-600',
    badge: 'Audio Web App',
    technologies: ['Web Audio API', 'JavaScript', 'Firebase', 'CSS3'],
  },
  {
    id: 'live-picreveal',
    name: 'PicReveal — Image Guessing Game',
    category: 'Interactive Game',
    tagline: 'Visual Trivia & Puzzle Unmasking',
    description: 'An addictive visual trivia game where players unmask hidden mystery tiles, test their perception speed, and guess the image before time runs out.',
    url: 'https://pic-reveal.vercel.app/',
    icon: Sparkles,
    accentColor: 'from-amber-500 to-orange-600',
    badge: 'Interactive Game',
    technologies: ['JavaScript', 'CSS Animations', 'Firebase', 'AI Studio'],
  },
  {
    id: 'live-budget',
    name: 'Ozero-Budget',
    category: 'Fintech & Productivity',
    tagline: 'Smart Personal Expense Tracking',
    description: 'Clean personal finance tracker designed for logging daily expenses, organizing budgets by category, and monitoring financial summaries in real-time.',
    url: 'https://ozero-budget.vercel.app/',
    icon: Wallet,
    accentColor: 'from-emerald-500 to-teal-600',
    badge: 'Finance App',
    technologies: ['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'Firebase'],
  },
  {
    id: 'live-coderush',
    name: 'Ozero CodeRush Game',
    category: 'Coding & Gamification',
    tagline: 'Speed Typing & Code Racer',
    description: 'A gamified coding speed typing arcade where programmers practice syntax, race against time, test keyboard accuracy, and earn top leaderboard rankings.',
    url: 'https://ozero-code-rush-game-76sz6dty4-devtonicacademys-projects.vercel.app/',
    icon: Keyboard,
    accentColor: 'from-rose-500 to-pink-600',
    badge: 'Coding Arcade',
    technologies: ['JavaScript ES6+', 'Typing Engine', 'Scoreboard'],
  },
  {
    id: 'live-quizmaster',
    name: 'Quiz Master',
    category: 'EdTech & Learning',
    tagline: 'Interactive Trivia Challenge',
    description: 'Comprehensive quiz and learning application challenging users with multi-category questions, countdown timers, score feedback, and leaderboards.',
    url: 'https://quizmaster-ecru-one.vercel.app/',
    icon: HelpCircle,
    accentColor: 'from-violet-600 to-purple-600',
    badge: 'Quiz App',
    technologies: ['JavaScript', 'Firebase Firestore', 'CSS Grid'],
  },
  {
    id: 'live-imageguessing',
    name: 'Ozero Image Guessing Game',
    category: 'Interactive Game',
    tagline: 'Image IQ & Cognitive Quiz',
    description: 'Engaging brain-teaser image identification game with timed reveals, instant score calculation, multiple categories, and high-score ranking.',
    url: 'https://ozero-image-guessing-game-3tfawive7-devtonicacademys-projects.vercel.app/',
    icon: Gamepad2,
    accentColor: 'from-cyan-500 to-blue-600',
    badge: 'Live Game',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Firebase'],
  },
];

export const LiveProjectsSection: React.FC = () => {
  const [activeApp, setActiveApp] = useState<LiveApp | null>(null);

  return (
    <section id="live-apps" className="py-20 relative bg-neutral-100/50 dark:bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Live Launchpad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Live Deployed Projects
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Direct instant launch access to all 7 live production web applications, synthesizers, e-commerce stores, and games.
          </p>
        </div>

        {/* Live Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveApps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                id={`live-card-${app.id}`}
                className="group relative glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.accentColor} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                      {app.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-2">
                    <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {app.category}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 italic">
                      "{app.tagline}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {app.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {app.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                  <a
                    id={`open-app-btn-${app.id}`}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Open Live App</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
