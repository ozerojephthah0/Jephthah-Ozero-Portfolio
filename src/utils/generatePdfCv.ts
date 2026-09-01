import { jsPDF } from 'jspdf';
import { PortfolioData } from '../types';

export const generatePdfCv = (data: PortfolioData): jsPDF => {
  const { profile, skills, projects, journey, achievements } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 5;
      // Small header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(`${profile.name} — Curriculum Vitae (Page ${doc.getNumberOfPages()})`, margin, y);
      y += 8;
    }
  };

  // --- HEADER SECTION ---
  // Top Banner Accent Bar
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  // Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text((profile.name || 'JEPHTHAH OZERO').toUpperCase(), margin + 6, y + 10);

  // Subtitle / Profession
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(129, 140, 248); // Indigo-400
  doc.text((profile.title || 'Web Developer, App Creator & Game Developer').toUpperCase(), margin + 6, y + 16);

  // Contact Info Line inside banner
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240); // Slate-200
  const contactLine1 = `Email: ${profile.email || 'Ozerojephthah0@gmail.com'}   |   Phone: ${profile.phone || '+234 901 901 6049'}   |   Location: ${profile.location || 'Lagos, Nigeria'}`;
  const contactLine2 = `GitHub: github.com/ozerojephthah0   |   Portfolio: ozerojephthah.com   |   Status: ${profile.availability || 'Available for Projects'}`;
  
  doc.text(contactLine1, margin + 6, y + 23);
  doc.text(contactLine2, margin + 6, y + 28);

  y += 40;

  // --- HELPER SECTION DRAWERS ---
  const drawSectionHeading = (title: string) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(title.toUpperCase(), margin, y);

    // Accent line under heading
    doc.setDrawColor(99, 102, 241); // Indigo-500
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;
  };

  // --- 1. PROFESSIONAL SUMMARY ---
  drawSectionHeading('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate-700
  const summaryText = profile.bio ||
    "Passionate and results-driven Web Developer, App Creator, and Game Developer with proven experience crafting high-performance web applications, interactive audio synthesizers, gamified software, and e-commerce platforms. Built on strong engineering foundations from Devtonic Academy, with extensive hands-on expertise in Modern JavaScript (ES6+), Web Audio API, Firebase Realtime Database & Auth, Google AI Studio, and responsive UI architecture.";
  
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  checkPageBreak(splitSummary.length * 4.5);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 4.5 + 4;

  // --- 2. CORE TECHNICAL SKILLS ---
  drawSectionHeading('Technical Capabilities & Stack');
  
  const skillCategories = [
    {
      name: 'Frontend & UI Engineering:',
      items: 'Modern JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Responsive Mobile-First Design, Web Audio API, Canvas Animations',
    },
    {
      name: 'Backend & Cloud Services:',
      items: 'Firebase Authentication, Firebase Realtime Database, Cloud Firestore, RESTful APIs, Node.js & Express Architecture',
    },
    {
      name: 'Tools & AI Integrations:',
      items: 'Google AI Studio, Anti-gravity AI workflows, Git & GitHub, Vite, Postman, Chrome DevTools, Linux environment',
    },
    {
      name: 'Specialized Competencies:',
      items: 'Game Loop Engine Design, Interactive Synthesizers, Role-Based Access Control (RBAC), E-Commerce Cart Logic, Performance Optimization',
    },
  ];

  skillCategories.forEach((cat) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${cat.name}`, margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const catText = doc.splitTextToSize(cat.items, contentWidth - 45);
    doc.text(catText, margin + 45, y);
    y += Math.max(catText.length * 4.2, 5);
  });
  y += 3;

  // --- 3. KEY FEATURED PROJECTS & CODEBASES ---
  drawSectionHeading('Key Production Projects & Software');

  const topProjects = projects && projects.length > 0 ? projects.slice(0, 5) : [
    {
      title: 'CartNova Store',
      category: 'E-Commerce Platform',
      shortDescription: 'Modern e-commerce platform with multi-tier role management (Admin, Merchant, Customer), real-time Firebase shopping cart, and inventory tracking.',
      tags: ['JavaScript', 'Firebase Auth', 'Realtime DB', 'Responsive UI'],
      liveUrl: 'https://cartnovastore.com',
      githubUrl: 'https://github.com/ozerojephthah0/CartNova.git',
    },
    {
      title: 'Beatbox Pro',
      category: 'Web Audio Synthesizer',
      shortDescription: 'Interactive digital synthesizer and drum pattern sequencer built with the Web Audio API, real-time waveform controls, and cloud beat recording.',
      tags: ['Web Audio API', 'JavaScript', 'Audio Synthesis', 'Firebase'],
      liveUrl: 'https://beatboxpro.app',
      githubUrl: 'https://github.com/ozerojephthah0/Beatbox-Pro.git',
    },
    {
      title: 'Ozero Image Guessing Game (ImageIQ)',
      category: 'Interactive Game & AI Engine',
      shortDescription: 'Cognitive visual trivia engine with dynamic mask reveals, score evaluation algorithms, streak multipliers, and instant answer evaluations.',
      tags: ['Game Engine', 'JavaScript', 'CSS Grid', 'Firebase'],
      liveUrl: 'https://imageiq.game',
      githubUrl: 'https://github.com/ozerojephthah0/ImageIQ.git',
    },
    {
      title: 'Quiz Master',
      category: 'Educational Quiz Application',
      shortDescription: 'Interactive trivia and examination engine featuring customizable categories, live countdown timers, detailed explanations, and review reports.',
      tags: ['JavaScript', 'HTML5', 'CSS3', 'Local State'],
      liveUrl: 'https://quizmaster.app',
    },
    {
      title: 'Budget Expense Tracker (Ozero-Budget)',
      category: 'Financial Management Suite',
      shortDescription: 'Real-time financial manager tracking income, expenses, category analytics, balance calculation, and persistent transaction storage.',
      tags: ['JavaScript', 'LocalStorage', 'Analytics UI', 'Tailwind CSS'],
      liveUrl: 'https://ozerobudget.app',
    },
  ];

  topProjects.forEach((proj: any) => {
    checkPageBreak(22);
    
    // Project Title & Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(proj.title, margin + 2, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(99, 102, 241); // Indigo
    doc.text(`— ${proj.category || 'Web Application'}`, margin + doc.getTextWidth(proj.title) + 5, y);

    y += 4.2;

    // Project Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(proj.shortDescription || proj.description, contentWidth - 4);
    doc.text(descLines, margin + 4, y);
    y += descLines.length * 4.2;

    // Tech Tags & Links
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const techLine = `Tech Stack: ${(proj.tags || []).join(', ')}${proj.githubUrl ? `   |   Repo: ${proj.githubUrl}` : ''}`;
    doc.text(techLine, margin + 4, y);
    y += 6;
  });

  // --- 4. EDUCATION & ACADEMY TRAINING ---
  drawSectionHeading('Education & Specialized Training');

  const educationList = journey && journey.length > 0 ? journey : [
    {
      title: 'Full-Stack Web Development & Software Engineering Foundation',
      organization: 'Devtonic Academy',
      startDate: '2024',
      endDate: '2026',
      description: 'Intensive engineering program covering modern JavaScript (ES6+), responsive design systems, database management, Firebase architecture, and Google AI Studio toolchains.',
    },
  ];

  educationList.forEach((item: any) => {
    checkPageBreak(18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.title, margin + 2, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(99, 102, 241);
    doc.text(`${item.organization}   (${item.startDate} – ${item.endDate || 'Present'})`, margin + 2, y + 4.2);

    y += 8.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const eduDesc = doc.splitTextToSize(item.description, contentWidth - 4);
    doc.text(eduDesc, margin + 4, y);
    y += eduDesc.length * 4.2 + 4;
  });

  // --- 5. ACHIEVEMENTS & CERTIFICATIONS ---
  if (achievements && achievements.length > 0) {
    drawSectionHeading('Certifications & Key Milestones');
    achievements.forEach((ach: any) => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${ach.title}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Issued by ${ach.issuer} (${ach.date}) — ${ach.description}`, margin + 6, y + 4);
      y += 8;
    });
  }

  // --- FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);
    doc.text(`Jephthah Ozero — Official Curriculum Vitae | ozerojephthah.com | +234 901 901 6049`, margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth - 18, pageHeight - 7);
  }

  return doc;
};

export const downloadPdfCv = (data: PortfolioData) => {
  const doc = generatePdfCv(data);
  const cleanName = (data.profile.name || 'Jephthah_Ozero').replace(/\s+/g, '_');
  doc.save(`${cleanName}_CV.pdf`);
};
