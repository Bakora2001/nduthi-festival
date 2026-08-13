import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nduthi_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example calls (wire these into React Query hooks once the backend is running):
//   api.get('/categories')
//   api.get('/nominees/top?limit=5')
//   api.get('/votes/leaderboard?limit=5')
//   api.post('/payments/initiate', { method: 'MPESA', phone })
//   api.post('/votes', { nomineeId, paymentId })
