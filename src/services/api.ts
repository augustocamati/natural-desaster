import axios from 'axios';

const API_BASE_URL = 'https://meubackend.com/api';
const NASA_EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3';

// Create axios instance for backend API
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for NASA EONET API
export const nasaApi = axios.create({
  baseURL: NASA_EONET_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  signUp: async (data: { name: string; email: string; password: string; location: string }) => {
    const response = await api.post('/sign-up', data);
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
    }
    return response.data;
  },

  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post('/sign-in', data);
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token');
  },
};

// NASA EONET Services
export interface EONETCategory {
  id: string;
  title: string;
  link: string;
  description: string;
  layers: string;
}

export interface EONETEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: Array<{ id: string; title: string }>;
  sources: Array<{ id: string; url: string }>;
  geometry: Array<{
    magnitudeValue?: number;
    magnitudeUnit?: string;
    date: string;
    type: string;
    coordinates: [number, number];
  }>;
}

export const nasaService = {
  getCategories: async (): Promise<EONETCategory[]> => {
    const response = await nasaApi.get('/categories');
    return response.data.categories;
  },

  getEvents: async (params?: { 
    status?: 'open' | 'closed';
    limit?: number;
    days?: number;
    category?: string;
  }): Promise<EONETEvent[]> => {
    const response = await nasaApi.get('/events', { params });
    return response.data.events;
  },

  getEventsByCategory: async (categoryId: string): Promise<EONETEvent[]> => {
    const response = await nasaApi.get(`/categories/${categoryId}`);
    return response.data.events;
  },
};
