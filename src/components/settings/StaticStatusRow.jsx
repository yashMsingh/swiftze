// src/components/settings/StaticStatusRow.jsx
export default function StaticStatusRow({ label, statusText = "" }) {
  return (
    <div className="bg-[#F7F7F8] rounded-[8px] min-h-[89px] px-[30px] py-[18px] flex items-center justify-between border border-[#ECECEF]">
      <span className="text-[18px] font-medium text-[#3F3F42]">{label}</span>
      {statusText && <span className="text-[15px] text-[#16A34A]">{statusText}</span>}
    </div>
  );
}
