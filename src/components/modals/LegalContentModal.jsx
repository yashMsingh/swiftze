// src/components/modals/LegalContentModal.jsx
import { ChevronLeft } from 'lucide-react';
import { legalPlaceholderText } from '../../data/mockSettings';

export default function LegalContentModal({ title, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-white rounded-[24px] shadow-xl w-full max-w-[840px] max-h-[90vh] flex flex-col overflow-hidden p-8">
        
        {/* Top row */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-primary hover:bg-[#E5E7EB] transition-colors focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-[22px] font-bold text-text-primary">{title}</h2>
        </div>

        {/* Content panel */}
        <div className="flex-1 bg-bg-card rounded-2xl p-8 overflow-y-auto">
          <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-wrap">
            {legalPlaceholderText}
          </div>
        </div>
      </div>
    </>
  );
}
