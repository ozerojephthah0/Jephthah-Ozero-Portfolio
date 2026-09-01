import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Award,
  Layers,
  Heart,
  Target,
  Download,
} from 'lucide-react';
import { downloadPdfCv } from '../../utils/generatePdfCv';

export const AboutSection: React.FC = () => {
  const { data, scrollToSection, addToast } = usePortfolio();
  const { profile } = data;

  const handleDownloadCV = () => {
    try {
      downloadPdfCv(data);
      addToast(`Official PDF CV for ${profile.name} downloaded successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to download PDF CV', 'error');
    }
  };

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <User className="w-3.5 h-3.5" />
            <span>About Jephthah Ozero</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            About Me & Professional Journey
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Turning creative ideas into real-world digital experiences through modern web and app engineering.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Portrait Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm group">
              {/* Glow backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
              
              <div className="relative glass-panel rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xl">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-neutral-900 mb-4">
                  <img
                    id="about-avatar-image"
                    src={profile.aboutAvatarUrl || profile.avatarUrl || '/assets/jephthah_portrait.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      e.target.src = '/assets/jephthah_portrait.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">
                      Web Developer & App Creator
                    </span>
                    <h3 className="text-xl font-bold font-display">
                      {profile.name}
                    </h3>
                  </div>
                </div>

                {/* Stat pills */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80">
                    <span className="block text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                      6+
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      Live Projects
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80">
                    <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                      100%
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      Dedication & Craft
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Journey, Devtonic Academy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Extended Bio */}
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold text-neutral-900 dark:text-white text-lg sm:text-xl leading-snug">
                "I'm Jephthah Ozero, a passionate developer who creates modern websites and innovative digital applications. I love turning creative ideas into real-world digital experiences."
              </p>
              
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                My journey started with an interest in technology and creating digital solutions. Since then, I have worked on projects including <strong className="text-neutral-900 dark:text-white font-semibold">CartNova Store</strong>, <strong className="text-neutral-900 dark:text-white font-semibold">Beatbox Pro</strong>, <strong className="text-neutral-900 dark:text-white font-semibold">Ozero Image Guessing Game</strong>, <strong className="text-neutral-900 dark:text-white font-semibold">Quiz Master</strong>, <strong className="text-neutral-900 dark:text-white font-semibold">Ozero CodeRush Game</strong>, and <strong className="text-neutral-900 dark:text-white font-semibold">Budget Expense Tracker</strong>. Each project helped me improve my development, problem-solving, creativity, and product-building skills.
              </p>
            </div>

            {/* Devtonic Academy Feature Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Training & Academy Foundation</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                I learned all these from <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Devtonic Academy</strong>, where I built a strong foundation in web development, application creation, database management, and interactive digital experiences.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> HTML & CSS3
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Modern JavaScript ES6+
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Firebase Realtime & Auth
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Google AI Studio
                </span>
              </div>
            </div>

            {/* Core Competencies Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glass-panel border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                  <Code2 className="w-4 h-4 text-purple-500" />
                  <span>Web & App Creator</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Building interactive web apps, audio synthesizers, gamified tools, and e-commerce platforms.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Interactive Games & AI</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Developing trivia puzzles, speed typing racers, cognitive games, and smart workflows.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="about-download-cv-btn"
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF CV</span>
              </button>

              <button
                onClick={() => scrollToSection('projects')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow transition-all cursor-pointer"
              >
                <span>Explore Featured Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
              >
                <span>Let's Work Together</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
