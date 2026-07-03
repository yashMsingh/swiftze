// src/components/modals/PersonalInfoModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PersonalInfoModal({ profile, onClose, onSave }) {
  const [email, setEmail]           = useState(profile.emailDisplay);
  const [phone, setPhone]           = useState(profile.phoneNumber);
  const [nationality, setNationality] = useState(profile.nationality);
  const [location, setLocation]     = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSave && onSave({ email, phone, nationality, location });
    onClose();
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-5"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative bg-white rounded-[22px] w-full max-w-[600px] max-h-[calc(100vh-40px)] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-[26px] right-[28px] w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-[26px] font-bold text-[#111827] leading-tight px-[34px] pt-[30px] pr-20">Personal Information</h2>

          <form onSubmit={handleSubmit} className="px-[34px] pt-[20px] pb-[34px] space-y-[16px]">
            {/* Email */}
            <div>
              <label className="block text-[17px] font-normal text-[#6B7280] mb-[8px]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[60px] px-[16px] rounded-[9px] border border-[#DDE1E7] text-[17px] text-[#111827] bg-white focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            {/* Call line */}
            <div>
              <label className="block text-[17px] font-normal text-[#6B7280] mb-[8px]">Call line</label>
              <div className="flex h-[60px] rounded-[9px] border border-[#DDE1E7] overflow-hidden bg-white">
                <div className="flex items-center px-[16px] border-r border-[#DDE1E7] bg-white flex-shrink-0">
                  <span className="text-[17px] text-[#111827] font-medium">{profile.countryCode}</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="min-w-0 flex-1 px-[16px] text-[17px] text-[#111827] focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-[17px] font-normal text-[#6B7280] mb-[8px]">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full h-[60px] px-[16px] rounded-[9px] border border-[#DDE1E7] text-[17px] text-[#111827] bg-white focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[17px] font-normal text-[#6B7280] mb-[8px]">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="UAE"
                className="w-full h-[60px] px-[16px] rounded-[9px] border border-[#DDE1E7] text-[17px] text-[#111827] placeholder-[#9CA3AF] bg-white focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="w-full h-[60px] rounded-[14px] text-white font-semibold text-[16px] transition-all duration-150 mt-[6px]"
              style={{ background: location ? '#EF4444' : '#F87171' }}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
