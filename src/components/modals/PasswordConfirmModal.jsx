// src/components/modals/PasswordConfirmModal.jsx
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordConfirmModal({
  title,
  onContinue,
  onBack,
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    // Simulate real password check (using the demo password)
    if (password !== 'swiftze123') {
      setError(true);
      return;
    }
    setError(false);
    onContinue();
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const isEnabled = password.length > 0 && !error;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={onBack}
      />

      {/* Modal card — matches reference: left-leaning, ~420px wide */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-[20px] shadow-2xl w-full max-w-[420px] p-8">
        {/* Title left-aligned */}
        <h2 className="text-[20px] font-bold text-[#111827] mb-1">{title}</h2>
        <p className="text-[14px] text-[#9CA3AF] mb-6">Input password to continue</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Password input */}
          <div>
            <div className={`flex items-center bg-white border rounded-xl px-4 py-3.5 transition-colors ${
              error ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus-within:border-[#EF4444]'
            }`}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-[14px] text-[#111827]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#9CA3AF] hover:text-[#6B7280] focus:outline-none"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-[#DC2626]">
                <AlertCircle size={13} />
                <span className="text-[12px]">Incorrect password</span>
              </div>
            )}
          </div>

          {/* Continue button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl text-white text-[15px] font-semibold transition-colors ${
              isEnabled ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#F9A8A8]'
            }`}
          >
            Continue
          </button>

          {/* Go back link */}
          <button
            type="button"
            onClick={onBack}
            className="text-[13px] font-medium text-[#EF4444] text-left hover:underline focus:outline-none"
          >
            Go back
          </button>
        </form>
      </div>
    </>
  );
}
