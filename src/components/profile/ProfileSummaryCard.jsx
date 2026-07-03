// src/components/profile/ProfileSummaryCard.jsx
import { Camera, CheckCircle2 } from 'lucide-react';
import StarRating from '../shared/StarRating';

export default function ProfileSummaryCard({ profile, onAvailabilityClick, onAvatarClick, onReviewsClick }) {
  return (
    <div className="bg-white rounded-[16px] px-8 pt-6 pb-8 relative">
      {/* Availability pill */}
      <div className="absolute top-5 right-5">
        <button
          onClick={onAvailabilityClick}
          className="px-4 py-2 rounded-full border border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Availability
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-2">
        <div className="relative w-20 h-20 mb-4">
          <button
            onClick={onAvatarClick}
            className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center focus:outline-none"
          >
            <span className="text-white text-2xl font-bold">{profile.initials}</span>
          </button>
          {/* Camera badge */}
          <button
            onClick={onAvatarClick}
            className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white"
          >
            <Camera size={13} className="text-white" />
          </button>
        </div>

        {/* Name + badges */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-[#111827]">{profile.name}</span>
          {/* Verified badge */}
          <span className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          {/* Online dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-online-dot flex-shrink-0" />
        </div>

        {/* ID */}
        <p className="text-sm text-[#9CA3AF] mb-3">ID: {profile.id}</p>

        {/* Star rating */}
        <button
          onClick={onReviewsClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <StarRating rating={profile.rating} size={18} />
          <span className="text-sm text-[#9CA3AF]">({profile.totalReviews} Reviews)</span>
        </button>
      </div>
    </div>
  );
}
