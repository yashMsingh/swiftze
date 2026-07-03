// src/components/modals/DeactivateConfirmModal.jsx
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function DeactivateConfirmModal({ onContinue, onBack }) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(reason);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onBack} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-white rounded-[24px] shadow-xl w-full max-w-[500px] p-8">
        
        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-warning-amber">
            <AlertCircle size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-text-primary">Your about to deactivate your account.</p>
          <p className="text-sm text-text-primary">Your details are safe and wont be affected.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary">Reason for deactivating</label>
            <textarea
              rows={4}
              placeholder="Bla bla bla bla"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-bg-white border border-border-default focus:border-brand-red rounded-lg px-4 py-3 outline-none text-sm text-text-primary resize-none transition-colors"
            />
          </div>

          <div className="flex flex-col items-center gap-4 mt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              Deactivate
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold text-brand-red hover:underline focus:outline-none"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
