// src/components/modals/AvailabilityDropdown.jsx
import { useEffect, useRef } from 'react';
import Toggle from '../shared/Toggle';

export default function AvailabilityDropdown({
  available,
  booked,
  onAvailableChange,
  onBookedChange,
  onClose,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    // Small delay to prevent immediate close from the trigger click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {/* Dark semi-transparent overlay */}
      <div
        className="fixed inset-0 z-20"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Dropdown popover — anchored top-right of the page (near the Availability pill) */}
      <div
        ref={dropdownRef}
        className="fixed z-30 bg-white rounded-2xl shadow-xl py-5 px-5 w-64"
        style={{
          top: '188px',      /* Below the sticky header + card top padding + pill position */
          right: '32px',     /* Match the card's right padding from viewport edge */
        }}
      >
        {/* Available row */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-[#111827]">Available</span>
          <Toggle checked={available} onChange={onAvailableChange} />
        </div>

        {/* Booked row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#111827]">Booked</span>
          <Toggle checked={booked} onChange={onBookedChange} />
        </div>
      </div>
    </>
  );
}
