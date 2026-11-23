import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Lock, Mail, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState('subhasis.gupta@example.com');
  const [otp, setOtp] = useState('741258');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      showToast('Please enter your registered email or mobile', 'warning');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      showToast('Reset OTP sent to your contact', 'info');
    }, 500);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      showToast('Please enter the 6-digit OTP', 'warning');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 500);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
      showToast('Password updated successfully!', 'success');
    }, 600);
  };

  return (
    <div className="min-h-[580px] h-full flex flex-col justify-between p-6 bg-white">
      <div>
        <button
          onClick={() => {
            if (step > 1 && step < 4) setStep((prev) => (prev - 1) as any);
            else navigateTo('login');
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{step === 4 ? 'Login' : 'Back'}</span>
        </button>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 mb-4">
            <span
              className={`h-1.5 flex-1 rounded-full ${
                step >= 1 ? 'bg-[#087E8B]' : 'bg-slate-200'
              }`}
            ></span>
            <span
              className={`h-1.5 flex-1 rounded-full ${
                step >= 2 ? 'bg-[#087E8B]' : 'bg-slate-200'
              }`}
            ></span>
            <span
              className={`h-1.5 flex-1 rounded-full ${
                step >= 3 ? 'bg-[#087E8B]' : 'bg-slate-200'
              }`}
            ></span>
          </div>
        )}

        {/* STEP 1: Enter Identifier */}
        {step === 1 && (
          <div className="animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6 text-[#087E8B]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Enter your registered email address or mobile number to receive a recovery code.
            </p>

            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mobile or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter phone or email"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <div className="animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-[#087E8B]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight">
              Enter Recovery Code
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Enter the 6-digit code sent to <span className="font-bold text-slate-800">{identifier}</span>
            </p>

            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-2.5 text-center tracking-widest font-mono text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Create New Password */}
        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight">
              Create New Password
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Choose a strong password with at least 6 characters.
            </p>

            <form onSubmit={handleStep3} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-extrabold text-[#172B4D] mb-1">
              Password Updated!
            </h2>
            <p className="text-xs text-slate-500 max-w-[260px] mx-auto mb-6">
              Your Doctor G account password has been updated securely. You can now sign in with your new credentials.
            </p>

            <button
              onClick={() => navigateTo('login')}
              className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="text-center pt-4 border-t border-slate-100">
          <button
            onClick={() => navigateTo('login')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Remember password? Sign In
          </button>
        </div>
      )}
    </div>
  );
};
