import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { api } from '../../services/api';
import {
  Mail,
  Send,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  MessageCircle,
  Github,
  Linkedin,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const { data, addToast } = usePortfolio();
  const { profile, settings } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    notification?: any;
  } | null>(null);

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
    setCaptchaAnswer('');
    setCaptchaError(false);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('Ozerojephthah0@gmail.com');
    setIsCopied(true);
    addToast('Email (Ozerojephthah0@gmail.com) copied!', 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('09019016049');
    setIsPhoneCopied(true);
    addToast('Phone number (09019016049) copied!', 'info');
    setTimeout(() => setIsPhoneCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    if (settings.captchaProtectionEnabled) {
      const expected = captchaNum1 + captchaNum2;
      if (parseInt(captchaAnswer.trim(), 10) !== expected) {
        setCaptchaError(true);
        addToast('Security verification math challenge failed.', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setSubmissionResult(res);
        setFormData({ name: '', email: '', subject: '', message: '' });
        refreshCaptcha();

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
        });

        addToast('Your message has been sent to Jephthah Ozero!', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Let's work together.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Have a project idea or want to connect? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Direct Info & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Information Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 space-y-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-3.5">
                {/* Name */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium block">Name</span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white block">
                      Jephthah Ozero
                    </span>
                  </div>
                </div>

                {/* Email with copy */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-neutral-400 font-medium block">Email</span>
                      <a
                        href="mailto:Ozerojephthah0@gmail.com"
                        className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Ozerojephthah0@gmail.com
                      </a>
                    </div>
                  </div>

                  <button
                    id="copy-email-btn"
                    onClick={handleCopyEmail}
                    className="p-2 rounded-xl text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors shrink-0"
                    title="Copy email to clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-neutral-400 font-medium block">Phone Number</span>
                      <a
                        href="tel:09019016049"
                        className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        09019016049 (+234 901 901 6049)
                      </a>
                    </div>
                  </div>

                  <button
                    id="copy-phone-btn"
                    onClick={handleCopyPhone}
                    className="p-2 rounded-xl text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors shrink-0"
                    title="Copy phone to clipboard"
                  >
                    {isPhoneCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium block">Location</span>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white block">
                      Lagos, Nigeria, CeleNiza, Off Badagry Express Way
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Deep Link Button */}
              <a
                id="contact-whatsapp-btn"
                href="https://wa.me/2349019016049"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp (+234 901 901 6049)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              {/* Direct Profile Links: GitHub & LinkedIn */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  Social & Developer Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    id="contact-github-link"
                    href="https://github.com/ozerojephthah0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-neutral-200/60 dark:border-neutral-700/60 transition-all"
                  >
                    <Github className="w-4 h-4 text-neutral-900 dark:text-white" />
                    <span>ozerojephthah0</span>
                  </a>

                  <a
                    id="contact-linkedin-link"
                    href="https://ozerojephthah.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-neutral-200/60 dark:border-neutral-700/60 transition-all"
                  >
                    <Linkedin className="w-4 h-4 text-indigo-500" />
                    <span>Ozerojephthah.com</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 space-y-6">
              
              {submissionResult?.success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                    {submissionResult.message}
                  </p>

                  <button
                    onClick={() => setSubmissionResult(null)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject-input"
                      type="text"
                      placeholder="Project discussion / New development inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message-input"
                      rows={5}
                      required
                      placeholder="Tell me about your project, idea, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Security Verification */}
                  {settings.captchaProtectionEnabled && (
                    <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Security Challenge: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{captchaNum1} + {captchaNum2} = ?</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          id="contact-captcha-input"
                          type="number"
                          required
                          placeholder="Sum"
                          value={captchaAnswer}
                          onChange={(e) => setCaptchaAnswer(e.target.value)}
                          className={`w-20 px-3 py-1.5 rounded-xl text-xs text-center bg-white dark:bg-neutral-900 border ${
                            captchaError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                          } text-neutral-900 dark:text-white focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                          title="New challenge"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    id="submit-contact-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
