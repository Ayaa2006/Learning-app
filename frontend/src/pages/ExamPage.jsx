import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  AppBar,
  Toolbar,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheatDetectionComponent from '../components/CheatDetectionComponent'; // Ajustez le chemin si nécessaire

// Composant pour l'en-tête de l'examen
function ExamHeader({ examTitle, examId, timeRemaining, formatTime }) {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {examTitle || "Examen en cours"}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            ID: {examId}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          bgcolor: 'primary.light',
          p: 2,
          borderRadius: 1,
          color: 'white'
        }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            TEMPS RESTANT
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
            {formatTime(timeRemaining)}
          </Typography>
        </Box>
      </Toolbar>
      <LinearProgress 
        variant="determinate" 
        value={(timeRemaining / 3600) * 100} 
        sx={{ height: 6 }} 
      />
    </AppBar>
  );
}

// Composant amélioré pour les questions
function QuestionComponent() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = [
    {
      id: 1,
      text: "Quelle est la capitale de la France ?",
      options: [
        { id: 'a', text: "Londres" },
        { id: 'b', text: "Berlin" },
        { id: 'c', text: "Paris" },
        { id: 'd', text: "Rome" }
      ]
    },
    {
      id: 2,
      text: "Quel est le plus grand océan du monde ?",
      options: [
        { id: 'a', text: "Océan Atlantique" },
        { id: 'b', text: "Océan Pacifique" },
        { id: 'c', text: "Océan Indien" },
        { id: 'd', text: "Océan Arctique" }
      ]
    },
    {
      id: 3,
      text: "Quelle est la formule chimique de l'eau ?",
      options: [
        { id: 'a', text: "H2O" },
        { id: 'b', text: "CO2" },
        { id: 'c', text: "O2" },
        { id: 'd', text: "H2SO4" }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Question {currentQuestionIndex + 1}/{questions.length}
          </Typography>
          <Box>
            {questions.map((q, idx) => (
              <Button 
                key={q.id}
                variant={idx === currentQuestionIndex ? "contained" : "outlined"}
                size="small"
                sx={{ minWidth: '36px', mx: 0.5 }}
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {currentQuestion.text}
        </Typography>
        
        <RadioGroup 
          value={selectedAnswers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
        >
          {currentQuestion.options.map(option => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio color="primary" />}
              label={option.text}
              sx={{ 
                p: 1.5, 
                borderRadius: 1,
                mb: 1,
                '&:hover': { bgcolor: 'action.hover' },
                ...(selectedAnswers[currentQuestion.id] === option.id ? {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                } : {})
              }}
            />
          ))}
        </RadioGroup>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestionIndex === 0}
          >
            Question précédente
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigateQuestion('next')}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Question suivante
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Composant amélioré pour les réponses ouvertes
function AnswerComponent() {
  const [answers, setAnswers] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    console.log("Réponses soumises:", answers);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Réponse Ouverte
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Expliquez en détail votre raisonnement pour cette question. Utilisez des exemples concrets pour appuyer vos arguments.
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          placeholder="Saisissez votre réponse ici..."
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {answers.length} caractères écrits
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={answers.length < 10}
          >
            Soumettre la réponse
          </Button>
        </Box>
        
        <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Réponse enregistrée avec succès!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

// Composant principal ExamPage
function ExamPage() {
  const navigate = useNavigate();
  const [openCheatDialog, setOpenCheatDialog] = useState(false);
  const [cheatInfo, setCheatInfo] = useState(null);
  const [cheatCount, setCheatCount] = useState(0); // Compteur des infractions
  const [lastCheatTime, setLastCheatTime] = useState(0); // Dernière détection de triche
  const CHEAT_COOLDOWN = 5000; // 5 secondes entre chaque alerte
  
  const currentExamId = "EX-2023-123";
  const examTitle = "Introduction à l'Informatique";
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 heure en secondes
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un temps de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Effet pour le compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formater le temps restant
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestionnaire de détection de triche avec système de comptage centralisé
  const handleCheatDetected = (cheatDetectionInfo) => {
    const now = Date.now();
    
    // Vérifier s'il y a suffisamment de temps depuis la dernière alerte
    if (now - lastCheatTime < CHEAT_COOLDOWN) {
      console.log("Alerte ignorée - trop proche de la précédente");
      return;
    }
    
    // Mettre à jour le timestamp de la dernière alerte
    setLastCheatTime(now);
    
    console.log('Triche détectée:', cheatDetectionInfo);
    
    // Incrémenter explicitement le compteur local
    const newCheatCount = cheatCount + 1;
    setCheatCount(newCheatCount);
    
    // Enrichir l'information de triche avec le compteur mis à jour
    const enrichedInfo = {
      ...cheatDetectionInfo,
      cheatCount: newCheatCount
    };
    
    // Ouvrir le dialogue d'alerte de triche
    setCheatInfo(enrichedInfo);
    setOpenCheatDialog(true);
    
    // Si le compteur atteint ou dépasse 3
    if (newCheatCount >= 3) {
      console.log('Limite de 3 infractions atteinte - Expulsion imminente');
      
      // Rediriger automatiquement après 5 secondes
      setTimeout(() => {
        console.log('Expulsion effectuée');
        navigate('/');
      }, 5000);
    } else {
      // Si moins de 3 infractions, fermer automatiquement le dialogue après un certain temps
      setTimeout(() => {
        setOpenCheatDialog(false);
      }, 3000);
    }
  };

  // Fermer le dialogue et rediriger si c'est la 3ème infraction
  const handleCloseCheatDialog = () => {
    setOpenCheatDialog(false);
    if (cheatCount >= 3) {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)'
      }}>
        <Box sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <CircularProgress size={70} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Chargement de l'examen...
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Préparation de l'environnement sécurisé
          </Typography>
          <LinearProgress sx={{ height: 8, borderRadius: 1, mb: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Veuillez patienter pendant la configuration de la surveillance...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      pb: 4
    }}>
      {/* En-tête de l'examen */}
      <ExamHeader 
        examTitle={examTitle}
        examId={currentExamId}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
      />

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Colonne gauche - Webcam et instructions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              {/* Composant de détection de triche */}
              <CheatDetectionComponent 
                examId={currentExamId} 
                onCheatDetected={handleCheatDetected}
                tolerance={{
                  windowChange: 1000,
                  noFace: 2000,
                  multiplePersons: 1000
                }}
                maxCheats={2} // Nombre maximum de triches autorisées
                initialCheatCount={cheatCount} // Passer le compteur actuel
              />
              
              {/* Instructions de l'examen */}
              <Card elevation={1} sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Instructions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Restez face à la caméra pendant toute la durée de l'examen
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Ne changez pas de fenêtre ou d'onglet
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Aucune autre personne ne doit être visible à l'écran
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Complétez toutes les questions avant la fin du temps imparti
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'error.main' }}>
                    • Attention: 3 infractions = expulsion automatique de l'examen
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Colonne droite - Questions et réponses */}
          <Grid item xs={12} md={8}>
            {/* Composant des questions */}
            <QuestionComponent />

            {/* Composant de réponse */}
            <AnswerComponent />
            
            {/* Bouton de soumission final */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="success" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Terminer et soumettre l'examen
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogue de triche */}
      <Dialog
        open={openCheatDialog}
        onClose={handleCloseCheatDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="cheat-alert-dialog-title"
        aria-describedby="cheat-alert-dialog-description"
      >
        <DialogTitle id="cheat-alert-dialog-title" color="error" sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Violation des Règles de l'Examen
          </Typography>
        </DialogTitle>
        <DialogContent>
          {cheatInfo && cheatInfo.cheatCount >= 3 ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Cet examen va être terminé en raison de violations multiples ({cheatInfo.cheatCount}/3).
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Avertissement: Infraction {cheatInfo?.cheatCount || 1}/3 détectée.
            </Alert>
          )}
          
          <DialogContentText id="cheat-alert-dialog-description">
            <Typography variant="body1" paragraph>
              Un comportement suspect a été détecté pendant l'examen. 
              Cela peut inclure :
            </Typography>
            
            <ul>
              <li>Plusieurs visages détectés dans le champ de la caméra</li>
              <li>Changement de fenêtre ou d'onglet</li>
              <li>Absence de visage dans le champ de la caméra</li>
              <li>Mouvements suspects ou position incorrecte</li>
            </ul>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Détails de la violation :
            </Typography>
            
            {cheatInfo && (
              <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #ddd' }}>
                <Typography variant="body2">
                  <strong>Type :</strong> {cheatInfo.type}
                </Typography>
                <Typography variant="body2">
                  <strong>Message :</strong> {cheatInfo.message}
                </Typography>
                <Typography variant="body2">
                  <strong>Horodatage :</strong> {new Date(cheatInfo.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  <strong>Infractions :</strong> {cheatInfo.cheatCount}/3
                </Typography>
              </Box>
            )}

            {cheatInfo && cheatInfo.cheatCount >= 3 ? (
              <>
                <Typography variant="body1" sx={{ mt: 3 }}>
                  Vous avez atteint le nombre maximum d'infractions autorisées.
                  Veuillez contacter l'administrateur de l'examen pour plus d'informations.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Vous allez être redirigé vers la page d'accueil dans quelques secondes...
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ mt: 3 }}>
                Veuillez respecter les règles de l'examen. À la troisième infraction, 
                vous serez automatiquement expulsé de l'examen.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button 
    onClick={() => {
      // Au lieu de simplement fermer le dialogue, rediriger vers la page d'accueil
      window.location.href = '/';
    }} 
    color="error" 
    variant="contained"
    autoFocus
  >
    QUITTER L'EXAMEN
  </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExamPage;