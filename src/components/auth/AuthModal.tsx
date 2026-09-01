import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, X, Lock, Mail, Sparkles, ArrowRight, Github, Chrome, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, socialLogin, addToast } = usePortfolio();
  
  const [email, setEmail] = useState('ozerojephthah0@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetMode) {
      setResetEmailSent(true);
      addToast(`Password reset link dispatched to ${email}`, 'info');
      return;
    }

    setIsLoading(true);
    const ok = await login(email, password);
    setIsLoading(false);
  };

  const handleQuickDemoAdmin = async () => {
    setIsLoading(true);
    await login('ozerojephthah0@gmail.com', 'admin123');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isResetMode ? 'Reset Credentials' : 'Admin Portal Access'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {isResetMode
              ? 'Enter your registered email to receive a recovery token.'
              : 'Sign in to manage projects, hero slides, inbox, and AI avatars.'}
          </p>
        </div>

        {/* Quick Demo Login Preset Button */}
        {!isResetMode && (
          <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                Owner Authentication
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                Authorized: ozerojephthah0@gmail.com
              </span>
            </div>
            <button
              id="demo-admin-login-btn"
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              1-Click Sign In
            </button>
          </div>
        )}

        {/* Form */}
        {resetEmailSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Recovery Link Dispatched
            </h4>
            <p className="text-xs text-neutral-500">
              Please check your inbox at <strong className="text-neutral-800 dark:text-neutral-200">{email}</strong> to complete your password update.
            </p>
            <button
              onClick={() => {
                setResetEmailSent(false);
                setIsResetMode(false);
              }}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {!isResetMode && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isResetMode ? 'Send Recovery Email' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isResetMode && (
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mt-2"
              >
                Cancel and return to login
              </button>
            )}
          </form>
        )}

        {/* Social Authentication */}
        {!isResetMode && !resetEmailSent && (
          <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 block text-center uppercase tracking-wider">
              Or sign in with Single Sign-On
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => socialLogin('Google')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200/60 dark:border-neutral-700 transition-all"
              >
                <Chrome className="w-3.5 h-3.5 text-rose-500" />
                <span>Google Auth</span>
              </button>

              <button
                onClick={() => socialLogin('GitHub')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200/60 dark:border-neutral-700 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub OAuth</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
