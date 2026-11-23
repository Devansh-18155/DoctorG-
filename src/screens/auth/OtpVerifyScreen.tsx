import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ShieldCheck, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export const OtpVerifyScreen: React.FC = () => {
  const { navigateTo, loginAsPatient, loginAsDoctor, screenParams, showToast } = useApp();

  const phone = screenParams?.phone || '9830154321';
  const role = screenParams?.role || 'patient';
  const mode = screenParams?.mode || 'login';

  const [otp, setOtp] = useState(['5', '8', '2', '4', '1', '9']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    setErrorMsg('');
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    setErrorMsg('');
    showToast('New 6-digit OTP sent to your registered mobile', 'info');
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      showToast('OTP verified successfully!', 'success');

      setTimeout(() => {
        if (role === 'doctor') {
          loginAsDoctor();
        } else {
          loginAsPatient(false);
        }
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-[580px] h-full flex flex-col justify-between p-6 bg-white">
      <div>
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Change Mobile</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-[#087E8B]" />
        </div>

        <h2 className="text-xl font-extrabold text-[#172B4D] tracking-tight">
          Verify Your Mobile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          We sent a 6-digit verification code to{' '}
          <span className="font-bold text-slate-800">+91 {phone}</span>
        </p>

        {/* OTP Input Boxes */}
        <div className="my-6">
          <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-12 text-center text-lg font-bold rounded-xl border transition-all focus:outline-none ${
                  errorMsg
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : digit
                    ? 'border-[#087E8B] bg-teal-50/30 text-[#172B4D]'
                    : 'border-slate-200 bg-slate-50 text-slate-800'
                } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-center text-xs font-semibold text-rose-600 mt-2">
              {errorMsg}
            </p>
          )}

          {isSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold mt-3 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verification Successful! Redirecting...</span>
            </div>
          )}
        </div>

        {/* Resend & Countdown */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087E8B] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resend OTP</span>
            </button>
          ) : (
            <p className="text-xs text-slate-400">
              Resend OTP in{' '}
              <span className="font-bold text-slate-700">00:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          onClick={handleVerify}
          disabled={isVerifying || isSuccess}
          className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Demo verification code pre-filled for rapid evaluation
        </p>
      </div>
    </div>
  );
};
