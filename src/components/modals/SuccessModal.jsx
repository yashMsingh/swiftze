// src/components/modals/SuccessModal.jsx
import { Check } from 'lucide-react';

export default function SuccessModal({ message, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-white rounded-[24px] shadow-xl w-full max-w-[500px] p-10 flex flex-col items-center">
        
        {/* Scalloped badge/seal icon */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-red absolute inset-0 fill-current">
            <path d="M50 0L58.8 9.5L71.5 5.5L76.5 17.5L89.5 18L90 31L100 36.5L95 48.5L100 60.5L90 66L89.5 79L76.5 79.5L71.5 91.5L58.8 87.5L50 97L41.2 87.5L28.5 91.5L23.5 79.5L10.5 79L10 66L0 60.5L5 48.5L0 36.5L10 31L10.5 18L23.5 17.5L28.5 5.5L41.2 9.5L50 0Z" />
          </svg>
          <Check size={40} className="text-white relative z-10" strokeWidth={3} />
        </div>

        <h2 className="text-xl font-bold text-text-primary text-center mb-8">{message}</h2>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
        >
          Back
        </button>
      </div>
    </>
  );
}
