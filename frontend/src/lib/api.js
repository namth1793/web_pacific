import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getOne: (slug) => api.get(`/articles/${slug}`),
  getFeatured: () => api.get('/articles/featured'),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`)
};

export const programAPI = {
  getAll: (params) => api.get('/programs', { params }),
  getOne: (slug) => api.get(`/programs/${slug}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`)
};

export const researchAPI = {
  getAll: (params) => api.get('/research', { params }),
  getOne: (slug) => api.get(`/research/${slug}`),
  create: (data) => api.post('/research', data),
  update: (id, data) => api.put(`/research/${id}`, data),
  delete: (id) => api.delete(`/research/${id}`)
};

export const testAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getOne: (slug) => api.get(`/tests/${slug}`),
  submit: (id, data) => api.post(`/tests/${id}/submit`, data),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  delete: (id) => api.delete(`/tests/${id}`)
};

export const commentAPI = {
  getByArticle: (articleId) => api.get(`/comments/${articleId}`),
  create: (data) => api.post('/comments', data),
  approve: (id) => api.patch(`/comments/${id}/approve`),
  reject: (id) => api.patch(`/comments/${id}/reject`),
  delete: (id) => api.delete(`/comments/${id}`)
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  updateStatus: (id, status) => api.patch(`/contact/${id}`, { status })
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export default api;
