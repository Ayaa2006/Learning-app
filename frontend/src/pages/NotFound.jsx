// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = ({ darkMode, toggleDarkMode }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      bgcolor: darkMode ? 'background.default' : '#f5f7fb',
    }}>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>404</Typography>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>Page non trouvée</Typography>
      <Button variant="contained" component={Link} to="/" sx={{ bgcolor: '#ff9900' }}>
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default NotFound;