// src/components/reviews/ReviewsStatsRow.jsx
import StarRating from '../shared/StarRating';
import RatingBreakdownBar from './RatingBreakdownBar';

export default function ReviewsStatsRow({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Total Reviews */}
      <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
        <p className="text-sm text-[#6B7280] mb-2">Total Reviews</p>
        <p className="text-3xl font-bold text-[#111827]">{stats.totalReviews}</p>
      </div>

      {/* Average Rating */}
      <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
        <p className="text-sm text-[#6B7280] mb-2">Average Rating</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#111827]">{stats.averageRating}</span>
          <StarRating rating={stats.averageRating} size={16} />
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white rounded-2xl px-6 py-6 flex flex-col justify-center gap-2">
        {stats.breakdown.map((item) => (
          <RatingBreakdownBar
            key={item.stars}
            stars={item.stars}
            color={item.color}
            percentage={item.percentage}
          />
        ))}
      </div>
    </div>
  );
}
