const API_BASE_URL = import.meta.env.VITE_SWIFTZE_API_BASE_URL || 'http://localhost:8000/api';
const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api/i.test(API_BASE_URL);

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

  if (options.auth !== false && !token && !isLocalApi) {
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

function firstDefined(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== '');
}

function initialsFromName(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U'
  );
}

function splitPhone(phone = '') {
  const match = String(phone).match(/^(\+\d{1,4})\s*(.*)$/);
  return {
    countryCode: match?.[1] || '',
    phoneNumber: match?.[2] || phone,
  };
}

function normalizeVehicle(vehicle = {}, driverVehicleDetails = {}) {
  const make = firstDefined(vehicle.make, driverVehicleDetails.make, driverVehicleDetails.brand);
  const model = firstDefined(vehicle.model, driverVehicleDetails.model);
  const year = firstDefined(vehicle.year, driverVehicleDetails.year);

  return {
    id: vehicle.id,
    brand: make || 'Not added',
    model: [model, year ? `(${year})` : ''].filter(Boolean).join(' ') || 'Not added',
    plateNumber: firstDefined(
      vehicle.plate_number,
      driverVehicleDetails.plate_number,
      'Not added'
    ),
  };
}

/**
 * Authenticates the user with email + password.
 * Stores the returned token in localStorage so all subsequent requests are authenticated.
 * Throws with the server's error message on bad credentials.
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.message || 'Invalid email or password');
  }

  return payload;
}

export function logout() {
  localStorage.removeItem('swiftze_access_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
}

/**
 * Fetches all profile data from the API.
 * Throws if any required endpoint fails.
 * Returns a clean profile object built entirely from API data.
 */
export async function getProfileBundle() {
  const [meRes, userProfileRes, driverProfileRes, vehiclesRes] = await Promise.all([
    request('/auth/me'),
    request('/profile/getuserprofile'),
    request('/drivers/profile/me'),
    request('/vehicles/my?page=1&page_size=20&is_active=true'),
  ]);

  const meData = meRes || {};
  const profileData = userProfileRes || {};
  const driverData = driverProfileRes || {};
  const vehicleList = Array.isArray(vehiclesRes)
    ? vehiclesRes
    : vehiclesRes?.data || [];
  const primaryVehicle =
    vehicleList.find((v) => v.is_primary) || vehicleList[0] || {};

  const fullName = firstDefined(profileData.full_name, meData.full_name, meData.name);
  const email = firstDefined(meData.email, profileData.email);
  const phone = firstDefined(meData.phone, profileData.phone);
  const { countryCode, phoneNumber } = splitPhone(phone);

  return {
    apiIds: {
      user: firstDefined(meData.id, profileData.user_id),
      profile: profileData.id,
      driver: driverData.id,
      vehicle: primaryVehicle.id,
    },
    name: fullName || '',
    initials: initialsFromName(fullName),
    id: firstDefined(meData.id, profileData.id, driverData.id),
    email: email || '',
    emailDisplay: email || '',
    phone: phone || '',
    countryCode: countryCode || '',
    phoneNumber: phoneNumber || '',
    nationality: firstDefined(profileData.nationality, profileData.country) || '',
    country: firstDefined(profileData.location, driverData.current_location?.country) || '',
    city: firstDefined(driverData.current_location?.city, profileData.city) || '',
    rating: Number(firstDefined(driverData.average_rating, driverData.rating) || 0),
    totalReviews: Number(firstDefined(driverData.total_reviews, driverData.review_count) || 0),
    vehicle: normalizeVehicle(primaryVehicle, driverData.vehicle_details || {}),
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

/**
 * Fetches ratings and stats for a given entity from the API.
 * Throws if either endpoint fails.
 */
export async function getEntityRatings(entityType, entityId) {
  if (!entityId) throw new Error('Entity id is missing');

  const [ratingsRes, statsRes] = await Promise.all([
    request(`/interactions/ratings/${entityType}/${entityId}?limit=20&offset=0`, { auth: false }),
    request(`/interactions/ratings/${entityType}/${entityId}/stats`, { auth: false }),
  ]);

  return {
    ratings: Array.isArray(ratingsRes) ? ratingsRes : [],
    stats: statsRes || null,
  };
}
