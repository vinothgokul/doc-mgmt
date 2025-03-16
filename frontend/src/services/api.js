import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json'}
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout')
}

export const userApi = {
  getAllUsers: () => api.get('/user'),
  getUser: (id) => api.get(`/user/${id}`),
  createUser: (data) => api.post('/user',data),
  updateUser: (id, data) => api.patch(`/user/${id}`, data),
  deleteUser: (id) => api.delete(`/user/${id}`)
}

export const documentApi = {
  uploadDocument: (formData) => api.post('/document/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
  getAllDocuments: () => api.get('/document'),
  getDocument: (id) => api.get(`/document/${id}`),
  updateDocument: (id, formData) => api.patch(`/document/${id}`,formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
  deleteDocument: (id) => api.delete(`/document/${id}`),
  triggerIngestion: (id) => api.post(`/document/${id}/ingestion/start`),
  getIngestionStatus: (id) => api.get(`/document/ingestion/${id}`),
  ask: (data) => api.post('/document/ask', data)
}