// src/components/modals/VehicleInfoModal.jsx
import { useEffect, useRef, useState } from 'react';
import { X, UploadCloud } from 'lucide-react';

function UploadZone({ onFilesSelected, uploading }) {
  const inputRef = useRef(null);

  return (
    <div className="w-full min-h-[104px] bg-[#F4F4F5] rounded-[13px] flex flex-col items-center justify-center gap-[10px] px-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          if (files.length) onFilesSelected(files);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 bg-white rounded-full px-[16px] py-[5px] text-[18px] font-medium text-[#111827] shadow-sm border border-[#E5E7EB] leading-tight disabled:opacity-60"
      >
        <UploadCloud size={18} className="text-[#6B7280]" />
        {uploading ? 'Uploading' : 'Upload'}
      </button>
      <p className="text-[17px] font-medium text-[#111827] leading-tight">Drop Your Files Here Or Browse</p>
      <p className="text-[15px] text-[#9CA3AF] leading-tight">Max file size is 20MB</p>
    </div>
  );
}

function ThumbnailRow({ count }) {
  return (
    <div className="grid gap-[14px]" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array(count).fill(null).map((_, i) => (
        <div key={i} className="h-[100px] bg-[#F4F4F5] rounded-[8px]" />
      ))}
    </div>
  );
}

export default function VehicleInfoModal({ vehicleId, onClose, onSave, onUploadVehicleImages }) {
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleFilesSelected = async (files) => {
    if (!onUploadVehicleImages) return;

    setUploading(true);
    try {
      await onUploadVehicleImages(vehicleId, files);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-5"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[22px] w-full max-w-[650px] max-h-[calc(100vh-40px)] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[24px] right-[28px] w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] transition-colors"
        >
          <X size={24} />
        </button>

        <div className="px-[34px] pt-[30px] pb-[34px]">
        <h2 className="text-[26px] font-bold text-[#111827] leading-tight mb-[18px] pr-20">Vehicle Information</h2>

        {/* Car upload zone */}
        <UploadZone onFilesSelected={handleFilesSelected} uploading={uploading} />

        {/* 4 car thumbnails */}
        <div className="mt-[14px] mb-[24px]">
          <ThumbnailRow count={4} />
        </div>

        {/* Driving License section */}
        <h3 className="text-[24px] font-bold text-[#111827] leading-tight mb-[14px]">Driving License</h3>

        {/* License upload zone */}
        <UploadZone onFilesSelected={handleFilesSelected} uploading={uploading} />

        {/* 2 license thumbnails */}
        <div className="mt-[14px] mb-[24px]">
          <ThumbnailRow count={2} />
        </div>

        {/* Save button */}
        <button
          onClick={() => { onSave && onSave(); onClose(); }}
          className="w-full h-[60px] rounded-[14px] bg-brand-red text-white font-semibold text-[16px] hover:bg-red-600 transition-colors"
        >
          Save
        </button>
        </div>
      </div>
    </div>
  );
}
