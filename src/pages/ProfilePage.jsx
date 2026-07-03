// src/pages/ProfilePage.jsx
import { useState } from 'react';
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard';
import ContactInfoCard from '../components/profile/ContactInfoCard';
import VehicleInfoCard from '../components/profile/VehicleInfoCard';
import AvailabilityDropdown from '../components/modals/AvailabilityDropdown';
import PersonalInfoModal from '../components/modals/PersonalInfoModal';
import VehicleInfoModal from '../components/modals/VehicleInfoModal';
import AvatarEditOverlay from '../components/modals/AvatarEditOverlay';
import ReviewsStatsRow from '../components/reviews/ReviewsStatsRow';
import ReviewCard from '../components/reviews/ReviewCard';
import { profile, reviewStats, reviews } from '../data/mockProfile';

export default function ProfilePage({ filledImages = false }) {
  // View: 'profile' or 'reviews'
  const [view, setView] = useState('profile');

  // Modal state: null | 'availability' | 'personalInfo' | 'vehicleInfo' | 'avatarEdit'
  const [activeModal, setActiveModal] = useState(null);

  // Availability toggle states
  const [available, setAvailable] = useState(true);
  const [booked, setBooked]       = useState(false);

  const openModal  = (name) => setActiveModal(name);
  const closeModal = ()     => setActiveModal(null);

  const handleReviewsClick = () => {
    setView('reviews');
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col">
      {/* Main content view */}
      {view === 'profile' ? (
        <div className="flex flex-col gap-6">
          {/* Card A — Profile Summary */}
          <ProfileSummaryCard
            profile={profile}
            onAvailabilityClick={() => openModal('availability')}
            onAvatarClick={() => openModal('avatarEdit')}
            onReviewsClick={handleReviewsClick}
          />

          {/* Card B — Contact Info */}
          <ContactInfoCard
            profile={profile}
            onEditClick={() => openModal('personalInfo')}
          />

          {/* Card C — Vehicle Info */}
          <VehicleInfoCard
            profile={profile}
            filled={filledImages}
            onEditClick={() => openModal('vehicleInfo')}
          />
        </div>
      ) : (
        /* Reviews view */
        <div>
          <ReviewsStatsRow stats={reviewStats} />
          <div className="flex flex-col gap-4">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* === Modals / Overlays === */}
      {activeModal === 'availability' && (
        <AvailabilityDropdown
          available={available}
          booked={booked}
          onAvailableChange={setAvailable}
          onBookedChange={setBooked}
          onClose={closeModal}
        />
      )}

      {activeModal === 'personalInfo' && (
        <PersonalInfoModal
          profile={profile}
          onClose={closeModal}
          onSave={(data) => console.log('Saved personal info:', data)}
        />
      )}

      {activeModal === 'vehicleInfo' && (
        <VehicleInfoModal
          onClose={closeModal}
          onSave={() => console.log('Vehicle info saved')}
        />
      )}

      {activeModal === 'avatarEdit' && (
        <AvatarEditOverlay
          initials={profile.initials}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
