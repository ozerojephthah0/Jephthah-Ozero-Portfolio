import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { LeftSidebarNav } from './components/navigation/LeftSidebarNav';
import { TopHeader } from './components/navigation/TopHeader';
import { MobileNavDrawer } from './components/navigation/MobileNavDrawer';
import { HeroSection } from './components/hero/HeroSection';
import { TrustSignalsSection } from './components/trust/TrustSignalsSection';
import { AboutSection } from './components/about/AboutSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { LiveProjectsSection } from './components/live/LiveProjectsSection';
import { GithubSection } from './components/github/GithubSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { JourneySection } from './components/journey/JourneySection';
import { AchievementsSection } from './components/achievements/AchievementsSection';
import { TestimonialsSection } from './components/testimonials/TestimonialsSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/footer/Footer';
import { ProjectModal } from './components/projects/ProjectModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { ToastContainer } from './components/common/ToastContainer';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

const PortfolioApp: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Floating Left Sidebar Dock for Large Screens */}
      <LeftSidebarNav />

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="lg:pl-20 transition-all duration-300">
        {/* 1. Hero Section & Carousel */}
        <HeroSection />

        {/* 2. Social Proof & Trust Signals */}
        <TrustSignalsSection />

        {/* 3. About Me & Professional Journey */}
        <AboutSection />

        {/* 4. Featured Projects / Work Showcase */}
        <ProjectsSection />

        {/* 5. Live Projects Area */}
        <LiveProjectsSection />

        {/* 6. GitHub Repositories Section */}
        <GithubSection />

        {/* 7. Skills & Technologies */}
        <SkillsSection />

        {/* 8. Career & Educational Journey */}
        <JourneySection />

        {/* 9. Achievements & Certifications */}
        <AchievementsSection />

        {/* 10. Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 11. Contact Section */}
        <ContactSection />

        {/* 12. Footer */}
        <Footer />
      </main>

      {/* Persistent Floating WhatsApp Quick Contact Button */}
      <FloatingWhatsAppButton />

      {/* Global Modals & Dialogs */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <GlobalSearchModal />
      <AuthModal />
      <AdminDashboardModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
