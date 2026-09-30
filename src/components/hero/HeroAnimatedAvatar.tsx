import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Video, Play, Pause, Scan, Activity, Maximize2, ShieldCheck, Film, Layers } from 'lucide-react';
import defaultExecutivePortrait from '../../assets/images/jephthah_executive_portrait_uploaded.png';

interface HeroAnimatedAvatarProps {
  photoUrl?: string;
  name: string;
  title: string;
  availability: string;
}

type AnimationStyle = 'cinematic' | 'live-studio' | 'cyber-hud' | 'floating-3d';

export const HeroAnimatedAvatar: React.FC<HeroAnimatedAvatarProps> = ({
  photoUrl,
  name,
  title,
  availability,
}) => {
  const [animStyle, setAnimStyle] = useState<AnimationStyle>('cinematic');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Mouse Parallax 3D Tilt Coordinates
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const activePhoto = photoUrl && photoUrl !== '/assets/jephthah_portrait.jpg' ? photoUrl : defaultExecutivePortrait;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isPlaying) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  return (
    <>
      <div className="relative group w-full max-w-sm" style={{ perspective: '1000px' }}>
        {/* Animated Background Aura Glow */}
        <div
          className={`absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl blur-xl transition-all duration-700 ${
            isPlaying ? 'opacity-50 group-hover:opacity-85 animate-pulse' : 'opacity-20'
          }`}
        />

        {/* 3D Parallax Tilt Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative glass-panel rounded-3xl p-4 flex flex-col items-center text-center overflow-hidden transition-transform duration-200 ease-out border border-white/50 dark:border-neutral-700/60 shadow-2xl"
          style={{
            transform: isPlaying
              ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`
              : 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Card Bar / Interactive Animation Controller */}
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/60 dark:border-neutral-800/60 px-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-indigo-400' : 'bg-neutral-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-indigo-500' : 'bg-neutral-500'}`} />
              </span>
              <span className="text-[11px] tracking-tight uppercase font-mono text-indigo-600 dark:text-indigo-400">
                {animStyle === 'cinematic' ? 'Cinematic Flow' : animStyle === 'live-studio' ? 'Live Video FX' : animStyle === 'cyber-hud' ? 'Cyber HUD' : 'Floating 3D'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                aria-label="Toggle avatar animation"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="View Fullscreen Animation"
                aria-label="Fullscreen view"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Animated Frame Container */}
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner border-2 border-white/50 dark:border-neutral-700/60 mb-3 bg-neutral-950 group/photo">
            
            {/* 1. Main Photographic Layer with Camera Ken Burns / Breathing Zoom */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                id="hero-avatar-image"
                src={activePhoto}
                alt={name}
                className={`w-full h-full object-cover object-top transition-all duration-700 ${
                  isPlaying && animStyle === 'cinematic'
                    ? 'scale-105 animate-[pulse_6s_ease-in-out_infinite]'
                    : isPlaying && animStyle === 'live-studio'
                    ? 'scale-110 translate-y-1'
                    : isPlaying && animStyle === 'floating-3d'
                    ? 'scale-105'
                    : 'scale-100'
                }`}
                style={{
                  animationDuration: animStyle === 'live-studio' ? '8s' : '6s',
                }}
                referrerPolicy="no-referrer"
                onError={(e: any) => {
                  e.target.src = defaultExecutivePortrait;
                }}
              />

              {/* Dynamic Interactive Light Reflection / Specular Sheen */}
              {isPlaying && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%)`,
                  }}
                />
              )}

              {/* 2. Style-Specific Animation Overlays */}

              {/* MODE A: Cinematic Holographic Laser Scan Sweep */}
              {isPlaying && animStyle === 'cinematic' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -inset-x-20 h-16 bg-gradient-to-b from-indigo-500/0 via-indigo-400/25 to-indigo-500/0 blur-sm transform -rotate-12 animate-[scanline_4s_linear_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-indigo-500/10" />
                </div>
              )}

              {/* MODE B: Live Video Studio / Recording Feed Simulation */}
              {isPlaying && animStyle === 'live-studio' && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                  {/* Top Video Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>REC 4K</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-md">
                      <Film className="w-3 h-3 text-indigo-400" />
                      <span>60 FPS</span>
                    </div>
                  </div>

                  {/* Sound Wave Frequency Equalizer Simulation */}
                  <div className="flex items-end justify-center gap-1 h-6">
                    {[16, 28, 12, 32, 22, 14, 36, 18, 26, 10, 30, 20].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-400 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 120}ms`,
                          animationDuration: '900ms',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* MODE C: Cyber HUD / AI Biometric Target Lock */}
              {isPlaying && animStyle === 'cyber-hud' && (
                <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between border-2 border-indigo-400/40 rounded-2xl">
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300 bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                    <span className="flex items-center gap-1">
                      <Scan className="w-3 h-3 animate-spin" />
                      <span>AI_IDENTITY_VERIFIED</span>
                    </span>
                    <span>99.8%</span>
                  </div>

                  {/* Center Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-dashed border-indigo-400/50 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute w-20 h-20 rounded-full border border-purple-400/40 animate-[spin_6s_linear_infinite_reverse]" />
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                    <span>STATUS: ACTIVE</span>
                    <span>LATENCY: 0.2ms</span>
                  </div>
                </div>
              )}

              {/* MODE D: Floating 3D Depth Rings */}
              {isPlaying && animStyle === 'floating-3d' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-indigo-400/30 animate-ping opacity-25" />
                  <div className="absolute w-52 h-52 rounded-full border border-purple-400/20 animate-pulse" />
                </div>
              )}
            </div>

            {/* Bottom Floating Identity Bar */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md text-[11px] font-medium text-white flex items-center justify-between border border-white/10 shadow-lg">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{name}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60">
                {availability || 'Available'}
              </span>
            </div>
          </div>

          {/* Quick Animation Mode Switcher Tabs */}
          <div className="w-full grid grid-cols-4 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl mb-3">
            {[
              { id: 'cinematic', label: 'Flow', icon: Sparkles },
              { id: 'live-studio', label: 'Live FX', icon: Video },
              { id: 'cyber-hud', label: 'HUD', icon: Scan },
              { id: 'floating-3d', label: '3D Tilt', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = animStyle === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setAnimStyle(tab.id as AnimationStyle);
                    if (!isPlaying) setIsPlaying(true);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3 h-3 mb-0.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Verified Stats Highlight Grid */}
          <div className="w-full grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
              <span className="block text-base sm:text-lg font-bold font-display text-indigo-600 dark:text-indigo-400">
                5+
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Years Exp.
              </span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
              <span className="block text-base sm:text-lg font-bold font-display text-purple-600 dark:text-purple-400">
                40+
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Projects
              </span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
              <span className="block text-base sm:text-lg font-bold font-display text-pink-600 dark:text-pink-400">
                99%
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{name} — High Definition Showcase</span>
            </h3>
            <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/50">
              <img
                src={activePhoto}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div className="text-left text-white">
                  <p className="font-bold text-lg">{name}</p>
                  <p className="text-xs text-indigo-300">{title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
