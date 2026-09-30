import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Eye, CircleDot, Zap, Sliders, Check } from 'lucide-react';

export type MouseEffectMode = 'stardust' | 'aura' | 'spotlight' | 'off';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  color: string;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const MouseFollowerEffect: React.FC = () => {
  const [mode, setMode] = useState<MouseEffectMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_mouse_effect_mode');
      if (saved === 'stardust' || saved === 'aura' || saved === 'spotlight' || saved === 'off') {
        return saved;
      }
    }
    return 'stardust';
  });

  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(true);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [isCursorInside, setIsCursorInside] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Position references for 60fps/120fps smooth lerping
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const spotlightPos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const animFrameId = useRef<number | null>(null);

  // Color palette for stardust particles
  const colors = [
    'rgba(99, 102, 241, ', // Indigo
    'rgba(139, 92, 246, ', // Violet
    'rgba(59, 130, 246, ', // Blue
    'rgba(236, 72, 153, ', // Pink
    'rgba(245, 158, 11, ', // Amber
    'rgba(20, 184, 166, ', // Teal
  ];

  // Save mode preference
  const handleModeChange = (newMode: MouseEffectMode) => {
    setMode(newMode);
    localStorage.setItem('portfolio_mouse_effect_mode', newMode);
  };

  // Check device capabilities
  useEffect(() => {
    const checkFinePointer = () => {
      const mq = window.matchMedia('(pointer: fine)');
      setIsPointerFine(mq.matches);
    };
    checkFinePointer();
    window.addEventListener('resize', checkFinePointer);
    return () => window.removeEventListener('resize', checkFinePointer);
  }, []);

  // Initialize canvas size
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Pointer Movement Handlers
  useEffect(() => {
    if (!isPointerFine || mode === 'off') return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isCursorInside) setIsCursorInside(true);

      // Spawn stardust particles when moving in 'stardust' mode
      if (mode === 'stardust') {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);

        // Spawn density based on movement speed
        const spawnCount = Math.min(Math.floor(dist / 8) + 1, 5);
        if (dist > 3) {
          for (let i = 0; i < spawnCount; i++) {
            if (particles.current.length < 90) {
              const colorBase = colors[Math.floor(Math.random() * colors.length)];
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 1.5 + 0.3;
              const size = Math.random() * 3 + 1.5;

              particles.current.push({
                x: e.clientX + (Math.random() - 0.5) * 8,
                y: e.clientY + (Math.random() - 0.5) * 8,
                vx: Math.cos(angle) * speed - dx * 0.05,
                vy: Math.sin(angle) * speed - dy * 0.05,
                size,
                maxSize: size,
                alpha: Math.random() * 0.7 + 0.3,
                color: colorBase,
                decay: Math.random() * 0.02 + 0.015,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
              });
            }
          }
        }
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Inspect target element for interactive hover state
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-interactive], .clickable, summary'
        );
        if (interactiveEl) {
          setIsHoveredInteractive(true);
          const customLabel = interactiveEl.getAttribute('data-cursor-label');
          setHoverLabel(customLabel || null);
        } else {
          setIsHoveredInteractive(false);
          setHoverLabel(null);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn expanding click shockwave ripple
      if (mode !== 'off') {
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4,
          maxRadius: 48,
          alpha: 0.8,
          color: 'rgba(99, 102, 241, ',
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsCursorInside(false);
    };

    const handleMouseEnter = () => {
      setIsCursorInside(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isPointerFine, mode, isCursorInside]);

  // Animation Loop (requestAnimationFrame)
  useEffect(() => {
    if (!isPointerFine || mode === 'off') {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const render = () => {
      // 1. Update Hardware Accelerated Positions with Lerp
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // Smooth outer ring lerp (0.18 speed)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.18;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.18;

      // Smooth spotlight lerp (0.08 speed for ambient weight)
      spotlightPos.current.x += (targetX - spotlightPos.current.x) * 0.08;
      spotlightPos.current.y += (targetY - spotlightPos.current.y) * 0.08;

      // Update Cursor Dot DOM element
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      // Update Cursor Ring DOM element
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update Ambient Spotlight DOM element
      if (spotlightRef.current && (mode === 'spotlight' || mode === 'stardust' || mode === 'aura')) {
        spotlightRef.current.style.transform = `translate3d(${spotlightPos.current.x}px, ${spotlightPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Render Canvas Animations (Particles & Ripples)
      if (ctx && canvas) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw and update click ripples
        for (let i = ripples.current.length - 1; i >= 0; i--) {
          const r = ripples.current[i];
          r.radius += (r.maxRadius - r.radius) * 0.14 + 0.5;
          r.alpha -= 0.035;

          if (r.alpha <= 0 || r.radius >= r.maxRadius) {
            ripples.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.color}${r.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // Draw and update stardust particles
        if (mode === 'stardust') {
          for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.alpha -= p.decay;
            p.rotation += p.rotationSpeed;
            p.size = Math.max(0.2, p.maxSize * (p.alpha / 0.8));

            if (p.alpha <= 0.01 || p.size <= 0.2) {
              particles.current.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            // Shimmering diamond / stardust shape
            ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.5);
            ctx.lineTo(p.size * 0.7, 0);
            ctx.lineTo(0, p.size * 1.5);
            ctx.lineTo(-p.size * 0.7, 0);
            ctx.closePath();
            ctx.fill();

            // Soft core glow
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha * 0.8)})`;
            ctx.fill();

            ctx.restore();
          }
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPointerFine, mode]);

  // Don't render mouse effects on touch devices
  if (!isPointerFine) return null;

  return (
    <>
      {/* 1. Global Ambient Spotlight Glow Tracking Mouse (Backdrop Layer) */}
      {mode !== 'off' && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        >
          <div
            ref={spotlightRef}
            className={`absolute top-0 left-0 w-[550px] h-[550px] rounded-full blur-[90px] transition-opacity duration-700 ${
              isCursorInside ? 'opacity-35 dark:opacity-20' : 'opacity-0'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(168, 85, 247, 0.25) 45%, rgba(59, 130, 246, 0.08) 70%, transparent 85%)',
              willChange: 'transform',
            }}
          />
        </div>
      )}

      {/* 2. Interactive Fluid Particle & Ripple Canvas */}
      {mode !== 'off' && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-40"
          style={{ willChange: 'contents' }}
        />
      )}

      {/* 3. High-Precision Magnetic Cursor Elements */}
      {mode !== 'off' && isCursorInside && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {/* Inner Precision Dot */}
          <div
            ref={cursorDotRef}
            className={`fixed top-0 left-0 rounded-full transition-all duration-150 ease-out flex items-center justify-center ${
              isHoveredInteractive
                ? 'w-3 h-3 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)] scale-125'
                : isClicking
                ? 'w-2 h-2 bg-indigo-400 scale-75'
                : 'w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
            }`}
            style={{ willChange: 'transform' }}
          />

          {/* Outer Magnetic Aura Ring */}
          {(mode === 'stardust' || mode === 'aura') && (
            <div
              ref={cursorRingRef}
              className={`fixed top-0 left-0 rounded-full border border-indigo-500/40 dark:border-indigo-400/50 backdrop-blur-[0.5px] transition-[width,height,background-color,border-color,opacity] duration-300 ease-out flex items-center justify-center ${
                isHoveredInteractive
                  ? 'w-14 h-14 bg-indigo-500/15 border-indigo-500/70 dark:bg-indigo-500/25 shadow-[0_0_24px_rgba(99,102,241,0.35)]'
                  : isClicking
                  ? 'w-8 h-8 bg-indigo-600/20 border-indigo-500/80 scale-90'
                  : 'w-10 h-10 bg-indigo-500/5 dark:bg-indigo-400/5 shadow-[0_0_14px_rgba(99,102,241,0.15)]'
              }`}
              style={{ willChange: 'transform' }}
            >
              {/* Optional dynamic hover label inside ring */}
              {isHoveredInteractive && hoverLabel && (
                <span className="text-[9px] font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-200 animate-in fade-in zoom-in duration-150 select-none">
                  {hoverLabel}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Elegant Floating Mouse Animation Control Widget */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <div className="relative">
          {/* Main Toggle Button */}
          <button
            onClick={() => setShowConfigMenu(!showConfigMenu)}
            aria-label="Customize Interactive Mouse Effects"
            title="Interactive Mouse Effects"
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 shadow-lg hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-all group"
            data-cursor-interactive="true"
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
              {mode === 'stardust' ? (
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              ) : mode === 'aura' ? (
                <CircleDot className="w-3.5 h-3.5" />
              ) : mode === 'spotlight' ? (
                <Zap className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5 opacity-60" />
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
              Mouse Effect
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono capitalize">
              {mode}
            </span>
          </button>

          {/* Quick Menu Popover */}
          {showConfigMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowConfigMenu(false)}
              />
              <div className="absolute bottom-full left-0 mb-3 w-64 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-3 shadow-2xl z-40 animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800/80 px-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Mouse Animation Style</span>
                  </div>
                  <button
                    onClick={() => setShowConfigMenu(false)}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    Done
                  </button>
                </div>

                <div className="space-y-1">
                  {[
                    {
                      id: 'stardust',
                      label: 'Stardust & Fluid Aura',
                      desc: 'Sparkling particle trail & magnetic ring',
                      icon: Sparkles,
                    },
                    {
                      id: 'aura',
                      label: 'Minimal Fluid Ring',
                      desc: 'Smooth magnetic glowing cursor aura',
                      icon: CircleDot,
                    },
                    {
                      id: 'spotlight',
                      label: 'Ambient Spotlight Only',
                      desc: 'Subtle atmospheric background light',
                      icon: Zap,
                    },
                    {
                      id: 'off',
                      label: 'Standard Cursor',
                      desc: 'Default OS pointer without overlay',
                      icon: Eye,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = mode === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleModeChange(item.id as MouseEffectMode);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-2xl text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80'
                            : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${
                                isSelected
                                  ? 'text-indigo-900 dark:text-indigo-200'
                                  : 'text-neutral-800 dark:text-neutral-200'
                              }`}
                            >
                              {item.label}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
