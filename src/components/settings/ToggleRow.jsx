// src/components/settings/ToggleRow.jsx
// Each row is a white rounded card with a thin border — matches reference exactly
import Toggle from '../shared/Toggle';

export default function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="bg-[#F7F7F8] rounded-[8px] min-h-[89px] px-[30px] py-[18px] flex items-center justify-between border border-[#ECECEF]">
      <div className="flex flex-col pr-4">
        <span className="text-[18px] font-medium text-[#3F3F42] leading-snug">{label}</span>
        {description && (
          <span className="text-[18px] text-[#9A9A9F] mt-1 leading-snug">{description}</span>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
