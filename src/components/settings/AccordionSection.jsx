// src/components/settings/AccordionSection.jsx
import { ChevronUp } from 'lucide-react';

export default function AccordionSection({ title, expanded, onToggle, children }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-[20px] pt-[25px] pb-[18px] bg-white focus:outline-none"
      >
        <h2 className="text-[25px] font-bold text-[#2F2F32]">{title}</h2>
        <ChevronUp size={18} className="text-[#2F2F32]" strokeWidth={2.5} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-[20px] pb-[20px] flex flex-col gap-[10px] bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
