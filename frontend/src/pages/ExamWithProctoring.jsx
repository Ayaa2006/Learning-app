// src/pages/ExamWithProctoring.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Button, Alert, CircularProgress } from '@mui/material';
import Webcam from 'react-webcam';

const ExamWithProctoring = () => {
  // États pour la détection
  const [webcamReady, setWebcamReady] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // État pour simuler un examen simple
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Questions d'exemple
  const questions = [
    {
      id: 1,
      text: "Quelle est la capitale de la France?",
      options: ["Londres", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      text: "Combien font 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4"
    },
    {
      id: 3,
      text: "Qui a peint la Joconde?",
      options: ["Van Gogh", "Picasso", "Leonard de Vinci", "Michel-Ange"],
      correctAnswer: "Leonard de Vinci"
    }
  ];

  // Fonction pour démarrer la détection
  const startDetection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simuler le chargement des modèles
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDetectionActive(true);
      setExamStarted(true);
      
      // Simulation d'alertes périodiques pour démonstration
      const alertInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const alertTypes = [
            "Visage non détecté",
            "Direction du regard suspecte",
            "Plusieurs personnes détectées"
          ];
          const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          
          setAlerts(prev => [
            { id: Date.now(), message: randomAlert, time: new Date().toLocaleTimeString() },
            ...prev
          ]);
        }
      }, 10000); // Toutes les 10 secondes
      
      // Nettoyage
      return () => clearInterval(alertInterval);
      
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la détection:", error);
      setError("Impossible d'initialiser la détection. Veuillez vérifier l'accès à votre caméra.");
    } finally {
      setLoading(false);
    }
  };

  // Naviguer entre les questions
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Vérifier que la webcam est prête
  const handleWebcamReady = () => {
    setWebcamReady(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Examen avec Surveillance
        </Typography>
        <Typography variant="body1" paragraph>
          Cet examen est surveillé par un système de détection automatique qui utilise votre webcam.
          Veuillez rester face à la caméra pendant toute la durée de l'examen.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Panneau de surveillance */}
        <Box sx={{ width: { xs: '100%', md: '320px' } }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Surveillance
            </Typography>
            
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                width="100%"
                height={240}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 320,
                  height: 240,
                  facingMode: "user"
                }}
                onUserMedia={handleWebcamReady}
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              />
              
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 10
                }}
              />
              
              {loading && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '8px',
                    zIndex: 20
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <CircularProgress color="inherit" size={40} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Initialisation...
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box 
              sx={{ 
                p: 1, 
                mb: 2, 
                borderRadius: '4px',
                bgcolor: detectionActive ? '#4caf50' : '#f5f5f5',
                color: detectionActive ? 'white' : 'inherit',
                textAlign: 'center'
              }}
            >
              {detectionActive 
                ? "Surveillance active" 
                : webcamReady 
                  ? "Prêt à démarrer" 
                  : "En attente de la caméra..."}
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {!examStarted && (
              <Button 
                variant="contained" 
                fullWidth 
                onClick={startDetection}
                disabled={!webcamReady || loading}
                sx={{ mb: 2 }}
              >
                {loading ? "Initialisation..." : "Démarrer l'examen"}
              </Button>
            )}
            
            <Typography variant="subtitle2" gutterBottom>
              Alertes récentes:
            </Typography>
            
            <Box 
              sx={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                bgcolor: '#f5f5f5',
                borderRadius: '4px',
                p: 1
              }}
            >
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <Box 
                    key={alert.id}
                    sx={{ 
                      mb: 1, 
                      p: 1, 
                      borderLeft: '3px solid #ff9800',
                      bgcolor: 'rgba(255, 152, 0, 0.1)'
                    }}
                  >
                    <Typography variant="caption" display="block" color="textSecondary">
                      {alert.time}
                    </Typography>
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  Aucune alerte
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
        
        {/* Contenu de l'examen */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {!examStarted ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Instructions de l'examen
                </Typography>
                <Typography variant="body1" paragraph>
                  1. Vérifiez que votre webcam fonctionne correctement.
                </Typography>
                <Typography variant="body1" paragraph>
                  2. Restez face à la caméra pendant toute la durée de l'examen.
                </Typography>
                <Typography variant="body1" paragraph>
                  3. Ne consultez pas d'autres fenêtres ou documents.
                </Typography>
                <Typography variant="body1">
                  4. Cliquez sur "Démarrer l'examen" quand vous êtes prêt.
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="overline" color="textSecondary">
                    Question {currentQuestion + 1} / {questions.length}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {questions[currentQuestion].text}
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#f5f5f5'
                          }
                        }}
                      >
                        <Typography variant="body1">
                          {option}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button 
                    variant="outlined"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Question précédente
                  </Button>
                  
                  <Button 
                    variant="contained"
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Question suivante
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ExamWithProctoring;