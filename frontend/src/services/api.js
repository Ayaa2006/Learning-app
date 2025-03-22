import axios from 'axios';
import { toast } from 'react-toastify';

// Créer une instance d'axios avec une configuration de base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Récupérer le token du localStorage s'il existe
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Vous pouvez modifier la configuration de la requête ici
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Gestion des erreurs 401 (non authentifié)
    if (response && response.status === 401) {
      // Supprimer le token invalide
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Rediriger vers la page de connexion si l'utilisateur était authentifié
      if (window.location.pathname !== '/login') {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        window.location.href = '/login';
      }
    }
    
    // Gestion des erreurs 403 (accès refusé)
    if (response && response.status === 403) {
      toast.error('Vous n\'avez pas les droits nécessaires pour effectuer cette action.');
    }
    
    // Gestion des erreurs 404 (ressource non trouvée)
    if (response && response.status === 404) {
      toast.error('La ressource demandée n\'existe pas.');
    }
    
    // Gestion des erreurs 500 (erreur serveur)
    if (response && response.status >= 500) {
      toast.error('Une erreur est survenue sur le serveur. Veuillez réessayer ultérieurement.');
    }
    
    // Gestion des erreurs de connexion
    if (!response) {
      toast.error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;