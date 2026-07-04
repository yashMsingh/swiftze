const API_BASE_URL = import.meta.env.VITE_SWIFTZE_API_BASE_URL || 'https://api.swiftze.com/api';

const TOKEN_KEYS = [
  'swiftze_access_token',
  'access_token',
  'token',
  'authToken',
];

function getAuthToken() {
  if (typeof window === 'undefined') return null;

  for (const key of TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value.replace(/^Bearer\s+/i, '');
  }

  return null;
}

function unwrapResponse(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }

  return response;
}

async function request(path, options = {}) {
  const token = getAuthToken();

  if (options.auth !== false && !token) {
    throw new Error('Swiftze auth token is missing');
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload?.message || payload?.detail || response.statusText;
    throw new Error(message);
  }

  return unwrapResponse(payload);
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

function splitPhone(phone = '') {
  const match = String(phone).match(/^(\+\d{1,4})\s*(.*)$/);
  return {
    countryCode: match?.[1] || '',
    phoneNumber: match?.[2] || phone,
  };
}

function normalizeVehicle(vehicle = {}, driverProfile = {}) {
  const details = driverProfile.vehicle_details || {};
  const make = firstValue(vehicle.make, details.make, details.brand);
  const model = firstValue(vehicle.model, details.model);
  const year = firstValue(vehicle.year, details.year);

  return {
    id: vehicle.id,
    brand: make || 'Not added',
    model: [model, year ? `(${year})` : ''].filter(Boolean).join(' ') || 'Not added',
    plateNumber: firstValue(vehicle.plate_number, details.plate_number, driverProfile.license_number, 'Not added'),
  };
}

export async function getProfileBundle(fallbackProfile) {
  const [me, userProfile, driverProfile, vehicles] = await Promise.allSettled([
    request('/auth/me'),
    request('/profile/getuserprofile'),
    request('/drivers/profile/me'),
    request('/vehicles/my?page=1&page_size=20&is_active=true'),
  ]);

  const meData = me.status === 'fulfilled' ? me.value : {};
  const profileData = userProfile.status === 'fulfilled' ? userProfile.value : {};
  const driverData = driverProfile.status === 'fulfilled' ? driverProfile.value : {};
  const vehicleList = vehicles.status === 'fulfilled'
    ? (Array.isArray(vehicles.value) ? vehicles.value : vehicles.value?.data || [])
    : [];
  const primaryVehicle = vehicleList.find((vehicle) => vehicle.is_primary) || vehicleList[0] || {};

  const fullName = firstValue(profileData.full_name, meData.full_name, meData.name, fallbackProfile.name);
  const email = firstValue(meData.email, profileData.email, fallbackProfile.email);
  const phone = firstValue(meData.phone, profileData.phone, fallbackProfile.phone);
  const { countryCode, phoneNumber } = splitPhone(phone);

  return {
    ...fallbackProfile,
    apiIds: {
      user: firstValue(meData.id, profileData.user_id),
      profile: profileData.id,
      driver: driverData.id,
      vehicle: primaryVehicle.id,
    },
    name: fullName,
    initials: initialsFromName(fullName),
    id: firstValue(meData.id, profileData.id, driverData.id, fallbackProfile.id),
    email,
    emailDisplay: email,
    phone,
    countryCode: countryCode || fallbackProfile.countryCode,
    phoneNumber: phoneNumber || fallbackProfile.phoneNumber,
    nationality: firstValue(profileData.nationality, profileData.country, fallbackProfile.nationality),
    country: firstValue(profileData.location, driverData.current_location?.country, fallbackProfile.country),
    city: firstValue(driverData.current_location?.city, profileData.city, fallbackProfile.city),
    rating: Number(firstValue(driverData.average_rating, driverData.rating, fallbackProfile.rating)),
    totalReviews: Number(firstValue(driverData.total_reviews, driverData.review_count, fallbackProfile.totalReviews)),
    vehicle: normalizeVehicle(primaryVehicle, driverData),
  };
}

export async function updateUserProfile(data) {
  return request('/profile/update', {
    method: 'PUT',
    body: JSON.stringify({
      full_name: data.name,
      location: data.location,
      preferences: {
        email: data.email,
        phone: `${data.countryCode || ''} ${data.phone || ''}`.trim(),
        nationality: data.nationality,
      },
    }),
  });
}

export async function getEmailPreferences() {
  return request('/orders-comprehensive/email-preferences');
}

export async function updateEmailPreferences(preferences) {
  return request('/orders-comprehensive/email-preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences),
  });
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/uploads/upload-profile-image', {
    method: 'POST',
    body: formData,
  });
}

export async function uploadVehicleImage(vehicleId, file) {
  if (!vehicleId) throw new Error('Vehicle id is missing');

  const formData = new FormData();
  formData.append('file', file);

  return request(`/uploads/vehicles/${vehicleId}/upload-image`, {
    method: 'POST',
    body: formData,
  });
}

export async function getEntityRatings(entityType, entityId) {
  if (!entityId) throw new Error('Entity id is missing');

  const [ratings, stats] = await Promise.allSettled([
    request(`/interactions/ratings/${entityType}/${entityId}?limit=20&offset=0`, { auth: false }),
    request(`/interactions/ratings/${entityType}/${entityId}/stats`, { auth: false }),
  ]);

  return {
    ratings: ratings.status === 'fulfilled' ? ratings.value : [],
    stats: stats.status === 'fulfilled' ? stats.value : null,
  };
}
