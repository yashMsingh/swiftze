// src/components/reviews/ReviewCard.jsx
import { Heart } from 'lucide-react';
import StarRating from '../shared/StarRating';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-xl px-6 py-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">{review.initials}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: name + stars + date */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="text-sm font-bold text-[#111827]">{review.reviewer}</span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <StarRating rating={review.rating} size={14} />
              <span className="text-xs text-[#9CA3AF]">{review.date}</span>
            </div>
          </div>

          {/* Review text */}
          <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{review.text}</p>

          {/* Heart icon */}
          <button className="text-[#D1D5DB] hover:text-red-400 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
