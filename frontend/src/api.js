import axios from 'axios';

// v2 — routes updated to /listing/:id
// In production: VITE_API_URL = your Vercel backend URL
// In development: Vite proxy handles /api → http://localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/user/signup', userData),
  login: (credentials) => api.post('/user/login', credentials),
  logout: () => api.get('/user/logout'),
  getCurrentUser: () => api.get('/user/current'),
  checkAuth: () => api.get('/user/auth-status'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  changeUsername: (newUsername) => api.put('/user/profile/username', { newUsername }),
  changePassword: (passwordData) => api.put('/user/profile/password', passwordData)
};

// Listings API calls
export const listingsAPI = {
  getAllListings: () => api.get('/listing'),
  getListingById: (id) => api.get(`/listing/${id}`),
  createListing: (formData) => api.post('/listing', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateListing: (id, formData) => api.patch(`/listing/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteListing: (id) => api.delete(`/listing/${id}`),
  getEditPage: (id) => api.get(`/listing/${id}/edit`)
};

// Reviews API calls
export const reviewsAPI = {
  addReview: (listingId, reviewData) => api.post(`/listing/${listingId}/review`, reviewData),
  deleteReview: (listingId, reviewId) => api.delete(`/listing/${listingId}/review/${reviewId}`)
};

export default api;
