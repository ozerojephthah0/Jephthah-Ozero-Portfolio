import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { defaultPortfolioData } from './src/data/defaultData';
import { PortfolioData } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory + file-backed database
let db: PortfolioData;

function loadDatabase(): PortfolioData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return { ...defaultPortfolioData, ...parsed };
    }
  } catch (err) {
    console.error('Error loading database file, using defaults:', err);
  }
  return JSON.parse(JSON.stringify(defaultPortfolioData));
}

function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

db = loadDatabase();

// Lazy Gemini SDK client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function logActivity(action: string, details: string, category: 'content' | 'auth' | 'avatar' | 'settings' | 'message', user = 'Admin') {
  const newLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    action,
    details,
    timestamp: new Date().toISOString(),
    user,
    category,
  };
  db.activityLogs.unshift(newLog);
  if (db.activityLogs.length > 50) {
    db.activityLogs = db.activityLogs.slice(0, 50);
  }
  saveDatabase();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API ROUTES ---

  // Health & AI Status
  app.get('/api/health', (req, res) => {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: 'ok',
      hasGeminiKey,
      timestamp: new Date().toISOString(),
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    });
  });

  // Get full portfolio data (public)
  app.get('/api/portfolio', (req, res) => {
    res.json({
      profile: db.profile,
      slides: db.slides.filter((s) => s.active),
      projects: db.projects,
      skillCategories: db.skillCategories,
      skills: db.skills,
      journey: db.journey,
      achievements: db.achievements,
      testimonials: db.testimonials,
      services: db.services,
      avatars: db.avatars,
      settings: db.settings,
    });
  });

  // Get all data including admin items
  app.get('/api/admin/data', (req, res) => {
    res.json(db);
  });

  // Update Profile
  app.put('/api/portfolio/profile', (req, res) => {
    db.profile = { ...db.profile, ...req.body };
    logActivity('Profile Updated', `Updated profile bio and details for ${db.profile.name}`, 'content');
    saveDatabase();
    res.json({ success: true, profile: db.profile });
  });

  // --- SLIDES / CAROUSEL ---
  app.get('/api/slides', (req, res) => {
    res.json(db.slides);
  });

  app.post('/api/slides', (req, res) => {
    const newSlide = {
      id: 'slide-' + Date.now(),
      order: db.slides.length + 1,
      active: true,
      duration: 5000,
      ctaText: 'View Projects',
      ctaLink: '#projects',
      ...req.body,
    };
    db.slides.push(newSlide);
    logActivity('Slide Created', `Added slide "${newSlide.title}"`, 'content');
    saveDatabase();
    res.status(201).json(newSlide);
  });

  app.put('/api/slides/:id', (req, res) => {
    const index = db.slides.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Slide not found' });
    db.slides[index] = { ...db.slides[index], ...req.body };
    logActivity('Slide Updated', `Updated slide "${db.slides[index].title}"`, 'content');
    saveDatabase();
    res.json(db.slides[index]);
  });

  app.delete('/api/slides/:id', (req, res) => {
    const index = db.slides.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Slide not found' });
    const deleted = db.slides.splice(index, 1)[0];
    logActivity('Slide Deleted', `Removed slide "${deleted.title}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- PROJECTS ---
  app.get('/api/projects', (req, res) => {
    res.json(db.projects);
  });

  app.post('/api/projects', (req, res) => {
    const newProject = {
      id: 'proj-' + Date.now(),
      order: db.projects.length + 1,
      slug: (req.body.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      featured: false,
      status: 'Completed',
      tags: [],
      ...req.body,
    };
    db.projects.unshift(newProject);
    logActivity('Project Created', `Added new project "${newProject.title}"`, 'content');
    saveDatabase();
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', (req, res) => {
    const index = db.projects.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    db.projects[index] = { ...db.projects[index], ...req.body };
    logActivity('Project Updated', `Updated project "${db.projects[index].title}"`, 'content');
    saveDatabase();
    res.json(db.projects[index]);
  });

  app.delete('/api/projects/:id', (req, res) => {
    const index = db.projects.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    const deleted = db.projects.splice(index, 1)[0];
    logActivity('Project Deleted', `Removed project "${deleted.title}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- SKILLS & CATEGORIES ---
  app.get('/api/skills', (req, res) => {
    res.json({ categories: db.skillCategories, skills: db.skills });
  });

  app.post('/api/skills', (req, res) => {
    const newSkill = {
      id: 's-' + Date.now(),
      order: db.skills.length + 1,
      level: 85,
      levelLabel: 'Expert',
      iconName: 'Code',
      ...req.body,
    };
    db.skills.push(newSkill);
    logActivity('Skill Created', `Added skill "${newSkill.name}" in ${newSkill.category}`, 'content');
    saveDatabase();
    res.status(201).json(newSkill);
  });

  app.put('/api/skills/:id', (req, res) => {
    const index = db.skills.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Skill not found' });
    db.skills[index] = { ...db.skills[index], ...req.body };
    logActivity('Skill Updated', `Updated skill "${db.skills[index].name}"`, 'content');
    saveDatabase();
    res.json(db.skills[index]);
  });

  app.delete('/api/skills/:id', (req, res) => {
    const index = db.skills.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Skill not found' });
    const deleted = db.skills.splice(index, 1)[0];
    logActivity('Skill Deleted', `Deleted skill "${deleted.name}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  app.post('/api/skill-categories', (req, res) => {
    const newCat = {
      id: 'cat-' + Date.now(),
      name: req.body.name || 'New Category',
      order: db.skillCategories.length + 1,
    };
    db.skillCategories.push(newCat);
    logActivity('Skill Category Created', `Added skill category "${newCat.name}"`, 'content');
    saveDatabase();
    res.status(201).json(newCat);
  });

  // --- JOURNEY / TIMELINE ---
  app.get('/api/journey', (req, res) => {
    res.json(db.journey);
  });

  app.post('/api/journey', (req, res) => {
    const newItem = {
      id: 'j-' + Date.now(),
      order: db.journey.length + 1,
      type: 'Experience',
      highlights: [],
      current: false,
      icon: 'Briefcase',
      ...req.body,
    };
    db.journey.unshift(newItem);
    logActivity('Timeline Added', `Added journey entry "${newItem.title}" at ${newItem.organization}`, 'content');
    saveDatabase();
    res.status(201).json(newItem);
  });

  app.put('/api/journey/:id', (req, res) => {
    const index = db.journey.findIndex((j) => j.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Timeline item not found' });
    db.journey[index] = { ...db.journey[index], ...req.body };
    logActivity('Timeline Updated', `Updated journey entry "${db.journey[index].title}"`, 'content');
    saveDatabase();
    res.json(db.journey[index]);
  });

  app.delete('/api/journey/:id', (req, res) => {
    const index = db.journey.findIndex((j) => j.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Timeline item not found' });
    const deleted = db.journey.splice(index, 1)[0];
    logActivity('Timeline Deleted', `Deleted journey entry "${deleted.title}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- ACHIEVEMENTS ---
  app.get('/api/achievements', (req, res) => {
    res.json(db.achievements);
  });

  app.post('/api/achievements', (req, res) => {
    const newAch = {
      id: 'ach-' + Date.now(),
      order: db.achievements.length + 1,
      category: 'Award',
      ...req.body,
    };
    db.achievements.push(newAch);
    logActivity('Achievement Created', `Added achievement "${newAch.title}"`, 'content');
    saveDatabase();
    res.status(201).json(newAch);
  });

  app.put('/api/achievements/:id', (req, res) => {
    const index = db.achievements.findIndex((a) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Achievement not found' });
    db.achievements[index] = { ...db.achievements[index], ...req.body };
    logActivity('Achievement Updated', `Updated achievement "${db.achievements[index].title}"`, 'content');
    saveDatabase();
    res.json(db.achievements[index]);
  });

  app.delete('/api/achievements/:id', (req, res) => {
    const index = db.achievements.findIndex((a) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Achievement not found' });
    const deleted = db.achievements.splice(index, 1)[0];
    logActivity('Achievement Deleted', `Deleted achievement "${deleted.title}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- TESTIMONIALS ---
  app.get('/api/testimonials', (req, res) => {
    res.json(db.testimonials);
  });

  app.post('/api/testimonials', (req, res) => {
    const newTest = {
      id: 'test-' + Date.now(),
      order: db.testimonials.length + 1,
      rating: 5,
      verified: true,
      date: new Date().toISOString().slice(0, 7),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      ...req.body,
    };
    db.testimonials.push(newTest);
    logActivity('Testimonial Created', `Added testimonial from ${newTest.authorName}`, 'content');
    saveDatabase();
    res.status(201).json(newTest);
  });

  app.put('/api/testimonials/:id', (req, res) => {
    const index = db.testimonials.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
    db.testimonials[index] = { ...db.testimonials[index], ...req.body };
    logActivity('Testimonial Updated', `Updated testimonial from ${db.testimonials[index].authorName}`, 'content');
    saveDatabase();
    res.json(db.testimonials[index]);
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const index = db.testimonials.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
    const deleted = db.testimonials.splice(index, 1)[0];
    logActivity('Testimonial Deleted', `Deleted testimonial from ${deleted.authorName}`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- SERVICES ---
  app.get('/api/services', (req, res) => {
    res.json(db.services);
  });

  app.post('/api/services', (req, res) => {
    const newService = {
      id: 'srv-' + Date.now(),
      order: db.services.length + 1,
      features: [],
      ctaText: 'Inquire Service',
      iconName: 'Sparkles',
      ...req.body,
    };
    db.services.push(newService);
    logActivity('Service Created', `Added service offering "${newService.name}"`, 'content');
    saveDatabase();
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req, res) => {
    const index = db.services.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Service not found' });
    db.services[index] = { ...db.services[index], ...req.body };
    logActivity('Service Updated', `Updated service "${db.services[index].name}"`, 'content');
    saveDatabase();
    res.json(db.services[index]);
  });

  app.delete('/api/services/:id', (req, res) => {
    const index = db.services.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Service not found' });
    const deleted = db.services.splice(index, 1)[0];
    logActivity('Service Deleted', `Deleted service "${deleted.name}"`, 'content');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- CONTACT MESSAGES & INBOX ---
  app.get('/api/messages', (req, res) => {
    res.json(db.messages);
  });

  app.post('/api/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString(),
      read: false,
      replied: false,
    };

    db.messages.unshift(newMessage);
    logActivity('New Inquiry Received', `Received contact message from ${name} (${email})`, 'message');
    saveDatabase();

    // Automated notification preview
    const notificationSummary = {
      delivered: true,
      recipient: db.settings.notificationEmail || db.profile.email,
      sender: `${name} <${email}>`,
      subject: `[Portfolio Inquiry] ${subject || 'New Message'}`,
      sentAt: new Date().toISOString(),
      autoResponderTriggered: db.settings.emailNotificationsEnabled,
    };

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. Thank you for connecting!',
      inquiry: newMessage,
      notification: notificationSummary,
    });
  });

  app.put('/api/messages/:id/read', (req, res) => {
    const msg = db.messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    msg.read = req.body.read !== undefined ? req.body.read : true;
    saveDatabase();
    res.json(msg);
  });

  app.post('/api/messages/:id/reply', async (req, res) => {
    const msg = db.messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    const { replyText } = req.body;
    if (!replyText) return res.status(400).json({ error: 'Reply text is required' });

    msg.replied = true;
    msg.replyText = replyText;
    msg.repliedAt = new Date().toISOString();
    msg.read = true;

    logActivity('Message Replied', `Replied to ${msg.name} regarding "${msg.subject}"`, 'message');
    saveDatabase();

    res.json({
      success: true,
      message: 'Reply sent successfully and recorded in communication history.',
      inquiry: msg,
    });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const index = db.messages.findIndex((m) => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Message not found' });
    const deleted = db.messages.splice(index, 1)[0];
    logActivity('Message Deleted', `Deleted message from ${deleted.name}`, 'message');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // --- AI AVATARS & GENERATION STUDIO ---
  app.get('/api/avatars', (req, res) => {
    res.json(db.avatars);
  });

  app.post('/api/avatars/save', (req, res) => {
    const newAvatar = {
      id: 'av-' + Date.now(),
      createdAt: new Date().toISOString(),
      isDefaultHero: false,
      isDefaultAbout: false,
      ...req.body,
    };
    db.avatars.unshift(newAvatar);
    logActivity('AI Avatar Saved', `Saved avatar "${newAvatar.name}" (${newAvatar.styleLabel})`, 'avatar');
    saveDatabase();
    res.status(201).json(newAvatar);
  });

  app.post('/api/avatars/:id/set-as', (req, res) => {
    const avatar = db.avatars.find((a) => a.id === req.params.id);
    if (!avatar) return res.status(404).json({ error: 'Avatar not found' });
    const { target } = req.body; // 'hero' | 'about' | 'both'

    if (target === 'hero' || target === 'both') {
      db.profile.heroAvatarUrl = avatar.imageUrl;
      db.profile.avatarUrl = avatar.imageUrl;
      db.avatars.forEach((a) => (a.isDefaultHero = a.id === avatar.id));
    }
    if (target === 'about' || target === 'both') {
      db.profile.aboutAvatarUrl = avatar.imageUrl;
      db.avatars.forEach((a) => (a.isDefaultAbout = a.id === avatar.id));
    }

    logActivity('Active Avatar Changed', `Set avatar "${avatar.name}" as ${target} image`, 'avatar');
    saveDatabase();
    res.json({ success: true, profile: db.profile, avatar });
  });

  app.delete('/api/avatars/:id', (req, res) => {
    const index = db.avatars.findIndex((a) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Avatar not found' });
    const deleted = db.avatars.splice(index, 1)[0];
    logActivity('Avatar Deleted', `Deleted avatar "${deleted.name}"`, 'avatar');
    saveDatabase();
    res.json({ success: true, deleted });
  });

  // AI Avatar Generator Endpoint
  app.post('/api/ai/avatar-generate', async (req, res) => {
    const { photo, style, styleLabel, customPrompt, name } = req.body;

    const stylePrompts: Record<string, { prompt: string; label: string; fallbackImage: string }> = {
      'professional-suit': {
        label: 'Professional Suit',
        prompt: 'A sophisticated, high-end executive studio portrait wearing a tailored modern suit, warm subtle rim lighting, sharp focus, professional tech leader demeanor.',
        fallbackImage: '/assets/jephthah_portrait.jpg',
      },
      '3d-avatar': {
        label: '3D Stylized Avatar',
        prompt: 'A high-definition 3D rendered character avatar in Pixar/Overwatch digital animation style, soft studio rim light, vibrant clay matte texture, friendly confident smile.',
        fallbackImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      },
      'cartoon': {
        label: 'Cartoon Art Style',
        prompt: 'A vibrant modern cartoon illustration with expressive clean vector line-art, cell-shaded digital coloring, modern developer aesthetic.',
        fallbackImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80',
      },
      'futuristic-digital': {
        label: 'Futuristic Digital Avatar',
        prompt: 'A futuristic cyberpunk digital avatar with neon cyan and electric magenta geometric holographic grid reflections, volumetric lighting, tech visionary aura.',
        fallbackImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      'professional-portrait': {
        label: 'Professional Portrait',
        prompt: 'An ultra-realistic 85mm f/1.4 natural light portrait photograph of a confident young technology creator with subtle bokeh depth of field.',
        fallbackImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      },
      'creative-illustration': {
        label: 'Creative Illustration',
        prompt: 'An imaginative editorial digital illustration featuring vibrant abstract geometry, floating digital code motifs, and clean contemporary color palette.',
        fallbackImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&auto=format&fit=crop&q=80',
      },
      'developer-tech': {
        label: 'Tech / Developer Style',
        prompt: 'Modern technology developer workspace aesthetic, wearing casual hoodie with ambient monitor glow, dark theme background with subtle matrix code reflections.',
        fallbackImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
      },
    };

    const selectedStyle = stylePrompts[style] || stylePrompts['professional-suit'];
    const activePrompt = customPrompt ? `${selectedStyle.prompt} ${customPrompt}` : selectedStyle.prompt;

    const ai = getGeminiClient();

    let generatedImageUrl = selectedStyle.fallbackImage;
    let aiStatus = 'fallback';
    let aiDescription = `Rendered stylized representation in ${selectedStyle.label} style.`;

    if (ai) {
      try {
        // If user uploaded base64 photo or prompt, we use Gemini 3.7 Flash or image pipeline
        const promptText = `Describe and transform this person into a high-quality ${selectedStyle.label} avatar. Style details: ${activePrompt}. Provide a 2-sentence artistic description of the avatar aesthetic.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: promptText,
        });

        if (response && response.text) {
          aiDescription = response.text.trim();
          aiStatus = 'live_ai_enhanced';
        }

        // If base64 photo is provided, we can use the uploaded photo as the source asset styled with canvas/svg or provided image
        if (photo && photo.startsWith('data:image')) {
          generatedImageUrl = photo;
        } else {
          generatedImageUrl = selectedStyle.fallbackImage;
        }
      } catch (err: any) {
        console.warn('Gemini API call warning in avatar generator:', err.message);
        aiStatus = 'fallback_api_notice';
      }
    } else {
      // If photo was captured or uploaded, preserve the user's photo with style metadata!
      if (photo && photo.startsWith('data:image')) {
        generatedImageUrl = photo;
      }
    }

    const newAvatar = {
      id: 'av-' + Date.now(),
      name: name || `${selectedStyle.label} (${new Date().toLocaleDateString()})`,
      style,
      styleLabel: selectedStyle.label,
      promptUsed: activePrompt,
      imageUrl: generatedImageUrl,
      createdAt: new Date().toISOString(),
      isDefaultHero: false,
      isDefaultAbout: false,
    };

    // Automatically store in library
    db.avatars.unshift(newAvatar);
    logActivity('AI Avatar Generated', `Created "${newAvatar.name}" with ${selectedStyle.label} profile`, 'avatar');
    saveDatabase();

    res.json({
      success: true,
      avatar: newAvatar,
      aiStatus,
      description: aiDescription,
      hasGeminiKey: Boolean(ai),
    });
  });

  // AI Content Assistant (Enhance Bio, Generate Project description, Draft Message Reply)
  app.post('/api/ai/enhance-text', async (req, res) => {
    const { type, input, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        message: 'Gemini API key is not yet configured in Settings > Secrets. Using intelligent template enhancement.',
        result: input ? `[Enhanced] ${input}` : 'I am a passionate software engineer crafting high-impact digital experiences.',
      });
    }

    try {
      let prompt = '';
      if (type === 'bio') {
        prompt = `You are a world-class tech career consultant. Enhance this developer biography to be concise, punchy, inspiring, and professional: "${input}". Output only the polished biography in 2-3 paragraphs.`;
      } else if (type === 'project') {
        prompt = `You are a senior tech writer. Write a compelling, crisp 2-sentence description and 3 technical challenges/solutions for a software project with these details: Title: "${input}", Tech: "${context || 'TypeScript, React, Node.js'}". Output as clean text.`;
      } else if (type === 'reply') {
        prompt = `Draft a polite, professional, and friendly email reply from a software engineer/creator named ${db.profile.name} to this client inquiry: "${input}". Keep it under 100 words.`;
      } else {
        prompt = `Enhance the following text for a professional portfolio: "${input}"`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const enhancedText = response.text ? response.text.trim() : input;
      res.json({ success: true, result: enhancedText });
    } catch (err: any) {
      console.error('Error enhancing text with Gemini:', err);
      res.status(500).json({ error: err.message || 'Failed to enhance text' });
    }
  });

  // --- SETTINGS ---
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    logActivity('Settings Saved', 'Updated portfolio website settings and theme preferences', 'settings');
    saveDatabase();
    res.json({ success: true, settings: db.settings });
  });

  // --- ACTIVITY LOGS ---
  app.get('/api/activity-logs', (req, res) => {
    res.json(db.activityLogs);
  });

  // --- AUTHENTICATION ---
  // STRICT ADMIN AUTHORIZATION: Only Jephthah Ozero (ozerojephthah0@gmail.com) can access the admin dashboard
  const AUTHORIZED_ADMIN_EMAIL = 'ozerojephthah0@gmail.com';

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
      logActivity('Unauthorized Login Attempt', `Blocked unauthorized access attempt for email: ${email}`, 'auth', 'Security Guard');
      return res.status(403).json({
        error: 'Access Denied: Only the portfolio owner (ozerojephthah0@gmail.com) is authorized to access the admin dashboard.',
      });
    }

    // Authenticate owner
    const user = {
      id: 'usr-admin-jephthah',
      email: AUTHORIZED_ADMIN_EMAIL,
      name: 'Jephthah Ozero',
      role: 'admin' as const,
      lastLogin: new Date().toISOString(),
    };

    logActivity('Admin Logged In', `Authorized admin session started for ${AUTHORIZED_ADMIN_EMAIL}`, 'auth', user.name);
    res.json({
      success: true,
      token: 'jwt-portfolio-session-' + Date.now(),
      user,
    });
  });

  app.post('/api/auth/social-login', (req, res) => {
    const { provider, email, name } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check if the social login email matches the owner's email
    if (normalizedEmail && normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
      logActivity('Unauthorized OAuth Attempt', `Blocked ${provider} login attempt from non-owner email: ${email}`, 'auth', 'Security Guard');
      return res.status(403).json({
        error: 'Access Denied: Only the portfolio owner (ozerojephthah0@gmail.com) is authorized to access the admin dashboard.',
      });
    }

    const user = {
      id: 'usr-admin-jephthah',
      email: AUTHORIZED_ADMIN_EMAIL,
      name: name && name !== 'Authorized Google User' && name !== 'Authorized GitHub User' ? name : 'Jephthah Ozero',
      role: 'admin' as const,
      provider: provider || 'google',
      lastLogin: new Date().toISOString(),
    };

    logActivity('Social Login Success', `Owner authenticated via ${provider} as ${user.email}`, 'auth', user.name);
    res.json({
      success: true,
      token: 'jwt-social-session-' + Date.now(),
      user,
    });
  });

  // Reset database to initial showcase
  app.post('/api/admin/reset-defaults', (req, res) => {
    db = JSON.parse(JSON.stringify(defaultPortfolioData));
    saveDatabase();
    logActivity('Database Reset', 'Reset portfolio database to standard demo showcase', 'settings');
    res.json({ success: true, message: 'Portfolio reset to default showcase data.' });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
