// src/components/shared/StarRating.jsx
import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 16, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className="relative inline-block">
            {/* Empty star (background) */}
            <Star size={size} className="text-gray-300" fill="currentColor" />
            {/* Filled or half-filled overlay */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star size={size} className="text-star-gold" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
