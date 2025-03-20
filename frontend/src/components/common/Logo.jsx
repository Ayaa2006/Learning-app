// src/components/common/Logo.jsx
import React from 'react';
import { Typography } from '@mui/material';

// src/components/common/Logo.jsx
const Logo = ({ height = 40, dark = false }) => {
    const color = dark ? '#0a0e17' : '#ffffff';
    const accentColor = '#ff9900';
    
    return (
      <Typography 
        variant="h4" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',
          fontSize: `${height}px`,
          lineHeight: 1,
          color: color,
          display: 'flex',
          alignItems: 'center'
        }}
      >
     Skill<span style={{ color: accentColor }}>Path</span>
      </Typography>
    );
  };
export default Logo;