import React, { useState } from 'react';
import {
  Github,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  Copy,
  Check,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface RepoItem {
  id: string;
  name: string;
  repoUrl: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  tags: string[];
  cloneUrl: string;
}

const githubRepositories: RepoItem[] = [
  {
    id: 'repo-cartnova',
    name: 'CartNova',
    repoUrl: 'https://github.com/ozerojephthah0/CartNova.git',
    description: 'Modern e-commerce platform codebase with multi-user role management, real-time Firebase shopping cart, and merchant inventory tracking.',
    language: 'JavaScript / HTML5 / CSS3',
    stars: 18,
    forks: 7,
    tags: ['e-commerce', 'firebase-auth', 'realtime-db', 'google-ai-studio'],
    cloneUrl: 'git clone https://github.com/ozerojephthah0/CartNova.git',
  },
  {
    id: 'repo-beatbox',
    name: 'Beatbox-Pro',
    repoUrl: 'https://github.com/ozerojephthah0/Beatbox-Pro.git',
    description: 'Interactive beat-making synthesizer app built with the Web Audio API, drum pattern sequencing, audio recording, and Firebase cloud beats.',
    language: 'JavaScript / Web Audio API',
    stars: 24,
    forks: 9,
    tags: ['web-audio-api', 'synthesizer', 'audio-recorder', 'beatmaker'],
    cloneUrl: 'git clone https://github.com/ozerojephthah0/Beatbox-Pro.git',
  },
  {
    id: 'repo-imageiq',
    name: 'ImageIQ',
    repoUrl: 'https://github.com/ozerojephthah0/ImageIQ.git',
    description: 'Cognitive visual trivia and guessing game engine with animated progressive mask reveals, instant score evaluation, and live leaderboards.',
    language: 'JavaScript / CSS Grid',
    stars: 15,
    forks: 5,
    tags: ['game-development', 'trivia-engine', 'quiz', 'firebase'],
    cloneUrl: 'git clone https://github.com/ozerojephthah0/ImageIQ.git',
  },
  {
    id: 'repo-picreveal',
    name: 'PicReveal',
    repoUrl: 'https://github.com/ozerojephthah0/ImageIQ.git',
    description: 'Image tile unmasking game with responsive layout, custom scoring algorithms, level progression mechanics, and mobile touch support.',
    language: 'JavaScript / HTML5',
    stars: 12,
    forks: 4,
    tags: ['picreveal', 'tile-unmask', 'puzzle', 'responsive'],
    cloneUrl: 'git clone https://github.com/ozerojephthah0/ImageIQ.git',
  },
];

export const GithubSection: React.FC = () => {
  const { addToast } = usePortfolio();
  const [copiedCloneId, setCopiedCloneId] = useState<string | null>(null);

  const handleCopyClone = (id: string, command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCloneId(id);
    addToast('Git clone command copied to clipboard!', 'info');
    setTimeout(() => setCopiedCloneId(null), 2000);
  };

  return (
    <section id="github-section" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
            <Github className="w-3.5 h-3.5" />
            <span>Open Source & Code Repositories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            GitHub Code Repositories
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Explore open-source repositories, clone the codebases, study the implementations, and collaborate on GitHub.
          </p>
        </div>

        {/* GitHub Profile Banner Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Github className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  ozerojephthah0
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active Contributor
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Web Developer, App Creator & Game Developer • Lagos, Nigeria
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              id="github-main-profile-link"
              href="https://github.com/ozerojephthah0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Follow on GitHub (@ozerojephthah0)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {githubRepositories.map((repo) => (
            <div
              key={repo.id}
              id={`github-repo-card-${repo.id}`}
              className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top: Name + Stars/Forks */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                      {repo.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                      {repo.forks}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {repo.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {repo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Clone snippet */}
              <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                {/* Clone snippet */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-800">
                  <span className="truncate pr-2">{repo.cloneUrl}</span>
                  <button
                    onClick={() => handleCopyClone(repo.id, repo.cloneUrl)}
                    className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
                    title="Copy Git clone command"
                  >
                    {copiedCloneId === repo.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <a
                    id={`view-repo-btn-${repo.id}`}
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>

                  <a
                    id={`view-code-btn-${repo.id}`}
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200/80 dark:border-neutral-700/80 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>View Code</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
