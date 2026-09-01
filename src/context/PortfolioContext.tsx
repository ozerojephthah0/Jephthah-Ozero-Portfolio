import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project, AdminUser } from '../types';
import { defaultPortfolioData } from '../data/defaultData';
import { api } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdmin: boolean;
  currentUser: AdminUser | null;
  login: (email: string, password?: string) => Promise<boolean>;
  socialLogin: (provider: string) => Promise<boolean>;
  logout: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  hasGeminiKey: boolean;
  refreshData: () => Promise<void>;
  scrollToSection: (sectionId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>('dark');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme application logic
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (targetTheme: 'dark' | 'light' | 'system') => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else if (targetTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Initial load
  const refreshData = async () => {
    try {
      const serverData = await api.getAdminData();
      if (serverData && serverData.profile) {
        setData(serverData);
      }
    } catch (e) {
      console.warn('Using local fallback portfolio data:', e);
    }
    try {
      const health = await api.checkHealth();
      setHasGeminiKey(health.hasGeminiKey);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('portfolio_theme') as 'dark' | 'light' | 'system') || 'dark';
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    const savedAuth = localStorage.getItem('portfolio_auth_user');
    if (savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        setCurrentUser(user);
        setIsAdmin(true);
      } catch (e) {
        localStorage.removeItem('portfolio_auth_user');
      }
    }

    refreshData();

    // IntersectionObserver for active section
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0.1, 0.3, 0.5],
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));

    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      sections.forEach((s) => observer.unobserve(s));
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAdmin(true);
        localStorage.setItem('portfolio_auth_user', JSON.stringify(res.user));
        addToast(`Welcome back, ${res.user.name}! Admin session verified.`, 'success');
        setIsAuthModalOpen(false);
        setIsAdminDashboardOpen(true);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const socialLogin = async (provider: string): Promise<boolean> => {
    try {
      const res = await api.socialLogin(provider, 'ozerojephthah0@gmail.com', 'Jephthah Ozero');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAdmin(true);
        localStorage.setItem('portfolio_auth_user', JSON.stringify(res.user));
        addToast(`Welcome back, Jephthah! Authenticated via ${provider}.`, 'success');
        setIsAuthModalOpen(false);
        setIsAdminDashboardOpen(true);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message || 'Social sign-in failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
    localStorage.removeItem('portfolio_auth_user');
    addToast('Logged out of Admin session.', 'info');
  };

  const scrollToSection = (sectionId: string) => {
    const cleanId = sectionId.replace('#', '');
    const element = document.getElementById(cleanId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(cleanId);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        setData,
        theme,
        setTheme,
        activeSection,
        setActiveSection,
        isAdmin,
        currentUser,
        login,
        socialLogin,
        logout,
        toasts,
        addToast,
        removeToast,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        selectedProject,
        setSelectedProject,
        hasGeminiKey,
        refreshData,
        scrollToSection,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
