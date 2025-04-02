// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    'viewExams',  'editExam', 'deleteExam',
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
  return useContext(AuthContext);
}

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }) {
  // État pour stocker les informations de l'utilisateur connecté
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialiser l'état de l'utilisateur au chargement
  useEffect(() => {
    // Vérifier s'il y a un utilisateur stocké dans localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Définir l'utilisateur courant
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = (userData, role) => {
    try {
      // Vérifier si le rôle est valide
      if (!Object.values(ROLES).includes(role)) {
        console.error("Rôle non valide:", role);
        return false;
      }
      
      // Mettre à jour l'état de l'utilisateur
      const userWithPermissions = {
        ...userData,
        role,
        permissions: ROLE_PERMISSIONS[role] || []
      };
      
      setCurrentUser(userWithPermissions);
      
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // Supprimer les informations de l'utilisateur et le token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Réinitialiser l'état de l'utilisateur
    setCurrentUser(null);
    
    return true;
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission) => {
    return currentUser && currentUser.permissions && 
           currentUser.permissions.includes(permission);
  };

  // Valeurs à fournir via le contexte
  const value = {
    currentUser,
    login,
    logout,
    hasRole,
    hasPermission,
    ROLES, // Exporter les constantes de rôles
    isAdmin: () => hasRole(ROLES.ADMIN),
    isTeacher: () => hasRole(ROLES.TEACHER),
    isStudent: () => hasRole(ROLES.STUDENT),
    isAuthenticated: () => !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}