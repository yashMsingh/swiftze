// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../api/swiftzeApi';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEnabled = email.trim().length > 0 && password.length > 0 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEnabled) return;

    try {
      setLoading(true);
      setError('');
      const result = await login(email.trim(), password);
      // Store token so subsequent API calls include it
      localStorage.setItem('swiftze_access_token', result.access_token);
      onLoginSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center px-4">
      <div className="w-full max-w-[460px]">

        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-[64px] h-[52px] flex items-center justify-center mb-5">
            <svg width="64" height="52" viewBox="0 0 52 42" fill="none">
              <path d="M3 16h30l4 18H0l3-18Z" fill="#FF1324"/>
              <path d="M34 21h9l6 8v5H37l-3-13Z" fill="#FF1324"/>
              <path d="M15 16c0-8 4-13 10-13s10 5 10 13" stroke="#2F2F32" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="35" r="4" fill="white"/>
              <circle cx="40" cy="35" r="4" fill="white"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#2F2F32] tracking-tight">Swiftze</h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1">Logistics Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-xl px-8 py-10">
          <h2 className="text-[22px] font-bold text-[#111827] mb-1">Welcome back</h2>
          <p className="text-[14px] text-[#9CA3AF] mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151]">Email address</label>
              <div className={`flex items-center bg-white border rounded-xl px-4 py-3.5 transition-colors ${
                error ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus-within:border-[#EF4444]'
              }`}>
                <svg className="w-4 h-4 text-[#9CA3AF] mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151]">Password</label>
              <div className={`flex items-center bg-white border rounded-xl px-4 py-3.5 transition-colors ${
                error ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus-within:border-[#EF4444]'
              }`}>
                <svg className="w-4 h-4 text-[#9CA3AF] mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-[#9CA3AF] hover:text-[#6B7280] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span className="text-[13px]">{error}</span>
              </div>
            )}

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-[13px] font-medium text-[#EF4444] hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={!isEnabled}
              className={`w-full py-4 rounded-xl text-white text-[15px] font-semibold transition-all duration-150 mt-1 ${
                isEnabled
                  ? 'bg-[#EF4444] hover:bg-[#DC2626] active:scale-[0.98]'
                  : 'bg-[#F9A8A8] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
            <p className="text-[12px] text-[#9CA3AF] text-center mb-2 font-medium uppercase tracking-wider">Demo credentials</p>
            <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 text-[13px] text-[#6B7280] flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Email</span>
                <span
                  className="font-medium text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors"
                  onClick={() => setEmail('catherineojong002@gmail.com')}
                >
                  catherineojong002@gmail.com
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Password</span>
                <span
                  className="font-medium text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors"
                  onClick={() => setPassword('swiftze123')}
                >
                  swiftze123
                </span>
              </div>
              <p className="text-[11px] text-[#D1D5DB] mt-1 text-center">Click values to auto-fill</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#C5C5CA] mt-6">
          © {new Date().getFullYear()} Swiftze Logistics. All rights reserved.
        </p>
      </div>
    </div>
  );
}
