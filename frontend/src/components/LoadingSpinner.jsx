// components/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh'
    }}>
      <CircularProgress color="primary" size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;