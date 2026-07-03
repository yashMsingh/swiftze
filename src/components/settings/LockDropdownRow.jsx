// src/components/settings/LockDropdownRow.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { lockTimeOptions } from '../../data/mockSettings';

export default function LockDropdownRow({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#F7F7F8] rounded-[8px] min-h-[89px] px-[30px] py-[18px] flex items-center justify-between border border-[#ECECEF] relative">
      <span className="text-[18px] font-medium text-[#3F3F42]">{label}</span>

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[42px] min-w-[142px] px-3 rounded-[6px] bg-white border border-[#ECECEF] flex items-center justify-between gap-2 text-[18px] text-[#2F2F32] hover:text-[#111827] transition-colors focus:outline-none"
        >
          {value}
          <ChevronDown size={18} className="text-[#2F2F32]" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-[#E5E7EB] z-20 py-1 overflow-hidden">
            {lockTimeOptions.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors ${
                  value === option
                    ? 'font-bold text-[#111827]'
                    : 'text-[#6B7280] hover:bg-[#F4F4F5] hover:text-[#111827]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
