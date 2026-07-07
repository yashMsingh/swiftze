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
import { getEntityRatings, getProfileBundle, updateUserProfile, uploadVehicleImage } from '../api/swiftzeApi';

function formatReviewDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB').replace(/\//g, '-');
}

function mapApiReviews(apiReviews) {
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

function mapApiReviewStats(stats, totalFromReviews) {
  const total = stats?.total_reviews ?? stats?.count ?? totalFromReviews;
  const average = stats?.average_rating ?? stats?.average ?? 0;
  const counts = stats?.rating_breakdown ?? stats?.breakdown ?? {};
  const maxCount = Math.max(...Object.values(counts).map(Number), 1);

  const STAR_COLORS = {
    5: '#22C55E',
    4: '#3B82F6',
    3: '#FBBF24',
    2: '#8B5CF6',
    1: '#EF4444',
  };

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = Number(counts[stars] ?? counts[String(stars)] ?? 0);
    return {
      stars,
      color: STAR_COLORS[stars],
      percentage: count ? Math.round((count / maxCount) * 100) : 0,
    };
  });

  return { totalReviews: total, averageRating: average, breakdown };
}

export default function ProfilePage({ filledImages = false }) {
  const [profile, setProfile] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviews, setReviews] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View: 'profile' or 'reviews'
  const [view, setView] = useState('profile');

  // Modal state: null | 'availability' | 'personalInfo' | 'vehicleInfo' | 'avatarEdit'
  const [activeModal, setActiveModal] = useState(null);

  // Availability toggle states
  const [available, setAvailable] = useState(true);
  const [booked, setBooked] = useState(false);

  const openModal  = (name) => setActiveModal(name);
  const closeModal = ()     => setActiveModal(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const nextProfile = await getProfileBundle();
        if (cancelled) return;
        setProfile(nextProfile);

        const driverId = nextProfile.apiIds?.driver;
        const ratingResult = await getEntityRatings('driver', driverId);
        if (cancelled) return;

        const mappedReviews = mapApiReviews(ratingResult.ratings);
        setReviews(mappedReviews);
        setReviewStats(mapApiReviewStats(ratingResult.stats, ratingResult.ratings.length));
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
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

    await updateUserProfile({
      email: data.email,
      countryCode: profile.countryCode,
      phone: data.phone,
      nationality: data.nationality,
      location: data.location,
    });
  };

  const handleVehicleImagesUpload = async (vehicleId, files) => {
    await Promise.all(files.map((file) => uploadVehicleImage(vehicleId, file)));
  };

  const handleReviewsClick = () => {
    setView('reviews');
    setActiveModal(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2F2F32] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#6B7280]">Loading profile…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[#EF4444] font-semibold">Failed to load profile</span>
          <span className="text-sm text-[#6B7280]">{error}</span>
          <button
            className="mt-2 px-4 py-2 bg-[#2F2F32] text-white text-sm rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {reviewStats && <ReviewsStatsRow stats={reviewStats} />}
          <div className="flex flex-col gap-4">
            {(reviews || []).map((review, i) => (
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
          onSave={() => {}}
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
