// src/components/shared/ImagePlaceholder.jsx
export default function ImagePlaceholder({ label, subLabel, className = '', image = null }) {
  return (
    <div
      className={`bg-bg-placeholder rounded-xl flex flex-col items-center justify-center text-center ${className}`}
    >
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-cover rounded-xl" />
      ) : (
        <>
          <p className="text-text-secondary text-sm font-medium">{label}</p>
          {subLabel && (
            <p className="text-text-secondary text-sm">{subLabel}</p>
          )}
        </>
      )}
    </div>
  );
}
