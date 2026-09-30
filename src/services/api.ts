import { PortfolioData, Project, Skill, TimelineItem, Achievement, Testimonial, Service, HeroSlide, AIAvatar, ContactMessage, PortfolioSettings } from '../types';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('portfolio_auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Public data (always accessible)
  async getPortfolio(): Promise<Partial<PortfolioData>> {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
  },

  // Admin full data (protected)
  async getAdminData(): Promise<PortfolioData> {
    const res = await fetch('/api/admin/data', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Fall back to public portfolio endpoint if unauthenticated
        const publicData = await this.getPortfolio();
        return publicData as PortfolioData;
      }
      throw new Error('Failed to fetch admin data');
    }
    return res.json();
  },

  // Health / API key status
  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean; appUrl: string }> {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Profile (protected)
  async updateProfile(profile: Partial<PortfolioData['profile']>): Promise<{ success: boolean; profile: PortfolioData['profile'] }> {
    const res = await fetch('/api/portfolio/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update profile' }));
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  // Slides (protected mutating routes)
  async createSlide(slide: Partial<HeroSlide>): Promise<HeroSlide> {
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(slide),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create slide' }));
      throw new Error(err.error || 'Failed to create slide');
    }
    return res.json();
  },
  async updateSlide(id: string, slide: Partial<HeroSlide>): Promise<HeroSlide> {
    const res = await fetch(`/api/slides/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(slide),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update slide' }));
      throw new Error(err.error || 'Failed to update slide');
    }
    return res.json();
  },
  async deleteSlide(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/slides/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete slide' }));
      throw new Error(err.error || 'Failed to delete slide');
    }
    return res.json();
  },

  // Projects (protected mutating routes)
  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create project' }));
      throw new Error(err.error || 'Failed to create project');
    }
    return res.json();
  },
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update project' }));
      throw new Error(err.error || 'Failed to update project');
    }
    return res.json();
  },
  async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete project' }));
      throw new Error(err.error || 'Failed to delete project');
    }
    return res.json();
  },

  // Skills (protected mutating routes)
  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create skill' }));
      throw new Error(err.error || 'Failed to create skill');
    }
    return res.json();
  },
  async updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update skill' }));
      throw new Error(err.error || 'Failed to update skill');
    }
    return res.json();
  },
  async deleteSkill(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete skill' }));
      throw new Error(err.error || 'Failed to delete skill');
    }
    return res.json();
  },
  async createSkillCategory(name: string): Promise<{ id: string; name: string; order: number }> {
    const res = await fetch('/api/skill-categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create category' }));
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  // Journey (protected mutating routes)
  async createJourneyItem(item: Partial<TimelineItem>): Promise<TimelineItem> {
    const res = await fetch('/api/journey', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create timeline item' }));
      throw new Error(err.error || 'Failed to create timeline item');
    }
    return res.json();
  },
  async updateJourneyItem(id: string, item: Partial<TimelineItem>): Promise<TimelineItem> {
    const res = await fetch(`/api/journey/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update timeline item' }));
      throw new Error(err.error || 'Failed to update timeline item');
    }
    return res.json();
  },
  async deleteJourneyItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/journey/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete timeline item' }));
      throw new Error(err.error || 'Failed to delete timeline item');
    }
    return res.json();
  },

  // Achievements (protected mutating routes)
  async createAchievement(item: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create achievement' }));
      throw new Error(err.error || 'Failed to create achievement');
    }
    return res.json();
  },
  async updateAchievement(id: string, item: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch(`/api/achievements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update achievement' }));
      throw new Error(err.error || 'Failed to update achievement');
    }
    return res.json();
  },
  async deleteAchievement(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete achievement' }));
      throw new Error(err.error || 'Failed to delete achievement');
    }
    return res.json();
  },

  // Testimonials (protected mutating routes)
  async createTestimonial(item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create testimonial' }));
      throw new Error(err.error || 'Failed to create testimonial');
    }
    return res.json();
  },
  async updateTestimonial(id: string, item: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update testimonial' }));
      throw new Error(err.error || 'Failed to update testimonial');
    }
    return res.json();
  },
  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete testimonial' }));
      throw new Error(err.error || 'Failed to delete testimonial');
    }
    return res.json();
  },

  // Services (protected mutating routes)
  async createService(item: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create service' }));
      throw new Error(err.error || 'Failed to create service');
    }
    return res.json();
  },
  async updateService(id: string, item: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update service' }));
      throw new Error(err.error || 'Failed to update service');
    }
    return res.json();
  },
  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete service' }));
      throw new Error(err.error || 'Failed to delete service');
    }
    return res.json();
  },

  // Messages (Public submission with anti-spam rate limiting; reading & replying is protected)
  async sendMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string; notification: any }> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to send message' }));
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },
  async markMessageRead(id: string, read = true): Promise<ContactMessage> {
    const res = await fetch(`/api/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to mark message as read' }));
      throw new Error(err.error || 'Failed to mark message as read');
    }
    return res.json();
  },
  async replyMessage(id: string, replyText: string): Promise<{ success: boolean; inquiry: ContactMessage }> {
    const res = await fetch(`/api/messages/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ replyText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to send reply' }));
      throw new Error(err.error || 'Failed to send reply');
    }
    return res.json();
  },
  async deleteMessage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete message' }));
      throw new Error(err.error || 'Failed to delete message');
    }
    return res.json();
  },

  // AI Avatars (Protected / Rate-limited)
  async generateAvatar(payload: { photo?: string; style: string; styleLabel: string; customPrompt?: string; name?: string }): Promise<{ success: boolean; avatar: AIAvatar; aiStatus: string; description: string; hasGeminiKey: boolean }> {
    const res = await fetch('/api/ai/avatar-generate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Avatar generation failed' }));
      throw new Error(err.error || 'Avatar generation failed');
    }
    return res.json();
  },
  async setAvatarAs(id: string, target: 'hero' | 'about' | 'both'): Promise<{ success: boolean; profile: PortfolioData['profile'] }> {
    const res = await fetch(`/api/avatars/${id}/set-as`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ target }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to set avatar' }));
      throw new Error(err.error || 'Failed to set avatar');
    }
    return res.json();
  },
  async deleteAvatar(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/avatars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete avatar' }));
      throw new Error(err.error || 'Failed to delete avatar');
    }
    return res.json();
  },

  // AI Content Assistant
  async enhanceText(type: 'bio' | 'project' | 'reply', input: string, context?: string): Promise<{ success: boolean; result: string }> {
    const res = await fetch('/api/ai/enhance-text', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type, input, context }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to enhance text' }));
      throw new Error(err.error || 'Failed to enhance text');
    }
    return res.json();
  },

  // Settings (Protected)
  async updateSettings(settings: Partial<PortfolioSettings>): Promise<{ success: boolean; settings: PortfolioSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update settings' }));
      throw new Error(err.error || 'Failed to update settings');
    }
    return res.json();
  },

  // Auth & Admin Reset
  async login(email: string, password?: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
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
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Social authentication failed' }));
      throw new Error(err.error || 'Social authentication failed');
    }
    return res.json();
  },
  async resetToDefaults(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/reset-defaults', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to reset database' }));
      throw new Error(err.error || 'Failed to reset database');
    }
    return res.json();
  },
  async getSecurityStatus(): Promise<{ status: string; firewall: any; authorizedAdmin: string; totalBlockedAttempts: number; recentThreats: any[] }> {
    const res = await fetch('/api/admin/security-status', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch security telemetry');
    }
    return res.json();
  },
  async rotateSessionKeys(): Promise<{ success: boolean; message: string; freshToken: string }> {
    const res = await fetch('/api/admin/rotate-keys', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to rotate session keys');
    }
    const data = await res.json();
    if (data.freshToken && typeof window !== 'undefined') {
      localStorage.setItem('portfolio_auth_token', data.freshToken);
    }
    return data;
  },
};
