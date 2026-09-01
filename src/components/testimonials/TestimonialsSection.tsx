import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  MessageSquareQuote,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Quote,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { testimonials } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');

  const count = testimonials?.length || 0;

  const handleNext = () => {
    if (count > 0) setCurrentIndex((prev) => (prev + 1) % count);
  };

  const handlePrev = () => {
    if (count > 0) setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client & Peer Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Trusted by Leaders & Innovators
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            What founders, engineering directors, and collaborative partners have to say about working together.
          </p>

          {/* View Mode Switcher */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'carousel'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Featured Spotlight</span>
            </button>
          </div>
        </div>

        {/* Carousel View */}
        {viewMode === 'carousel' && count > 0 && (
          <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 relative border border-neutral-200/80 dark:border-neutral-800 shadow-xl">
            <Quote className="w-12 h-12 text-indigo-500/20 absolute top-6 right-6 pointer-events-none" />

            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonials[currentIndex].rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote Content */}
              <p className="text-base sm:text-xl text-neutral-800 dark:text-neutral-200 leading-relaxed italic font-display">
                "{testimonials[currentIndex].quote}"
              </p>

              {/* Author Details */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonials[currentIndex].avatarUrl}
                    alt={testimonials[currentIndex].authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <span>{testimonials[currentIndex].authorName}</span>
                      {testimonials[currentIndex].verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Verified Review" />
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {testimonials[currentIndex].role} — <span className="font-medium text-indigo-600 dark:text-indigo-400">{testimonials[currentIndex].company}</span>
                    </p>
                  </div>
                </div>

                {/* Next / Prev buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                id={`testimonial-card-${item.id}`}
                className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {item.date && (
                      <span className="text-[11px] font-mono text-neutral-400">{item.date}</span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                  <img
                    src={item.avatarUrl}
                    alt={item.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1">
                      <span>{item.authorName}</span>
                      {item.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[170px]">
                      {item.role}, {item.company}
                    </p>
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
