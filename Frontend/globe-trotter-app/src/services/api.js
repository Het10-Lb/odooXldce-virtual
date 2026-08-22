const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to construct Authorization header if token exists
 */
function getAuthHeaders() {
  const token = localStorage.getItem('gt_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==================== AUTH APIs ====================
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data.data;
}

export async function requestForgotPassword(email) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password reset request failed');
  return data;
}

export async function resetPasswordToken(token, newPassword) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password reset failed');
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user profile');
  return data.data.user;
}

// ==================== DESTINATION APIs ====================
export async function fetchTopRegionalDestinations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/destinations/top-regional${query ? `?${query}` : ''}`;
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(`Failed to fetch regional destinations (${response.status})`);
  const result = await response.json();
  return result.data;
}

export async function fetchRegions() {
  const url = `${API_BASE_URL}/destinations/regions`;
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(`Failed to fetch regions (${response.status})`);
  const result = await response.json();
  return result.data?.regions || [];
}

export async function fetchDestinationById(id) {
  const url = `${API_BASE_URL}/destinations/${id}`;
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(`Failed to fetch destination details (${response.status})`);
  const result = await response.json();
  return result.data?.destination;
}

export async function toggleSaveCity(cityId) {
  const res = await fetch(`${API_BASE_URL}/destinations/${cityId}/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save city');
  return data.data;
}

// ==================== TRIPS APIs ====================
export async function fetchUserTrips(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/trips${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch trips');
  return data.data;
}

export async function fetchLandingDashboard() {
  const res = await fetch(`${API_BASE_URL}/dashboard/landing`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard data');
  return data.data;
}

export async function createTripInDB(tripData) {
  const res = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tripData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create trip');
  return data.data?.trip;
}

export async function fetchTripById(id) {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch trip details');
  return data.data?.trip;
}

export async function fetchTripItineraryView(id) {
  const res = await fetch(`${API_BASE_URL}/trips/${id}/itinerary-view`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch itinerary details');
  return data.data;
}

export async function addItineraryItemToSection(tripId, sectionId = 'auto', itemData) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add activity item');
  return data.data?.item;
}

export async function deleteTripFromDB(id) {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete trip');
  return data;
}

export async function deleteSectionFromTrip(tripId, sectionId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete section');
  return data;
}

export async function deleteItemFromTripSection(tripId, sectionId, itemId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}/items/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete activity item');
  return data;
}

// ==================== COMMUNITY APIs ====================
export async function fetchCommunityPosts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/community/posts${query ? `?${query}` : ''}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch community posts');
  return data.data;
}

export async function createCommunityPost(postData) {
  const res = await fetch(`${API_BASE_URL}/community/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create community post');
  return data.data?.post;
}

export async function togglePostLike(postId) {
  const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle like');
  return data.data;
}

export async function addPostComment(postId, content) {
  const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add comment');
  return data.data?.comment;
}
