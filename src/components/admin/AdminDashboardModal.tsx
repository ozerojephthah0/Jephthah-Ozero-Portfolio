import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { api } from '../../services/api';
import {
  Project,
  HeroSlide,
  Skill,
  TimelineItem,
  Achievement,
  Testimonial,
  Service,
  ContactMessage,
} from '../../types';
import {
  Shield,
  X,
  User,
  Sliders,
  Briefcase,
  Cpu,
  GitCommit,
  Award,
  MessageSquareQuote,
  Layers,
  Sparkles,
  Inbox,
  Activity,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  RefreshCw,
  Eye,
  Send,
  LogOut,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    data,
    setData,
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    logout,
    addToast,
    refreshData,
    currentUser,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'slides'
    | 'projects'
    | 'skills'
    | 'journey'
    | 'achievements'
    | 'testimonials'
    | 'services'
    | 'avatars'
    | 'messages'
    | 'logs'
    | 'settings'
  >('profile');

  // Form states
  const [profileForm, setProfileForm] = useState(data.profile);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingJourney, setEditingJourney] = useState<Partial<TimelineItem> | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [replyText, setReplyText] = useState<{ [msgId: string]: string }>({});
  const [aiDraftLoading, setAiDraftLoading] = useState<{ [msgId: string]: boolean }>({});

  if (!isAdminDashboardOpen) return null;

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile(profileForm);
      if (res.success) {
        setData((prev) => ({ ...prev, profile: res.profile }));
        addToast('Profile configuration updated successfully!', 'success');
      }
    } catch (err: any) {
      addToast('Failed to save profile', 'error');
    }
  };

  // AI Enhance Bio
  const handleAiEnhanceBio = async () => {
    try {
      addToast('Polishing bio using AI...', 'info');
      const res = await api.enhanceText('bio', profileForm.bio);
      if (res.result) {
        setProfileForm((prev) => ({ ...prev, bio: res.result }));
        addToast('Biography polished with AI!', 'success');
      }
    } catch (e) {
      addToast('Failed to enhance bio', 'error');
    }
  };

  // --- SLIDES CRUD ---
  const handleSaveSlide = async () => {
    if (!editingSlide) return;
    try {
      if (editingSlide.id) {
        const updated = await api.updateSlide(editingSlide.id, editingSlide);
        setData((prev) => ({
          ...prev,
          slides: prev.slides.map((s) => (s.id === updated.id ? updated : s)),
        }));
        addToast('Slide updated!', 'success');
      } else {
        const created = await api.createSlide(editingSlide);
        setData((prev) => ({ ...prev, slides: [...prev.slides, created] }));
        addToast('New slide created!', 'success');
      }
      setEditingSlide(null);
    } catch (e) {
      addToast('Failed to save slide', 'error');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      await api.deleteSlide(id);
      setData((prev) => ({ ...prev, slides: prev.slides.filter((s) => s.id !== id) }));
      addToast('Slide removed', 'info');
    } catch (e) {
      addToast('Failed to delete slide', 'error');
    }
  };

  // --- PROJECTS CRUD ---
  const handleSaveProject = async () => {
    if (!editingProject) return;
    try {
      if (editingProject.id) {
        const updated = await api.updateProject(editingProject.id, editingProject);
        setData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === updated.id ? updated : p)),
        }));
        addToast('Project updated!', 'success');
      } else {
        const created = await api.createProject(editingProject);
        setData((prev) => ({ ...prev, projects: [created, ...prev.projects] }));
        addToast('Project published!', 'success');
      }
      setEditingProject(null);
    } catch (e) {
      addToast('Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
      addToast('Project deleted', 'info');
    } catch (e) {
      addToast('Failed to delete project', 'error');
    }
  };

  const handleAiEnhanceProject = async () => {
    if (!editingProject?.title) {
      addToast('Please enter a project title first.', 'info');
      return;
    }
    try {
      addToast('Generating project case study details...', 'info');
      const res = await api.enhanceText('project', editingProject.title, (editingProject.tags || []).join(', '));
      if (res.result) {
        setEditingProject((prev) => ({
          ...prev,
          fullDescription: res.result,
        }));
        addToast('AI description generated!', 'success');
      }
    } catch (e) {
      addToast('Failed to generate project text', 'error');
    }
  };

  // --- SKILLS CRUD ---
  const handleSaveSkill = async () => {
    if (!editingSkill) return;
    try {
      if (editingSkill.id) {
        const updated = await api.updateSkill(editingSkill.id, editingSkill);
        setData((prev) => ({
          ...prev,
          skills: prev.skills.map((s) => (s.id === updated.id ? updated : s)),
        }));
        addToast('Skill updated!', 'success');
      } else {
        const created = await api.createSkill(editingSkill);
        setData((prev) => ({ ...prev, skills: [...prev.skills, created] }));
        addToast('Skill added!', 'success');
      }
      setEditingSkill(null);
    } catch (e) {
      addToast('Failed to save skill', 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
      addToast('Skill removed', 'info');
    } catch (e) {
      addToast('Failed to delete skill', 'error');
    }
  };

  // --- MESSAGES INBOX ---
  const handleToggleReadMessage = async (msg: ContactMessage) => {
    try {
      const updated = await api.markMessageRead(msg.id, !msg.read);
      setData((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m.id === msg.id ? updated : m)),
      }));
    } catch (e) {
      addToast('Failed to update message status', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await api.deleteMessage(id);
      setData((prev) => ({ ...prev, messages: prev.messages.filter((m) => m.id !== id) }));
      addToast('Message removed from inbox', 'info');
    } catch (e) {
      addToast('Failed to delete message', 'error');
    }
  };

  const handleGenerateAiReply = async (msg: ContactMessage) => {
    setAiDraftLoading((prev) => ({ ...prev, [msg.id]: true }));
    try {
      const res = await api.enhanceText('reply', `${msg.name} writes: ${msg.message}`);
      if (res.result) {
        setReplyText((prev) => ({ ...prev, [msg.id]: res.result }));
        addToast('AI reply draft generated!', 'success');
      }
    } catch (e) {
      addToast('Failed to draft reply', 'error');
    } finally {
      setAiDraftLoading((prev) => ({ ...prev, [msg.id]: false }));
    }
  };

  const handleSendReply = async (msg: ContactMessage) => {
    const text = replyText[msg.id];
    if (!text) {
      addToast('Please type or generate a reply text first.', 'error');
      return;
    }
    try {
      const res = await api.replyMessage(msg.id, text);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          messages: prev.messages.map((m) => (m.id === msg.id ? res.inquiry : m)),
        }));
        addToast(`Reply dispatched to ${msg.email}!`, 'success');
      }
    } catch (e) {
      addToast('Failed to send reply', 'error');
    }
  };

  // --- RESET DEMO DATA ---
  const handleResetToDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all portfolio data to the initial default showcase?')) {
      try {
        await api.resetToDefaults();
        await refreshData();
        addToast('Portfolio reset to default showcase data.', 'info');
      } catch (e) {
        addToast('Failed to reset portfolio', 'error');
      }
    }
  };

  const unreadCount = data.messages?.filter((m) => !m.read).length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setIsAdminDashboardOpen(false)}
      />

      {/* Main Admin Panel Card */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                  Content Management & Admin Console
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Logged in as <strong className="text-neutral-700 dark:text-neutral-300">{currentUser?.name || 'Administrator'}</strong> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Body: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Tab Navigation */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0 bg-neutral-50/30 dark:bg-neutral-950/20">
            {[
              { id: 'profile', label: 'Profile & Bio', icon: User },
              { id: 'slides', label: 'Hero Slideshow', icon: Sliders },
              { id: 'projects', label: 'Projects & Work', icon: Briefcase, count: data.projects?.length },
              { id: 'skills', label: 'Skills & Tech', icon: Cpu, count: data.skills?.length },
              { id: 'journey', label: 'Career Journey', icon: GitCommit, count: data.journey?.length },
              { id: 'achievements', label: 'Achievements', icon: Award, count: data.achievements?.length },
              { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, count: data.testimonials?.length },
              { id: 'services', label: 'Services', icon: Layers, count: data.services?.length },
              { id: 'avatars', label: 'AI Avatars', icon: Sparkles, count: data.avatars?.length },
              { id: 'messages', label: 'Inbox Messages', icon: Inbox, count: unreadCount, badgeColor: 'bg-rose-500' },
              { id: 'logs', label: 'Activity Logs', icon: Activity },
              { id: 'settings', label: 'Settings & SEO', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white text-indigo-600'
                          : tab.badgeColor
                          ? 'bg-rose-500 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Workspace */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Primary Profile Configuration
                  </h3>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Current Availability Status
                    </label>
                    <input
                      type="text"
                      value={profileForm.availability}
                      onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileForm.yearsExperience}
                      onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Punchy Tagline
                  </label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Full Biography
                    </label>
                    <button
                      type="button"
                      onClick={handleAiEnhanceBio}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Polish with AI</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </form>
            )}

            {/* TAB 2: SLIDES */}
            {activeTab === 'slides' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Hero Dynamic Slideshow ({data.slides?.length})
                  </h3>
                  <button
                    onClick={() =>
                      setEditingSlide({
                        title: 'New Headline Slide',
                        subtitle: 'INNOVATION',
                        description: 'Description highlighting another achievement or core service.',
                        tag: 'Spotlight',
                        ctaText: 'Explore Projects',
                        ctaLink: '#projects',
                        duration: 5000,
                        active: true,
                      })
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Slide</span>
                  </button>
                </div>

                {/* Slides List */}
                <div className="space-y-3">
                  {data.slides?.map((slide) => (
                    <div
                      key={slide.id}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {slide.tag || 'Slide'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                            {slide.title}
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-1">{slide.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingSlide(slide)}
                          className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Modal for Slide */}
                {editingSlide && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl max-w-lg w-full space-y-4 border border-neutral-200 dark:border-neutral-800">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {editingSlide.id ? 'Edit Slide' : 'Create Slide'}
                      </h4>
                      <input
                        type="text"
                        placeholder="Tag (e.g. Spotlight)"
                        value={editingSlide.tag || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Subtitle / Eyebrow"
                        value={editingSlide.subtitle || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={editingSlide.title || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <textarea
                        rows={3}
                        placeholder="Description"
                        value={editingSlide.description || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingSlide(null)}
                          className="px-4 py-2 rounded-xl text-xs text-neutral-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveSlide}
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                        >
                          Save Slide
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Projects Showcase ({data.projects?.length})
                  </h3>
                  <button
                    onClick={() =>
                      setEditingProject({
                        title: 'New Innovation Platform',
                        category: 'Web Apps',
                        shortDescription: 'Full-stack platform delivering intelligent workflow automation.',
                        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
                        tags: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
                        featured: true,
                        status: 'Completed',
                        liveUrl: 'https://example.com',
                        githubUrl: 'https://github.com',
                      })
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.projects?.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {proj.category}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white mt-1">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-neutral-500 line-clamp-1">{proj.shortDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Project Dialog */}
                {editingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl max-w-xl w-full space-y-4 border border-neutral-200 dark:border-neutral-800 my-8">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {editingProject.id ? 'Edit Project' : 'Add New Project'}
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        />
                        <select
                          value={editingProject.category || 'Web Apps'}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        >
                          <option value="Web Apps">Web Apps</option>
                          <option value="Mobile Apps">Mobile Apps</option>
                          <option value="AI Projects">AI Projects</option>
                          <option value="Games">Games</option>
                          <option value="Design">Design</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editingProject.image || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />

                      <textarea
                        rows={2}
                        placeholder="Short Description"
                        value={editingProject.shortDescription || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Full Case Study Description
                          </label>
                          <button
                            type="button"
                            onClick={handleAiEnhanceProject}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={editingProject.fullDescription || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded-xl text-xs text-neutral-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProject}
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Skills & Tech Stack ({data.skills?.length})
                  </h3>
                  <button
                    onClick={() =>
                      setEditingSkill({
                        name: 'New Skill',
                        category: 'Frontend & UI Craft',
                        level: 90,
                        levelLabel: 'Expert',
                        iconName: 'Code',
                        description: 'Production-tested development experience.',
                      })
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.skills?.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-neutral-400 block">{s.category}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                          {s.name} ({s.level}%)
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSkill(s)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(s.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingSkill && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl max-w-md w-full space-y-4 border border-neutral-200 dark:border-neutral-800">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {editingSkill.id ? 'Edit Skill' : 'Add Skill'}
                      </h4>
                      <input
                        type="text"
                        placeholder="Skill Name"
                        value={editingSkill.name || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={editingSkill.category || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Proficiency % (0-100)"
                          value={editingSkill.level || 85}
                          onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Level Label (e.g. Expert)"
                          value={editingSkill.levelLabel || 'Expert'}
                          onChange={(e) => setEditingSkill({ ...editingSkill, levelLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingSkill(null)} className="px-4 py-2 text-xs text-neutral-500">
                          Cancel
                        </button>
                        <button onClick={handleSaveSkill} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
                          Save Skill
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 10: INBOX MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Direct Contact Inquiries ({data.messages?.length || 0})
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {data.messages && data.messages.length > 0 ? (
                  <div className="space-y-4">
                    {data.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          !msg.read
                            ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/20'
                            : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                                {msg.name}
                              </h4>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                                ({msg.email})
                              </span>
                              {!msg.read && (
                                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                                  New
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mt-1">
                              Subject: {msg.subject}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                              Received: {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleReadMessage(msg)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-200/60 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200"
                            >
                              {msg.read ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Message text */}
                        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 my-3 leading-relaxed">
                          {msg.message}
                        </div>

                        {/* Reply Area */}
                        {msg.replied ? (
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Replied at {new Date(msg.repliedAt || '').toLocaleString()}</span>
                            </div>
                            <p className="italic">"{msg.replyText}"</p>
                          </div>
                        ) : (
                          <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-neutral-500">
                                Draft Automated Reply
                              </span>
                              <button
                                type="button"
                                onClick={() => handleGenerateAiReply(msg)}
                                disabled={aiDraftLoading[msg.id]}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{aiDraftLoading[msg.id] ? 'Drafting...' : 'Generate with AI'}</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={`Write response to ${msg.name}...`}
                                value={replyText[msg.id] || ''}
                                onChange={(e) =>
                                  setReplyText({ ...replyText, [msg.id]: e.target.value })
                                }
                                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                              />
                              <button
                                onClick={() => handleSendReply(msg)}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-xs text-neutral-400">
                    No inquiries received yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB 11: ACTIVITY LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Audit Activity Trail ({data.activityLogs?.length || 0})
                </h3>
                <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
                  {data.activityLogs?.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {log.action}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                            {log.category}
                          </span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 12: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Website Settings & Reset Options
                </h3>

                <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        Anti-Spam Security Challenge (CAPTCHA)
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Enforces math verification on contact inquiries.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.settings.captchaProtectionEnabled}
                      onChange={async (e) => {
                        const updated = { ...data.settings, captchaProtectionEnabled: e.target.checked };
                        await api.updateSettings(updated);
                        setData((prev) => ({ ...prev, settings: updated }));
                        addToast('Setting saved!', 'info');
                      }}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        Hero Carousel Autoplay
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Automatically cycle hero spotlight slides.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.settings.carouselAutoplay}
                      onChange={async (e) => {
                        const updated = { ...data.settings, carouselAutoplay: e.target.checked };
                        await api.updateSettings(updated);
                        setData((prev) => ({ ...prev, settings: updated }));
                        addToast('Setting saved!', 'info');
                      }}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Danger Zone & Reset</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Reset your portfolio data, hero slides, case studies, and skills back to the standard showcase state.
                  </p>
                  <button
                    onClick={handleResetToDefaults}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Portfolio to Default Showcase</span>
                  </button>
                </div>
              </div>
            )}

            {/* Other tabs fallback notice for quick editing */}
            {['journey', 'achievements', 'testimonials', 'services', 'avatars'].includes(activeTab) && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white capitalize">
                  {activeTab} Management
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage records in your {activeTab} section. All changes instantly persist to your portfolio storage and sync live.
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs">
                  Showing {Array.isArray((data as any)[activeTab]) ? (data as any)[activeTab].length : 0} items active on the live site.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
