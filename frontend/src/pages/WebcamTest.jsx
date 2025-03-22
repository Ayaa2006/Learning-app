// src/pages/WebcamTest.jsx
import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import WebcamProctoring from '../components/exam/WebcamProctoring';

const WebcamTest = () => {
  const [violations, setViolations] = useState([]);
  
  const handleViolation = (violation) => {
    setViolations(prev => [...prev, violation]);
    console.log("Violation détectée:", violation);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test de Surveillance par Webcam
        </Typography>
        <Typography variant="body1">
          Cette page vous permet de tester le système de détection de triche par webcam.
          Essayez de quitter le cadre, détourner le regard ou faire apparaître une autre personne pour tester les alertes.
        </Typography>
      </Paper>
      
      <WebcamProctoring 
        onViolation={handleViolation}
        onLoaded={(success) => console.log("Modèles chargés:", success)}
        tolerance={3000}
      />
      
      {violations.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Violations détectées ({violations.length})
          </Typography>
          {violations.map((violation, index) => (
            <Alert 
              key={index} 
              severity="warning" 
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                <strong>Type:</strong> {violation.type} <br />
                <strong>Timestamp:</strong> {new Date(violation.timestamp).toLocaleString()} <br />
                <strong>Détails:</strong> {violation.details}
              </Typography>
            </Alert>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default WebcamTest;