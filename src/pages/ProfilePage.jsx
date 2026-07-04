// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard';
import ContactInfoCard from '../components/profile/ContactInfoCard';
import VehicleInfoCard from '../components/profile/VehicleInfoCard';
import AvailabilityDropdown from '../components/modals/AvailabilityDropdown';
import PersonalInfoModal from '../components/modals/PersonalInfoModal';
import VehicleInfoModal from '../components/modals/VehicleInfoModal';
import AvatarEditOverlay from '../components/modals/AvatarEditOverlay';
import ReviewsStatsRow from '../components/reviews/ReviewsStatsRow';
import ReviewCard from '../components/reviews/ReviewCard';
import { profile as mockProfile, reviewStats as mockReviewStats, reviews as mockReviews } from '../data/mockProfile';
import { getEntityRatings, getProfileBundle, updateUserProfile, uploadVehicleImage } from '../api/swiftzeApi';

function formatReviewDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB').replace(/\//g, '-');
}

function mapApiReviews(apiReviews) {
  if (!Array.isArray(apiReviews) || apiReviews.length === 0) return mockReviews;

  return apiReviews.map((review) => ({
    reviewer: review.user_name || 'Swiftze User',
    initials: (review.user_name || 'SU')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'SU',
    rating: review.rating || 0,
    date: formatReviewDate(review.created_at),
    text: review.comment || 'No comment added.',
  }));
}

function mapApiReviewStats(stats, apiReviews) {
  if (!stats && (!Array.isArray(apiReviews) || apiReviews.length === 0)) return mockReviewStats;

  const totalReviews = stats?.total_reviews || stats?.count || apiReviews.length;
  const averageRating = stats?.average_rating || stats?.average || mockReviewStats.averageRating;
  const counts = stats?.breakdown || stats?.rating_breakdown || {};
  const maxCount = Math.max(...Object.values(counts).map(Number), totalReviews, 1);

  return {
    totalReviews,
    averageRating,
    breakdown: mockReviewStats.breakdown.map((item) => {
      const count = Number(counts[item.stars] || counts[`${item.stars}`] || 0);
      return {
        ...item,
        percentage: count ? Math.round((count / maxCount) * 100) : item.percentage,
      };
    }),
  };
}

export default function ProfilePage({ filledImages = false }) {
  const [profile, setProfile] = useState(mockProfile);
  const [reviewStats, setReviewStats] = useState(mockReviewStats);
  const [reviews, setReviews] = useState(mockReviews);

  // View: 'profile' or 'reviews'
  const [view, setView] = useState('profile');

  // Modal state: null | 'availability' | 'personalInfo' | 'vehicleInfo' | 'avatarEdit'
  const [activeModal, setActiveModal] = useState(null);

  // Availability toggle states
  const [available, setAvailable] = useState(true);
  const [booked, setBooked]       = useState(false);

  const openModal  = (name) => setActiveModal(name);
  const closeModal = ()     => setActiveModal(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const nextProfile = await getProfileBundle(mockProfile);
        if (cancelled) return;

        setProfile(nextProfile);

        const driverId = nextProfile.apiIds?.driver || nextProfile.id;
        const ratingResult = await getEntityRatings('driver', driverId);
        if (cancelled) return;

        setReviews(mapApiReviews(ratingResult.ratings));
        setReviewStats(mapApiReviewStats(ratingResult.stats, ratingResult.ratings));
      } catch (error) {
        console.info('Using local profile fallback:', error.message);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePersonalInfoSave = async (data) => {
    const nextProfile = {
      ...profile,
      email: data.email,
      emailDisplay: data.email,
      phone: `${profile.countryCode} ${data.phone}`.trim(),
      phoneNumber: data.phone,
      nationality: data.nationality,
      country: data.location || profile.country,
    };

    setProfile(nextProfile);

    try {
      await updateUserProfile({
        email: data.email,
        countryCode: profile.countryCode,
        phone: data.phone,
        nationality: data.nationality,
        location: data.location,
      });
    } catch (error) {
      console.info('Profile update kept locally:', error.message);
    }
  };

  const handleVehicleImagesUpload = async (vehicleId, files) => {
    try {
      await Promise.all(files.map((file) => uploadVehicleImage(vehicleId, file)));
    } catch (error) {
      console.info('Vehicle image upload skipped:', error.message);
    }
  };

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
          onSave={handlePersonalInfoSave}
        />
      )}

      {activeModal === 'vehicleInfo' && (
        <VehicleInfoModal
          vehicleId={profile.apiIds?.vehicle}
          onClose={closeModal}
          onSave={() => console.log('Vehicle info saved')}
          onUploadVehicleImages={handleVehicleImagesUpload}
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
