// src/components/shared/Toggle.jsx
export default function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center h-[22px] w-[35px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute text-[7px] font-medium ${checked ? 'left-[3px] text-[#FFB3B8]' : 'right-[3px] text-[#C6C6CA]'}`}>
        {checked ? 'Yes' : 'No'}
      </span>
      <span
        className={`absolute w-4 h-4 rounded-full shadow transition-transform duration-200 ${
          checked ? 'bg-[#FF4050] translate-x-[17px]' : 'bg-[#222222] translate-x-0.5'
        }`}
      />
    </button>
  );
}
