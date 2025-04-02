// services/userService.js
import api from './api';

// Récupérer tous les utilisateurs avec pagination et filtres
export const fetchAllUsers = async (page = 1, limit = 10, filters = {}) => {
  const { role, status, search } = filters;
  
  // Construire les paramètres de requête
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  
  if (role && role !== 'all') {
    params.append('role', role);
  }
  
  if (status && status !== 'all') {
    params.append('status', status);
  }
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await api.get(`/api/users?${params.toString()}`);
  return response.data;
};

// Récupérer un utilisateur par son ID
export const fetchUserById = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

// Mettre à jour un utilisateur
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/api/users/${userId}`, userData);
  return response.data;
};

// Mettre à jour le mot de passe d'un utilisateur
export const updateUserPassword = async (userId, passwordData) => {
  const response = await api.patch(`/api/users/${userId}/password`, passwordData);
  return response.data;
};

// Mettre à jour le statut d'un utilisateur
export const updateUserStatus = async (userId, status) => {
  const response = await api.patch(`/api/users/${userId}/status`, { status });
  return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};

// Récupérer les statistiques des utilisateurs
export const fetchUserStats = async () => {
  const response = await api.get('/api/users/stats');
  return response.data;
};

// Récupérer les incidents de triche d'un utilisateur
export const fetchUserIncidents = async (userId) => {
  const response = await api.get(`/api/users/${userId}/incidents`);
  return response.data;
};

// Récupérer la progression d'un utilisateur
export const fetchUserProgress = async (userId) => {
  const response = await api.get(`/api/users/${userId}/progress`);
  return response.data;
};


