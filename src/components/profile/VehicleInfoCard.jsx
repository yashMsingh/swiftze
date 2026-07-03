// src/components/profile/VehicleInfoCard.jsx
import { Pencil } from 'lucide-react';
import ImagePlaceholder from '../shared/ImagePlaceholder';

// Royalty-free placeholder car and license image URLs (picsum/placehold)
const CAR_MAIN    = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80';
const CAR_PLATE   = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80';
const CAR_SIDE    = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=80';
const LICENSE_F   = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=80';
const LICENSE_B   = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80';

export default function VehicleInfoCard({ profile, filled = false, onEditClick }) {
  return (
    <div className="bg-white rounded-[16px] px-8 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#111827]">Vehicle Information</h2>
        <button
          onClick={onEditClick}
          className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <Pencil size={18} />
        </button>
      </div>

      {/* Image grid: 2 columns */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* LEFT column */}
        <div className="flex flex-col gap-3">
          {/* Large car image */}
          <ImagePlaceholder
            label="Car image"
            subLabel="Image place holder"
            className="h-[145px]"
            image={filled ? CAR_MAIN : null}
          />
          {/* 2 small car images */}
          <div className="grid grid-cols-2 gap-2">
            <ImagePlaceholder
              label="Car Image"
              subLabel="Image place holder"
              className="h-[70px] text-xs"
              image={filled ? CAR_PLATE : null}
            />
            <ImagePlaceholder
              label="Car Image"
              subLabel="Image place holder"
              className="h-[70px] text-xs"
              image={filled ? CAR_SIDE : null}
            />
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-3">
          <ImagePlaceholder
            label="Driving License"
            subLabel="Image place holder"
            className="h-[145px]"
            image={filled ? LICENSE_F : null}
          />
          <ImagePlaceholder
            label="Driving License"
            subLabel="Image place holder"
            className="h-[70px]"
            image={filled ? LICENSE_B : null}
          />
        </div>
      </div>

      {/* Vehicle details */}
      <div className="space-y-2">
        <p className="text-sm text-[#111827]">
          <span className="font-semibold">Brand:</span>{' '}
          <span className="font-normal">{profile.vehicle.brand}</span>
        </p>
        <p className="text-sm text-[#111827]">
          <span className="font-semibold">Model:</span>{' '}
          <span className="font-normal">{profile.vehicle.model}</span>
        </p>
        <p className="text-sm text-[#111827]">
          <span className="font-semibold">Plate Number:</span>{' '}
          <span className="font-normal">{profile.vehicle.plateNumber}</span>
        </p>
      </div>
    </div>
  );
}
