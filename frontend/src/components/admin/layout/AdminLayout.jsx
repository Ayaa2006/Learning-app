// components/admin/layout/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../../context/AuthContext';

const AdminLayout = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est un administrateur
  useEffect(() => {
    if (!loading && currentUser && !isAdmin()) {
      navigate('/'); // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
    }
  }, [currentUser, loading, isAdmin, navigate]);

  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Box>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger si l'utilisateur n'est pas administrateur
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AdminSidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden' 
        }}
      >
        <AdminHeader />
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto' 
          }}
        >
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;