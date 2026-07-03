// src/components/reviews/RatingBreakdownBar.jsx
export default function RatingBreakdownBar({ stars, color, percentage }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6B7280] w-3 text-right flex-shrink-0">{stars}</span>
      <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-[#6B7280] w-7 text-right flex-shrink-0">{percentage}%</span>
    </div>
  );
}
