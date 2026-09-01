export type AvailabilityStatus = 'Available for Projects' | 'Open to Roles' | 'Consulting Only' | 'Busy';

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'youtube' | 'instagram' | 'dribbble' | 'discord' | 'email';
  label: string;
  url: string;
  enabled: boolean;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  shortBio: string;
  mission: string;
  email: string;
  phone: string;
  location: string;
  availability: AvailabilityStatus;
  avatarUrl: string;
  heroAvatarUrl: string;
  aboutAvatarUrl: string;
  resumeUrl: string;
  resumeFileName: string;
  yearsExperience: number;
  completedProjectsCount: number;
  clientSatisfactionRate: number;
  socialLinks: SocialLink[];
  interests: string[];
  goals: string[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  order: number;
  active: boolean;
  duration: number; // in milliseconds, e.g. 5000
}

export type ProjectCategory = 'All' | 'Web Apps' | 'Mobile Apps' | 'AI Projects' | 'Games' | 'Design' | 'Other';

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  category: 'Web Apps' | 'Mobile Apps' | 'AI Projects' | 'Games' | 'Design' | 'Other';
  tags: string[];
  status: 'Completed' | 'In Progress' | 'Featured' | 'Concept';
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  completionDate: string;
  challenges?: string;
  solutions?: string;
  gallery?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  iconName: string;
  category: string;
  level: number; // 1 to 100
  levelLabel: 'Expert' | 'Advanced' | 'Proficient' | 'Intermediate';
  description: string;
  order: number;
}

export interface TimelineItem {
  id: string;
  type: 'Experience' | 'Education' | 'Certification' | 'Milestone' | 'Project';
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  icon: string;
  credentialUrl?: string;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'Award' | 'Certificate' | 'Competition' | 'Milestone' | 'Recognition';
  description: string;
  imageUrl?: string;
  certificateUrl?: string;
  badgeName?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  companyOrOrg: string;
  avatarUrl: string;
  quote: string;
  rating: number; // 1-5
  relationship: 'Client' | 'Mentor' | 'Colleague' | 'Collaborator';
  verified: boolean;
  date: string;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  startingPrice?: string;
  ctaText: string;
  popular?: boolean;
  order: number;
}

export type AvatarStyle =
  | 'professional-suit'
  | '3d-avatar'
  | 'cartoon'
  | 'futuristic-digital'
  | 'professional-portrait'
  | 'creative-illustration'
  | 'developer-tech';

export interface AIAvatar {
  id: string;
  name: string;
  style: AvatarStyle | string;
  styleLabel: string;
  promptUsed: string;
  imageUrl: string;
  createdAt: string;
  isDefaultHero?: boolean;
  isDefaultAbout?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
  replyText?: string;
  repliedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  category: 'content' | 'auth' | 'avatar' | 'settings' | 'message';
}

export interface PortfolioSettings {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  defaultTheme: 'dark' | 'light' | 'system';
  carouselAutoplay: boolean;
  carouselSpeed: number; // ms
  showTestimonials: boolean;
  showAchievements: boolean;
  showServices: boolean;
  showAiAvatarStudio: boolean;
  showJourney: boolean;
  enableCaptcha: boolean;
  emailNotificationsEnabled: boolean;
  notificationEmail: string;
  visibility: 'public' | 'maintenance';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  lastLogin?: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  slides: HeroSlide[];
  projects: Project[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  journey: TimelineItem[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  services: Service[];
  avatars: AIAvatar[];
  messages: ContactMessage[];
  settings: PortfolioSettings;
  activityLogs: ActivityLog[];
}
