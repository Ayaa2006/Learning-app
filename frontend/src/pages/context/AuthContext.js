import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Définir les rôles possibles
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}

// Fournisseur du contexte
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer l'utilisateur connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email, password, role) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/login', { email, password, role });
      const { user, token } = response.data;
      
      // Stocker le token et les infos utilisateur dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Mettre à jour l'état
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Vérifier les rôles spécifiques
  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isTeacher = () => hasRole(ROLES.TEACHER);
  const isStudent = () => hasRole(ROLES.STUDENT);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => !!currentUser;

  // Valeur du contexte
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    isAuthenticated,
    ROLES // Ajouter les rôles pour pouvoir les utiliser dans d'autres composants
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;