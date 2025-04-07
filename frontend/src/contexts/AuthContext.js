// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Définir les rôles possibles
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

// Définir les permissions pour chaque rôle
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'viewDashboard', 'viewCourses', 'editCourse', 'deleteCourse',
    'viewQCM', 'editQCM', 'deleteQCM',
    'viewExams', 'editExam', 'deleteExam',
    'viewCertificates', 'createCertificate', 'viewStatistics',
    'manageUsers', 'viewSystemSettings'
  ],
  [ROLES.TEACHER]: [
    'viewDashboard', 'viewCourses', 'createCourse', 'editCourse',
    'viewQCM', 'createQCM', 'editQCM',
    'viewExams', 'createExam', 'editExam',
    'viewCertificates', 'viewStatistics'
  ],
  [ROLES.STUDENT]: [
    'viewCourses', 'takeCourse',
    'takeExam', 'viewOwnProgress',
    'viewOwnCertificates'
  ]
};

// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Vérifier si le contexte est utilisé dans un AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Fournisseur du contexte
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration des intercepteurs axios pour ajouter le token aux requêtes
  const setupAuthInterceptor = (token) => {
    api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };

  // Récupérer l'utilisateur connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          ...parsedUser,
          permissions: ROLE_PERMISSIONS[parsedUser.role] || []
        });
        setupAuthInterceptor(token);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

// Fonction de connexion
const login = async (userData, role) => {
  try {
    setLoading(true);
    setError(null);

    // Ajouter les permissions basées sur le rôle
    const userWithPermissions = {
      ...userData,
      permissions: ROLE_PERMISSIONS[role] || []
    };

    // Mettre à jour l'état
    setCurrentUser(userWithPermissions);
    
    // Configurer l'intercepteur avec le token déjà stocké dans localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setupAuthInterceptor(token);
    }

    return userWithPermissions;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur de connexion';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  // Fonction de déconnexion
  const logout = () => {
    // Supprimer les informations de l'utilisateur et le token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser l'état et supprimer l'intercepteur
    setCurrentUser(null);
    
    // Supprimer l'intercepteur axios
    api.interceptors.request.clear();
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      
      // Mettre à jour l'utilisateur dans le contexte et localStorage
      const updatedUser = { 
        ...currentUser, 
        ...response.data,
        permissions: currentUser.permissions // Conserver les permissions
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de mise à jour du profil');
      throw error;
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission) || false;
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
    updateProfile,
    hasRole,
    hasPermission,
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