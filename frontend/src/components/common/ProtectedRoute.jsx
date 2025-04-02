// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { currentUser, isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated()) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si des permissions spécifiques sont requises, vérifier si l'utilisateur les a
  if (requiredPermissions.length > 0) {
    // Vérifier toutes les permissions requises
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      // Rediriger vers le tableau de bord approprié en fonction du rôle
      if (currentUser.role === 'STUDENT') {
        return <Navigate to="/student-dashboard" replace />;
      } else {
        return <Navigate to="/admin-dashboard" replace />;
      }
    }
  }

  // Si l'utilisateur est authentifié et a les permissions requises, afficher le contenu
  return children;
};

export default ProtectedRoute;