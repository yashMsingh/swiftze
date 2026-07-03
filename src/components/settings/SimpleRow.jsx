// src/components/settings/SimpleRow.jsx
export default function SimpleRow({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#F7F7F8] rounded-[8px] min-h-[89px] px-[30px] py-[18px] flex items-center text-left hover:bg-[#F3F4F6] transition-colors focus:outline-none border border-[#ECECEF]"
    >
      <span className="text-[18px] font-medium text-[#3F3F42]">{label}</span>
    </button>
  );
}
