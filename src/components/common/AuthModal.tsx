import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ArrowRight, UserPlus, LogIn, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authPromptMessage,
    loginAsPatient,
    navigateTo,
  } = useApp();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#087E8B]">
            <Lock className="w-6 h-6" />
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#172B4D] mb-1">
          Sign In to Continue
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {authPromptMessage ||
            'Access personal health records, confirm appointments, order medicines, and track live clinic queues.'}
        </p>

        <div className="space-y-2.5">
          {/* Quick Demo Sign In Button */}
          <button
            onClick={() => {
              loginAsPatient(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#087E8B] hover:bg-[#06626D] text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md shadow-teal-700/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In (Instant Demo Patient)</span>
          </button>

          {/* Go to Login Screen */}
          <button
            onClick={() => {
              closeAuthModal();
              navigateTo('login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold text-xs transition-all"
          >
            <span>Enter Mobile / Password</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Create New Account */}
          <button
            onClick={() => {
              closeAuthModal();
              navigateTo('register');
            }}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </button>

          {/* Continue Browsing */}
          <button
            onClick={closeAuthModal}
            className="w-full py-2 text-center text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
};
