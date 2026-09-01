import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  ArrowRight,
  Download,
  Mail,
  User,
  Briefcase,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Dribbble,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadPdfCv } from '../../utils/generatePdfCv';

export const HeroSection: React.FC = () => {
  const { data, scrollToSection, addToast } = usePortfolio();
  const { profile, slides, settings } = data;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const activeSlides = slides && slides.length > 0 ? slides : [];
  const slideCount = activeSlides.length;

  // Autoplay timer
  useEffect(() => {
    if (!settings.carouselAutoplay || isPaused || slideCount <= 1) return;

    const currentDuration = activeSlides[currentSlideIndex]?.duration || settings.carouselSpeed || 5000;
    const timer = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideCount);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, isPaused, settings.carouselAutoplay, settings.carouselSpeed, slideCount, activeSlides]);

  const handleNextSlide = () => {
    if (slideCount > 0) {
      setCurrentSlideIndex((prev) => (prev + 1) % slideCount);
    }
  };

  const handlePrevSlide = () => {
    if (slideCount > 0) {
      setCurrentSlideIndex((prev) => (prev - 1 + slideCount) % slideCount);
    }
  };

  // Touch Swipe for mobile
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNextSlide();
    if (isRightSwipe) handlePrevSlide();
  };

  // Download CV function in PDF format
  const handleDownloadCV = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });

    try {
      downloadPdfCv(data);
      addToast(`Official PDF CV for ${profile.name} downloaded successfully!`, 'success');
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      addToast('Failed to generate PDF CV. Please try again.', 'error');
    }
  };

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'youtube':
        return Youtube;
      case 'dribbble':
        return Dribbble;
      case 'email':
      default:
        return Mail;
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-24 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-20 left-10 w-[300px] h-[300px] rounded-full bg-pink-500/10 dark:bg-pink-600/10 blur-[90px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Personal Intro & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            
            {/* Status & Location Pill */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {profile.availability}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {profile.location}
              </span>
            </div>

            {/* Headline with Greeting */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                Hello, Welcome to my official space
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">{profile.name}</span>
              </h1>
              <h2 className="text-lg sm:text-xl font-medium text-neutral-700 dark:text-neutral-300">
                {profile.title}
              </h2>
            </div>

            {/* Introduction Text */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              {profile.shortBio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-view-projects-btn"
                onClick={() => scrollToSection('projects')}
                className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all cursor-pointer"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-about-btn"
                onClick={() => scrollToSection('about')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm font-medium border border-neutral-200/80 dark:border-neutral-700/80 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>About Me</span>
              </button>

              <button
                id="hero-contact-btn"
                onClick={() => scrollToSection('contact')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm font-medium border border-neutral-200/80 dark:border-neutral-700/80 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Contact Me</span>
              </button>

              <button
                id="hero-download-cv-btn"
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-sm font-semibold shadow transition-all cursor-pointer"
                title="Download CV / Resume"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mr-2">Connect:</span>
              {profile.socialLinks
                ?.filter((s) => s.enabled)
                .map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      id={`hero-social-${link.platform}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/70 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 transition-all hover:scale-105"
                      aria-label={link.label}
                      title={link.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Right Column: AI Avatar Card & Dynamic Carousel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6">
            
            {/* Main Avatar Presentation Card */}
            <div className="relative group w-full max-w-sm">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative glass-panel rounded-2xl p-4 flex flex-col items-center text-center overflow-hidden">
                <div className="relative w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden shadow-inner border-2 border-white/40 dark:border-neutral-700/50 mb-4 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    id="hero-avatar-image"
                    src={profile.heroAvatarUrl || profile.avatarUrl || '/assets/jephthah_portrait.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      e.target.src = '/assets/jephthah_portrait.jpg';
                    }}
                  />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md text-[11px] font-medium text-white flex items-center justify-between border border-white/10 shadow-lg">
                    <span className="flex items-center gap-1.5 font-semibold text-neutral-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{profile.name}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60">
                      Available
                    </span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-2 text-center py-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="block text-lg font-bold font-display text-indigo-600 dark:text-indigo-400">
                      {profile.yearsExperience}+
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      Years Exp.
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="block text-lg font-bold font-display text-purple-600 dark:text-purple-400">
                      {profile.completedProjectsCount}+
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      Projects
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="block text-lg font-bold font-display text-pink-600 dark:text-pink-400">
                      {profile.clientSatisfactionRate}%
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      Satisfaction
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Interactive Dynamic Carousel / Slideshow */}
            {currentSlide && (
              <div
                id="hero-slideshow-container"
                className="w-full max-w-sm glass-panel rounded-2xl p-4 shadow-lg relative select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Tag & Controls Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {currentSlide.tag || 'Highlights'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </button>
                    <button
                      id="carousel-prev-btn"
                      onClick={handlePrevSlide}
                      aria-label="Previous slide"
                      className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="carousel-next-btn"
                      onClick={handleNextSlide}
                      aria-label="Next slide"
                      className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Details with smooth fade */}
                <div className="min-h-[90px] flex flex-col justify-center">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                    {currentSlide.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                    {currentSlide.description}
                  </p>
                </div>

                {/* Slide CTA Button & Indicator Dots */}
                <div className="mt-3 pt-2.5 border-t border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (currentSlide.ctaLink === '#resume-download') {
                        handleDownloadCV();
                      } else if (currentSlide.ctaLink?.startsWith('#')) {
                        scrollToSection(currentSlide.ctaLink);
                      } else if (currentSlide.ctaLink) {
                        window.open(currentSlide.ctaLink, '_blank');
                      }
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
                  >
                    <span>{currentSlide.ctaText || 'Learn More'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentSlideIndex
                            ? 'w-5 bg-indigo-600 dark:bg-indigo-400'
                            : 'w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
