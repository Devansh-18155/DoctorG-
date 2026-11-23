import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Stethoscope,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../translations';
import { LanguageCode } from '../../types';

export const RegisterScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLang, setPreferredLang] = useState<LanguageCode>('en');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'warning');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreedToTerms) {
      showToast('Please accept the Terms & Privacy Policy to continue', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('otp-verify', {
        phone,
        fullName,
        email,
        role,
        mode: 'register',
      });
    }, 500);
  };

  return (
    <div className="min-h-[580px] h-full flex flex-col justify-between p-6 bg-white overflow-y-auto">
      <div>
        <button
          onClick={() => navigateTo('welcome')}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          Join Doctor G to manage personal & family healthcare
        </p>

        {/* Role Toggle: Patient vs Doctor */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'patient'
                ? 'bg-white text-[#087E8B] shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>I am a Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'doctor'
                ? 'bg-white text-[#087E8B] shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>I am a Doctor</span>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'doctor' ? 'e.g. Dr. Rajesh Sen' : 'e.g. Subhasis Gupta'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Mobile Number *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full pl-14 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Preferred Language
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                I agree to the{' '}
                <span className="text-[#087E8B] font-semibold underline">Terms & Conditions</span>,{' '}
                <span className="text-[#087E8B] font-semibold underline">Privacy Policy</span>, and consent
                to healthcare service notifications.
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-3"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Proceed to OTP Verification</span>
            )}
          </button>
        </form>
      </div>

      <div className="pt-3 border-t border-slate-100 text-center mt-3">
        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#087E8B] hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
