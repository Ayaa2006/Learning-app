// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte d'authentification
const AuthContext = createContext();

// Définition des rôles disponibles dans l'application
const ROLES = {
  ADMIN: 'system-admin',
  TEACHER: 'teacher-admin',
  STUDENT: 'student'
};

// Définition des permissions pour chaque type d'utilisateur
const rolePermissions = {
  // Administrateur système - Droits de visualisation seulement (pas de création/modification)
  'system-admin': {
    // Permissions générales
    viewDashboard: true,
    manageUsers: true,
    manageRoles: true,
    viewStatistics: true,
    viewCheatDetection: true,
    
    // Permissions modules
    viewModules: true,
    createModule: false,  // Modifié: L'admin ne peut pas créer de modules
    editModule: false,    // Modifié: L'admin ne peut pas modifier de modules
    deleteModule: false,  // Modifié: L'admin ne peut pas supprimer de modules
    
    // Permissions cours
    viewCourses: true,
    createCourse: false,  // Modifié: L'admin ne peut pas créer de cours
    editCourse: false,    // Modifié: L'admin ne peut pas modifier de cours
    deleteCourse: false,  // Modifié: L'admin ne peut pas supprimer de cours
    
    // Permissions QCM
    viewQCM: true,
    createQCM: false,     // Modifié: L'admin ne peut pas créer de QCM
    editQCM: false,       // Modifié: L'admin ne peut pas modifier de QCM
    deleteQCM: false,     // Modifié: L'admin ne peut pas supprimer de QCM
    
    // Permissions examens
    viewExams: true,
    createExam: false,    // Modifié: L'admin ne peut pas créer d'examens
    editExam: false,      // Modifié: L'admin ne peut pas modifier d'examens
    deleteExam: false,    // Modifié: L'admin ne peut pas supprimer d'examens
    configureExam: false, // Modifié: L'admin ne peut pas configurer d'examens
    
    // Permissions certificats
    viewCertificates: true,
    issueCertificate: true,
    revokeCertificate: true,
    
    // Permissions étudiants
    viewStudentProgress: true,
  },
  
  // Professeur - Gestion complète des contenus pédagogiques
  'teacher-admin': {
    // Permissions générales
    viewDashboard: true,
    manageUsers: false,
    manageRoles: false,
    viewStatistics: true,
    viewCheatDetection: true,
    
    // Permissions modules
    viewModules: true,
    createModule: true,   // Le professeur peut créer des modules
    editModule: true,     // Le professeur peut modifier des modules
    deleteModule: true,   // Le professeur peut supprimer des modules
    
    // Permissions cours
    viewCourses: true,
    createCourse: true,   // Le professeur peut créer des cours
    editCourse: true,     // Le professeur peut modifier des cours
    deleteCourse: true,   // Le professeur peut supprimer des cours
    
    // Permissions QCM
    viewQCM: true,
    createQCM: true,      // Le professeur peut créer des QCM
    editQCM: true,        // Le professeur peut modifier des QCM
    deleteQCM: true,      // Le professeur peut supprimer des QCM
    
    // Permissions examens
    viewExams: true,
    createExam: true,     // Le professeur peut créer des examens
    editExam: true,       // Le professeur peut modifier des examens
    deleteExam: true,     // Le professeur peut supprimer des examens
    configureExam: true,  // Le professeur peut configurer des examens
    
    // Permissions certificats
    viewCertificates: true,
    issueCertificate: false, // Le professeur ne peut pas émettre de certificats
    revokeCertificate: false, // Le professeur ne peut pas révoquer de certificats
    
    // Permissions étudiants
    viewStudentProgress: true,
  },
  
  // Étudiant - Accès limité en lecture seule
  'student': {
    // Permissions générales
    viewDashboard: true,
    viewOwnProgress: true,
    viewOwnCertificates: true,
    takeExams: true,
    takeQCMs: true,
    viewCourses: true,
    
    // Aucune permission d'administration
    manageContent: false,
  }
};

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Vérifier l'état d'authentification au chargement du composant
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (simulation)
    const checkAuth = () => {
      try {
        // Récupérer les informations d'authentification du localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('userRole');
        const userData = localStorage.getItem('userData');
        
        if (isLoggedIn && role) {
          setIsAuthenticated(true);
          setUserRole(role);
          setPermissions(rolePermissions[role] || {});
          
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } else {
          // Réinitialiser l'état si non authentifié
          setIsAuthenticated(false);
          setUserRole(null);
          setPermissions({});
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Fonction de connexion
  const login = (userData, role) => {
    // Vérifier que le rôle est valide
    if (!rolePermissions[role]) {
      console.error(`Rôle invalide: ${role}`);
      return false;
    }
    
    // Stocker les informations d'authentification
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Mettre à jour l'état
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(userData);
    setPermissions(rolePermissions[role]);
    
    return true;
  };
  
  // Fonction de déconnexion
  const logout = () => {
    // Supprimer les informations d'authentification
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    
    // Réinitialiser l'état
    setIsAuthenticated(false);
    setUserRole(null);
    setPermissions({});
    setUser(null);
  };
  
  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permissionName) => {
    return permissions[permissionName] === true;
  };
  
  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return userRole === role;
  };
  
  // Valeur du contexte
  const contextValue = {
    isAuthenticated,
    user,
    userRole,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    ROLES
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};

export default AuthContext;