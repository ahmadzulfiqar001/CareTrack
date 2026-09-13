import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(err, fallback = 'Something went wrong') {
  if (!err) return fallback;

  const apiError = err.response?.data?.error || err.response?.data?.message;
  if (apiError) {
    const text = String(apiError);
    if (/duplicate|unique|already exists/i.test(text)) {
      return 'This email is already registered.';
    }
    if (/^forbidden$/i.test(text)) {
      return 'You do not have permission to perform this action.';
    }
    return text;
  }

  if (err.response?.status === 401) {
    return 'Your session has expired. Please log in again.';
  }

  if (err.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'Unable to connect to CareTrack. Please make sure the server is running and try again.';
  }

  if (/fetch failed|Failed to fetch|ECONNREFUSED|ENOTFOUND/i.test(err.message || '')) {
    return 'Unable to connect to CareTrack. Please make sure the server is running and try again.';
  }

  if (err.message && err.message !== 'Network Error') {
    return err.message;
  }

  return fallback;
}

export default api;
