// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant de protection des routes basé sur l'authentification et les permissions
 * @param {React.ReactNode} children - Les composants enfants à afficher si l'utilisateur est autorisé
 * @param {Array<string>} requiredPermissions - Liste des permissions requises pour accéder à la route
 * @param {string} requiredRole - Rôle requis pour accéder à la route (facultatif)
 * @param {string} redirectPath - Chemin de redirection si l'utilisateur n'est pas autorisé
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null, 
  redirectPath = '/login' 
}) => {
  const { isAuthenticated, hasPermission, userRole, loading } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f7fb'
        }}
      >
        <CircularProgress sx={{ color: '#ff9900', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Vérification des permissions...
        </Typography>
      </Box>
    );
  }

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion et stocker l'emplacement actuel
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a le rôle requis (si spécifié)
  if (requiredRole && userRole !== requiredRole) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/" replace />;
  }

  // Vérifier si l'utilisateur a toutes les permissions requises
  const hasAllPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  if (!hasAllPermissions) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas toutes les permissions requises
    return <Navigate to="/" replace />;
  }

  // Si toutes les vérifications sont passées, rendre les composants enfants
  return children;
};

export default ProtectedRoute;