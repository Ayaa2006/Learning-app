// services/moduleService.js
import api from './api';

// Récupérer tous les modules avec pagination et filtres
export const fetchAllModules = async (page = 1, limit = 10, filters = {}) => {
  const { status, search, sort } = filters;
  
  // Construire les paramètres de requête
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  
  if (status && status !== 'all') {
    params.append('status', status);
  }
  
  if (search) {
    params.append('search', search);
  }
  
  if (sort) {
    params.append('sort', sort);
  }
  
  const response = await api.get(`/api/modules?${params.toString()}`);
  return response.data;
};

// Récupérer un module par son ID
export const fetchModuleById = async (moduleId) => {
  const response = await api.get(`/api/modules/${moduleId}`);
  return response.data;
};

// Créer un nouveau module
export const createModule = async (moduleData) => {
  const response = await api.post('/api/modules', moduleData);
  return response.data;
};

// Mettre à jour un module
export const updateModule = async (moduleId, moduleData) => {
  const response = await api.put(`/api/modules/${moduleId}`, moduleData);
  return response.data;
};

// Supprimer un module
export const deleteModule = async (moduleId) => {
  const response = await api.delete(`/api/modules/${moduleId}`);
  return response.data;
};

// Récupérer les contenus d'un module (cours et examen)
export const fetchModuleContents = async (moduleId) => {
  const response = await api.get(`/api/modules/${moduleId}/contents`);
  return response.data;
};

// Réorganiser les modules
export const reorderModules = async (moduleOrders) => {
  const response = await api.post('/api/modules/reorder', { moduleOrders });
  return response.data;
};

// Récupérer les statistiques d'un module
export const fetchModuleStats = async (moduleId) => {
  const response = await api.get(`/api/modules/${moduleId}/stats`);
  return response.data;
};
