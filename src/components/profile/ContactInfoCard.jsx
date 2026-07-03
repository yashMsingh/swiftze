// src/components/profile/ContactInfoCard.jsx
import { Mail, Phone, Globe, MapPin, Pencil } from 'lucide-react';

export default function ContactInfoCard({ profile, onEditClick }) {
  return (
    <div className="bg-white rounded-[16px] px-8 py-6 relative">
      {/* Edit icon */}
      <button
        onClick={onEditClick}
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors"
      >
        <Pencil size={18} />
      </button>

      {/* Info rows */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Mail size={18} className="text-[#6B7280] flex-shrink-0" />
          <span className="text-sm text-[#111827]">{profile.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <Phone size={18} className="text-[#6B7280] flex-shrink-0" />
          <span className="text-sm text-[#111827]">{profile.phone}</span>
        </div>
        <div className="flex items-center gap-4">
          <Globe size={18} className="text-[#6B7280] flex-shrink-0" />
          <span className="text-sm text-[#111827]">{profile.country}</span>
        </div>
        <div className="flex items-center gap-4">
          <MapPin size={18} className="text-[#6B7280] flex-shrink-0" />
          <span className="text-sm text-[#111827]">{profile.city}</span>
        </div>
      </div>
    </div>
  );
}
