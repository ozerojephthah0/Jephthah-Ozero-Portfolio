import { PortfolioData, Project, Skill, TimelineItem, Achievement, Testimonial, Service, HeroSlide, AIAvatar, ContactMessage, PortfolioSettings } from '../types';

export const api = {
  // Public data
  async getPortfolio(): Promise<Partial<PortfolioData>> {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
  },

  // Admin full data
  async getAdminData(): Promise<PortfolioData> {
    const res = await fetch('/api/admin/data');
    if (!res.ok) throw new Error('Failed to fetch admin data');
    return res.json();
  },

  // Health / API key status
  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean; appUrl: string }> {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Profile
  async updateProfile(profile: Partial<PortfolioData['profile']>): Promise<{ success: boolean; profile: PortfolioData['profile'] }> {
    const res = await fetch('/api/portfolio/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Slides
  async createSlide(slide: Partial<HeroSlide>): Promise<HeroSlide> {
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error('Failed to create slide');
    return res.json();
  },
  async updateSlide(id: string, slide: Partial<HeroSlide>): Promise<HeroSlide> {
    const res = await fetch(`/api/slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error('Failed to update slide');
    return res.json();
  },
  async deleteSlide(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete slide');
    return res.json();
  },

  // Projects
  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },
  async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Skills
  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
  },
  async updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
  },
  async deleteSkill(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
  },
  async createSkillCategory(name: string): Promise<{ id: string; name: string; order: number }> {
    const res = await fetch('/api/skill-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  // Journey
  async createJourneyItem(item: Partial<TimelineItem>): Promise<TimelineItem> {
    const res = await fetch('/api/journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to create journey entry');
    return res.json();
  },
  async updateJourneyItem(id: string, item: Partial<TimelineItem>): Promise<TimelineItem> {
    const res = await fetch(`/api/journey/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update journey entry');
    return res.json();
  },
  async deleteJourneyItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/journey/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Achievements
  async createAchievement(item: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async updateAchievement(id: string, item: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch(`/api/achievements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async deleteAchievement(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Testimonials
  async createTestimonial(item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async updateTestimonial(id: string, item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Services
  async createService(item: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async updateService(id: string, item: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Messages
  async sendMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string; notification: any }> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },
  async markMessageRead(id: string, read = true): Promise<ContactMessage> {
    const res = await fetch(`/api/messages/${id}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    return res.json();
  },
  async replyMessage(id: string, replyText: string): Promise<{ success: boolean; inquiry: ContactMessage }> {
    const res = await fetch(`/api/messages/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText }),
    });
    return res.json();
  },
  async deleteMessage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // AI Avatars
  async generateAvatar(payload: { photo?: string; style: string; styleLabel: string; customPrompt?: string; name?: string }): Promise<{ success: boolean; avatar: AIAvatar; aiStatus: string; description: string; hasGeminiKey: boolean }> {
    const res = await fetch('/api/ai/avatar-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Avatar generation failed');
    return res.json();
  },
  async setAvatarAs(id: string, target: 'hero' | 'about' | 'both'): Promise<{ success: boolean; profile: PortfolioData['profile'] }> {
    const res = await fetch(`/api/avatars/${id}/set-as`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    });
    return res.json();
  },
  async deleteAvatar(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/avatars/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // AI Content Assistant
  async enhanceText(type: 'bio' | 'project' | 'reply', input: string, context?: string): Promise<{ success: boolean; result: string }> {
    const res = await fetch('/api/ai/enhance-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input, context }),
    });
    return res.json();
  },

  // Settings
  async updateSettings(settings: Partial<PortfolioSettings>): Promise<{ success: boolean; settings: PortfolioSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Auth
  async login(email: string, password?: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },
  async socialLogin(provider: string, email?: string, name?: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/social-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email, name }),
    });
    return res.json();
  },
  async resetToDefaults(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/reset-defaults', { method: 'POST' });
    return res.json();
  },
};
