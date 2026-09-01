import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AIAvatar, AvatarStyle } from '../../types';
import { api } from '../../services/api';
import {
  Sparkles,
  Camera,
  Upload,
  RefreshCw,
  Download,
  Check,
  CheckCircle2,
  Trash2,
  Sliders,
  Image as ImageIcon,
  User,
  Zap,
  Info,
  X,
  Play,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const avatarStyles: { id: AvatarStyle; label: string; description: string; sampleThumb: string }[] = [
  {
    id: 'professional-suit',
    label: 'Professional Suit',
    description: 'Crisp executive tailored suit with subtle studio rim lighting.',
    sampleThumb: '/assets/jephthah_portrait.jpg',
  },
  {
    id: '3d-avatar',
    label: '3D Stylized Avatar',
    description: 'Vibrant modern 3D clay-render character style.',
    sampleThumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cartoon',
    label: 'Cartoon Art Style',
    description: 'Clean vector line-art with cell-shaded digital coloring.',
    sampleThumb: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'futuristic-digital',
    label: 'Futuristic Digital',
    description: 'Neon cyberpunk aura with holographic geometric grid highlights.',
    sampleThumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'professional-portrait',
    label: 'Studio Portrait',
    description: '85mm f/1.4 natural light portrait photograph with creamy bokeh.',
    sampleThumb: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'creative-illustration',
    label: 'Creative Illustration',
    description: 'Contemporary editorial illustration with abstract geometries.',
    sampleThumb: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'developer-tech',
    label: 'Tech Developer',
    description: 'Ambient monitor glow with subtle dark-mode code reflections.',
    sampleThumb: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  },
];

export const AiAvatarStudio: React.FC = () => {
  const { data, setData, addToast, hasGeminiKey } = usePortfolio();
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>('professional-suit');
  const [customPrompt, setCustomPrompt] = useState('');
  const [avatarName, setAvatarName] = useState('');
  
  // Source photo state (upload or webcam capture)
  const [sourcePhoto, setSourcePhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState<AIAvatar | null>(null);
  const [aiDescription, setAiDescription] = useState<string>('');

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or deactivated
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('Unable to access device webcam. Please check permissions or upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  // Capture snapshot with 3s countdown
  const triggerCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSourcePhoto(dataUrl);
      stopCamera();
      addToast('Snapshot captured successfully!', 'info');
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSourcePhoto(event.target.result as string);
        stopCamera();
        addToast('Photo uploaded successfully!', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourcePhoto(event.target.result as string);
          stopCamera();
          addToast('Photo dropped successfully!', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Generation Pipeline
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing source features and composition...');

    const styleObj = avatarStyles.find((s) => s.id === selectedStyle) || avatarStyles[0];

    try {
      setTimeout(() => {
        setGenerationStep(`Synthesizing neural features in ${styleObj.label} style...`);
      }, 700);

      setTimeout(() => {
        setGenerationStep('Applying high-definition texture refinement & tone grading...');
      }, 1400);

      const response = await api.generateAvatar({
        photo: sourcePhoto || undefined,
        style: selectedStyle,
        styleLabel: styleObj.label,
        customPrompt,
        name: avatarName || `${styleObj.label} Avatar`,
      });

      if (response.success && response.avatar) {
        setGeneratedResult(response.avatar);
        setAiDescription(response.description);
        
        // Update local context
        setData((prev) => ({
          ...prev,
          avatars: [response.avatar, ...prev.avatars],
        }));

        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });

        addToast('AI Avatar generated and stored in your library!', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to generate avatar', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Set avatar as Hero or About
  const handleSetActive = async (avatarId: string, target: 'hero' | 'about' | 'both') => {
    try {
      const res = await api.setAvatarAs(avatarId, target);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          profile: res.profile,
          avatars: prev.avatars.map((a) => ({
            ...a,
            isDefaultHero: target === 'hero' || target === 'both' ? a.id === avatarId : a.isDefaultHero,
            isDefaultAbout: target === 'about' || target === 'both' ? a.id === avatarId : a.isDefaultAbout,
          })),
        }));
        addToast(`Profile active ${target} image updated!`, 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to update active avatar', 'error');
    }
  };

  // Delete Avatar
  const handleDeleteAvatar = async (id: string) => {
    try {
      await api.deleteAvatar(id);
      setData((prev) => ({
        ...prev,
        avatars: prev.avatars.filter((a) => a.id !== id),
      }));
      if (generatedResult?.id === id) setGeneratedResult(null);
      addToast('Avatar removed from library.', 'info');
    } catch (err: any) {
      addToast('Failed to delete avatar', 'error');
    }
  };

  // Download Avatar Image
  const handleDownloadAvatar = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}_avatar.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Avatar download initiated.', 'success');
  };

  return (
    <section id="avatar-studio" className="py-20 relative">
      {/* Hidden canvas for webcam snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Avatar Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Generate & Customize Your AI Persona
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Upload your picture or capture live with your camera, pick a high-fashion or 3D digital art style, and generate instant portfolio headshots powered by server-side intelligence.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300">
            <Info className="w-3 h-3 text-indigo-500" />
            <span>
              {hasGeminiKey
                ? 'Gemini 3.7 Flash Engine Connected'
                : 'Intelligent Style Simulation Mode (Keys managed server-side)'}
            </span>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Photo Capture & Style Selectors (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Photo Input Section */}
            <div className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Select or Capture Source Image
                </span>
                {sourcePhoto && (
                  <button
                    onClick={() => {
                      setSourcePhoto(null);
                      stopCamera();
                    }}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Clear Photo
                  </button>
                )}
              </div>

              {/* Viewfinder / Upload Box */}
              {!isCameraActive && !sourcePhoto && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors flex flex-col items-center justify-center space-y-3 bg-neutral-50/50 dark:bg-neutral-900/50"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Drag and drop your photo here, or browse
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      JPG, PNG or WebP up to 15MB
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      onClick={startCamera}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Use Webcam</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Live Webcam Viewfinder */}
              {isCameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-square max-h-80 mx-auto flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Countdown Overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-7xl font-extrabold text-white animate-ping">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Camera Controls Overlay */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                    <button
                      onClick={stopCamera}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900/80 text-white text-xs backdrop-blur-md"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={triggerCapture}
                      disabled={countdown !== null}
                      className="w-14 h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center font-bold shadow-xl hover:scale-105 transition-transform border-4 border-indigo-600"
                      title="Take Snapshot"
                    >
                      <Camera className="w-6 h-6 text-indigo-600" />
                    </button>

                    <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-md">
                      Timer: 3s
                    </span>
                  </div>
                </div>
              )}

              {/* Photo Preview when set */}
              {sourcePhoto && !isCameraActive && (
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                  <img
                    src={sourcePhoto}
                    alt="Source"
                    className="w-16 h-16 rounded-xl object-cover border border-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate">
                      Source Image Ready
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready for AI styling transformation
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSourcePhoto(null);
                      startCamera();
                    }}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2"
                  >
                    Retake
                  </button>
                </div>
              )}

              {cameraError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-800">
                  {cameraError}
                </div>
              )}
            </div>

            {/* Step 2: Choose Style */}
            <div className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                Choose Artistic Avatar Style
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {avatarStyles.map((st) => {
                  const isSelected = selectedStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStyle(st.id)}
                      className={`group relative p-2.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/40 dark:bg-neutral-900/40'
                      }`}
                    >
                      <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-neutral-800">
                        <img
                          src={st.sampleThumb}
                          alt={st.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
                        {st.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-tight mt-0.5">
                        {st.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Instructions & Name */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Custom Prompt Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Add purple neon rim glasses, dark turtleneck, confident expression..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Generate CTA */}
              <button
                id="generate-ai-avatar-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{generationStep || 'Generating AI Avatar...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Avatar</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Result Preview & Active Avatar Library (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Result / Showcase Card */}
            <div className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Latest Generated Avatar
              </span>

              {generatedResult ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-neutral-800 group">
                    <img
                      src={generatedResult.imageUrl}
                      alt={generatedResult.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 shadow-sm mb-1 inline-block">
                        {generatedResult.styleLabel}
                      </span>
                      <h3 className="text-base font-bold truncate">
                        {generatedResult.name}
                      </h3>
                    </div>
                  </div>

                  {aiDescription && (
                    <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 block mb-0.5">
                        Style Analysis:
                      </span>
                      {aiDescription}
                    </div>
                  )}

                  {/* Actions for Generated Result */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSetActive(generatedResult.id, 'hero')}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Set as Hero Picture</span>
                    </button>

                    <button
                      onClick={() => handleSetActive(generatedResult.id, 'about')}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Set as About Bio</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDownloadAvatar(generatedResult.imageUrl, generatedResult.name)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download High-Res Image</span>
                  </button>
                </div>
              ) : (
                <div className="aspect-square w-full rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Sparkles className="w-10 h-10 text-neutral-400" />
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    No avatar generated in this session yet
                  </p>
                  <p className="text-[11px] text-neutral-500 max-w-xs">
                    Select a style and click "Generate AI Avatar" to see your high-definition portrait rendered here.
                  </p>
                </div>
              )}
            </div>

            {/* Saved Avatars Library */}
            <div className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Saved Avatars Library ({data.avatars?.length || 0})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {data.avatars?.map((av) => (
                  <div
                    key={av.id}
                    className="group relative rounded-xl overflow-hidden bg-neutral-900 aspect-square border border-neutral-200 dark:border-neutral-800"
                  >
                    <img
                      src={av.imageUrl}
                      alt={av.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Active indicators */}
                    <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                      {av.isDefaultHero && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-bold">
                          Hero
                        </span>
                      )}
                      {av.isDefaultAbout && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-bold">
                          About
                        </span>
                      )}
                    </div>

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 text-center">
                      <button
                        onClick={() => handleSetActive(av.id, 'hero')}
                        className="text-[9px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded"
                      >
                        Set Hero
                      </button>
                      <button
                        onClick={() => handleSetActive(av.id, 'about')}
                        className="text-[9px] font-bold text-white bg-purple-600 px-2 py-0.5 rounded"
                      >
                        Set About
                      </button>
                      <button
                        onClick={() => handleDeleteAvatar(av.id)}
                        className="text-rose-400 hover:text-rose-200 p-0.5"
                        title="Delete avatar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
