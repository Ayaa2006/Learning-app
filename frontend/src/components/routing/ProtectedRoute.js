// src/components/routing/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Composant pour protéger les routes qui nécessitent une authentification
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated()) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier si l'utilisateur a ce rôle
  if (requiredRole && !hasRole(requiredRole)) {
    // Rediriger vers une page d'accès refusé ou le tableau de bord approprié
    if (currentUser.role === 'STUDENT') {
      return <Navigate to="/student-dashboard" replace />;
    } else {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  // Si l'utilisateur est authentifié et a le rôle requis, afficher le contenu
  return children;
};

export default ProtectedRoute;