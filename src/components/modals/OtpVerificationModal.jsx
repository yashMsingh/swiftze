// src/components/modals/OtpVerificationModal.jsx
import { useState, useRef, useEffect } from 'react';

export default function OtpVerificationModal({ 
  targetEmailOrPhone,
  onContinue, 
  onChangeTarget,
  onBack
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.every(digit => digit !== '')) {
      onContinue(otp.join(''));
    }
  };

  const isEnabled = otp.every(digit => digit !== '');

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onBack} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-white rounded-[24px] shadow-xl w-full max-w-[500px] p-8">
        <h2 className="text-[22px] font-bold text-text-primary text-center mb-1">Email Verification</h2>
        <p className="text-sm text-text-muted text-center leading-snug mb-8">
          We sent a six digit code to<br/>
          <span className="font-bold text-text-primary">{targetEmailOrPhone}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-text-primary text-center">Input OTP</label>
            <div className="flex items-center justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold text-text-primary bg-bg-white border border-border-default focus:border-brand-red rounded-lg outline-none transition-colors"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-brand-red text-center mt-2">
              Resend OTP in 01:20
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <button
              type="submit"
              disabled={!isEnabled}
              className={`w-full py-3.5 rounded-xl text-white text-sm font-bold transition-colors ${
                isEnabled ? 'bg-brand-red hover:bg-[#DC2626]' : 'bg-brand-red-light'
              }`}
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onChangeTarget}
              className="text-sm font-semibold text-brand-red hover:underline focus:outline-none self-end"
            >
              Change Email
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
