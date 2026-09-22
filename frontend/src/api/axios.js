import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BASE_URL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear stale credentials
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const blogApi = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getById: (id) => api.get(`/blogs/${id}`),
  search: (keyword, params) => api.get('/blogs/search', { params: { keyword, ...params } }),
  getMyBlogs: (params) => api.get('/blogs/my-blogs', { params }),
  create: (blogData) => api.post('/blogs', blogData),
  update: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const tagApi = {
  getAll: () => api.get('/tags'),
};

export const commentApi = {
  getByBlog: (blogId) => api.get(`/blogs/${blogId}/comments`),
  add: (blogId, data) => api.post(`/blogs/${blogId}/comments`, data),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

export const likeApi = {
  toggle: (blogId) => api.post(`/blogs/${blogId}/like`),
  getStatus: (blogId) => api.get(`/blogs/${blogId}/like-status`),
};

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
};

export default api;
