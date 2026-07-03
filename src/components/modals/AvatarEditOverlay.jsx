// src/components/modals/AvatarEditOverlay.jsx
export default function AvatarEditOverlay({ initials, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex flex-col items-center justify-center gap-4"
      onClick={onClose}
    >
      {/* Large avatar circle */}
      <div
        className="w-44 h-44 rounded-full bg-gray-300 flex items-center justify-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-5xl font-bold text-gray-800">{initials}</span>
      </div>

      {/* Edit profile link */}
      <button
        onClick={onClose}
        className="text-white text-base underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
      >
        Edit profile
      </button>
    </div>
  );
}
