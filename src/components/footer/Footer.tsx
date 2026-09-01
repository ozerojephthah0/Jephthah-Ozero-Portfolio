import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles,
  Clock,
  Shield,
  Heart,
  X,
  ArrowUp,
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, scrollToSection, setIsAuthModalOpen } = usePortfolio();
  const { profile } = data;

  const [currentTime, setCurrentTime] = useState('');
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const footerNavLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand & Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-neutral-900 dark:text-white block">
                  Jephthah Ozero
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Developer & Digital Creator
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              Creating modern websites, interactive games, e-commerce platforms, and innovative digital applications.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                id="footer-github-link"
                href="https://github.com/ozerojephthah0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-neutral-200/60 dark:border-neutral-800 transition-all hover:scale-105"
                title="GitHub (ozerojephthah0)"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                id="footer-linkedin-link"
                href="https://ozerojephthah.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-neutral-200/60 dark:border-neutral-800 transition-all hover:scale-105"
                title="LinkedIn (Ozerojephthah.com)"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                id="footer-whatsapp-link"
                href="https://wa.me/2349019016049"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-neutral-200/60 dark:border-neutral-800 transition-all hover:scale-105"
                title="WhatsApp (+234 901 901 6049)"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                id="footer-email-link"
                href="mailto:Ozerojephthah0@gmail.com"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-neutral-200/60 dark:border-neutral-800 transition-all hover:scale-105"
                title="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Time: {currentTime || 'Loading...'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white block">
              Navigation
            </span>
            <div className="flex flex-col gap-2">
              {footerNavLinks.map((item) => (
                <button
                  key={item.id}
                  id={`footer-nav-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors cursor-pointer w-fit"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Back to Top & Quick Status (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end space-y-4">
            <button
              id="footer-back-to-top-btn"
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-800 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-indigo-500 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Authentication Portal</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar with Required Copyright & Built by notice */}
        <div className="pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>Copyright © 2026 Jephthah Ozero. All rights reserved.</p>

          <p className="flex items-center gap-1 font-medium">
            <span>Built with passion by</span>
            <strong className="text-neutral-900 dark:text-white font-semibold">Jephthah Ozero.</strong>
          </p>
        </div>

      </div>
    </footer>
  );
};
