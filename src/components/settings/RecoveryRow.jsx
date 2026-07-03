// src/components/settings/RecoveryRow.jsx
export default function RecoveryRow({ label, value, onChangeClick }) {
  return (
    <button
      onClick={onChangeClick}
      className="w-full bg-[#F7F7F8] rounded-[8px] min-h-[89px] px-[30px] py-[18px] flex items-center justify-between border border-[#ECECEF] text-left focus:outline-none"
    >
      <span className="text-[18px] font-medium text-[#3F3F42]">{label}</span>
      {value && <span className="text-[14px] text-[#9CA3AF]">{value}</span>}
    </button>
  );
}
