// src/components/modals/NewValueModal.jsx
import { useState } from 'react';

export default function NewValueModal({ 
  title, 
  subtitle,
  initialValue = '',
  placeholder = '',
  inputType = 'text',
  onContinue, 
  onBack
}) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onContinue(value);
    }
  };

  const isEnabled = value.trim().length > 0;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onBack} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-white rounded-[24px] shadow-xl w-full max-w-[500px] p-8">
        <h2 className="text-[22px] font-bold text-text-primary text-center mb-1">{title}</h2>
        <p className="text-sm text-text-muted text-center mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center bg-bg-white border border-border-default focus-within:border-brand-red rounded-lg px-4 py-3 transition-colors">
            <input
              type={inputType}
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary"
            />
          </div>

          <div className="flex flex-col items-center gap-4 mt-2">
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
              onClick={onBack}
              className="text-sm font-semibold text-brand-red hover:underline focus:outline-none"
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
