import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import CheatDetectionComponent from '../components/CheatDetectionComponent';

// Composant pour l'en-tête de l'examen
function ExamHeader({ examTitle, examId, timeRemaining, formatTime, maxTime }) {
  // Calculer la progression en pourcentage (inversée car c'est le temps restant)
  const progressValue = (timeRemaining / maxTime) * 100;
  
  // Déterminer la couleur en fonction du temps restant
  const getProgressColor = () => {
    if (progressValue > 60) return 'success';
    if (progressValue > 30) return 'warning';
    return 'error';
  };

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
          bgcolor: getProgressColor() === 'error' ? 'error.light' : 
                   getProgressColor() === 'warning' ? 'warning.light' : 'primary.light',
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
        value={progressValue} 
        color={getProgressColor()}
        sx={{ height: 6 }} 
      />
    </AppBar>
  );
}

// Composant amélioré pour les questions
function QuestionComponent({ onAnswerSubmit }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des questions depuis une API
  useEffect(() => {
    // Dans un vrai cas, ce serait un appel API
    setTimeout(() => {
      const loadedQuestions = [
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
        },
        {
          id: 4,
          text: "Qui a peint la Joconde ?",
          options: [
            { id: 'a', text: "Pablo Picasso" },
            { id: 'b', text: "Vincent van Gogh" },
            { id: 'c', text: "Leonardo da Vinci" },
            { id: 'd', text: "Michel-Ange" }
          ]
        },
        {
          id: 5,
          text: "Quel est l'élément chimique le plus abondant dans l'univers ?",
          options: [
            { id: 'a', text: "Oxygène" },
            { id: 'b', text: "Carbone" },
            { id: 'c', text: "Hydrogène" },
            { id: 'd', text: "Azote" }
          ]
        }
      ];
      setAllQuestions(loadedQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  // Gérer la sélection des réponses
  const handleAnswerSelect = (questionId, answerId) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [questionId]: answerId
    };
    
    setSelectedAnswers(updatedAnswers);
    
    // Notifier le parent des réponses mises à jour
    if (onAnswerSubmit) {
      onAnswerSubmit(updatedAnswers);
    }
  };

  // Navigation entre les questions
  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculer le nombre de questions répondues
  const answeredQuestionsCount = Object.keys(selectedAnswers).length;
  
  // Vérifier si toutes les questions ont une réponse
  const allQuestionsAnswered = allQuestions.length > 0 && answeredQuestionsCount === allQuestions.length;

  if (loading) {
    return (
      <Card elevation={3} sx={{ mb: 3, p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography>Chargement des questions...</Typography>
      </Card>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Question {currentQuestionIndex + 1}/{allQuestions.length}
          </Typography>
          <Box>
            {allQuestions.map((q, idx) => (
              <Button 
                key={q.id}
                variant={idx === currentQuestionIndex ? "contained" : selectedAnswers[q.id] ? "outlined" : "text"}
                size="small"
                color={selectedAnswers[q.id] ? "success" : "primary"}
                sx={{ 
                  minWidth: '36px', 
                  mx: 0.5,
                  bgcolor: idx === currentQuestionIndex ? 'primary.main' : 
                          selectedAnswers[q.id] ? 'success.light' : 'transparent'
                }}
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="body2" color="text.secondary">
            {answeredQuestionsCount} sur {allQuestions.length} questions répondues
          </Typography>
          <Box sx={{ 
            px: 2, 
            py: 0.5, 
            borderRadius: 1, 
            bgcolor: allQuestionsAnswered ? 'success.light' : 'warning.light',
            color: 'white'
          }}>
            <Typography variant="body2">
              {allQuestionsAnswered ? "Toutes les questions sont répondues" : "Des questions restent sans réponse"}
            </Typography>
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
            startIcon={<span>←</span>}
          >
            Question précédente
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigateQuestion('next')}
            disabled={currentQuestionIndex === allQuestions.length - 1}
            endIcon={<span>→</span>}
          >
            Question suivante
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Composant amélioré pour les réponses ouvertes
function AnswerComponent({ onTextChange }) {
  const [answers, setAnswers] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSavedText, setLastSavedText] = useState('');
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);
  
  const autoSaveTimeout = useRef(null);

  // Gérer le changement du texte
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setAnswers(newValue);
    
    // Notifier le parent du changement
    if (onTextChange) {
      onTextChange(newValue);
    }
    
    // Configurer l'autosauvegarde après 2 secondes d'inactivité
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    
    autoSaveTimeout.current = setTimeout(() => {
      setLastSavedText(newValue);
      setAutoSaveIndicator(true);
      setTimeout(() => setAutoSaveIndicator(false), 1500);
    }, 2000);
  };

  // Simuler la soumission
  const handleSubmit = () => {
    setLastSavedText(answers);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

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
          onChange={handleTextChange}
          placeholder="Saisissez votre réponse ici..."
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {answers.length} caractères écrits
            </Typography>
            {autoSaveIndicator && (
              <Typography variant="caption" color="success.main" sx={{ ml: 2 }}>
                Sauvegarde automatique effectuée
              </Typography>
            )}
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={answers.length < 10 || answers === lastSavedText}
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
  const { examId } = useParams(); // Récupérer l'ID de l'examen depuis l'URL
  
  // États relatifs à l'examen
  const [currentExamId, setCurrentExamId] = useState(examId || "EX-2023-123");
  const [examTitle, setExamTitle] = useState("Introduction à l'Informatique");
  const [maxTime, setMaxTime] = useState(3600); // 1 heure en secondes
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isLoading, setIsLoading] = useState(true);
  const [examProgress, setExamProgress] = useState({
    questionsAnswered: 0,
    totalQuestions: 5,
    textResponseSubmitted: false
  });
  
  // États relatifs à la détection de triche
  const [openCheatDialog, setOpenCheatDialog] = useState(false);
  const [cheatInfo, setCheatInfo] = useState(null);
  const [cheatCount, setCheatCount] = useState(0);
  const [lastCheatTime, setLastCheatTime] = useState(0);
  const [expulsionCountdown, setExpulsionCountdown] = useState(null);
  const [isExpulsionImminent, setIsExpulsionImminent] = useState(false);
  
  // Constantes pour la gestion de la triche
  const MAX_CHEAT_COUNT = 3;
  const CHEAT_COOLDOWN = 5000; // 5 secondes entre chaque alerte
  
  // Référence pour le compte à rebours d'expulsion
  const expulsionTimeoutRef = useRef(null);
  
  // Variable pour suivre l'URL de la page actuelle
  const lastPageUrl = useRef(window.location.href);
  const pageChangeStartTime = useRef(null);
  const pageChangeTimeout = useRef(null);

  // Simuler un temps de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Effet pour le compte à rebours de l'examen
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Gérer la fin du temps imparti
  const handleTimeUp = () => {
    // Afficher une alerte
    setOpenCheatDialog(true);
    setCheatInfo({
      type: 'time_up',
      message: 'Le temps imparti pour cet examen est écoulé.',
      timestamp: Date.now(),
      cheatCount: MAX_CHEAT_COUNT // Forcer l'expulsion
    });
    
    // Rediriger après un délai
    setTimeout(() => {
      navigate('/results?timeExpired=true');
    }, 5000);
  };

  // Formater le temps restant
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mettre à jour la progression en fonction des réponses
  const handleAnswerSubmit = (answers) => {
    setExamProgress(prev => ({
      ...prev,
      questionsAnswered: Object.keys(answers).length
    }));
  };

  // Mettre à jour l'état de la réponse textuelle
  const handleTextResponseChange = (text) => {
    setExamProgress(prev => ({
      ...prev,
      textResponseSubmitted: text.length >= 50
    }));
  };

  // Vérifier si l'examen peut être soumis
  const canSubmitExam = examProgress.questionsAnswered === examProgress.totalQuestions && 
                        examProgress.textResponseSubmitted;

  // Gestionnaire pour la détection de papier/document
  const handlePaperDetection = useCallback((isPaperDetected) => {
    if (isPaperDetected) {
      const paperDetectionInfo = {
        type: 'paper_detected',
        message: 'Document ou cahier détecté dans le champ de la caméra',
        timestamp: Date.now()
      };
      
      // Appeler le gestionnaire de triche avec cette information
      handleCheatDetected(paperDetectionInfo);
    }
  }, []);

  // Gestionnaire amélioré de détection de triche
  const handleCheatDetected = useCallback((cheatDetectionInfo) => {
    const now = Date.now();
    
    // Vérifier s'il y a suffisamment de temps depuis la dernière alerte
    if (now - lastCheatTime < CHEAT_COOLDOWN) {
      console.log("Alerte ignorée - trop proche de la précédente");
      return;
    }
    
    // Si une expulsion est déjà en cours, ne pas traiter de nouvelles alertes
    if (isExpulsionImminent) {
      return;
    }
    
    // Mettre à jour le timestamp de la dernière alerte
    setLastCheatTime(now);
    
    console.log('Triche détectée:', cheatDetectionInfo);
    
    // Incrémenter le compteur local
    const newCheatCount = cheatCount + 1;
    setCheatCount(newCheatCount);
    
    // Enrichir l'information de triche avec le compteur mis à jour
    const enrichedInfo = {
      ...cheatDetectionInfo,
      cheatCount: newCheatCount,
      timestamp: now
    };
    
    // Ouvrir le dialogue d'alerte de triche
    setCheatInfo(enrichedInfo);
    setOpenCheatDialog(true);
    
    // Si le compteur atteint ou dépasse la limite
    if (newCheatCount >= MAX_CHEAT_COUNT) {
      console.log(`Limite de ${MAX_CHEAT_COUNT} infractions atteinte - Expulsion imminente`);
      setIsExpulsionImminent(true);
      
      // Configurer le compte à rebours d'expulsion
      let countdown = 5;
      setExpulsionCountdown(countdown);
      
      // Mettre à jour le compte à rebours chaque seconde
      expulsionTimeoutRef.current = setInterval(() => {
        countdown--;
        setExpulsionCountdown(countdown);
        
        if (countdown <= 0) {
          clearInterval(expulsionTimeoutRef.current);
          console.log('Expulsion effectuée');
          handleExpulsion();
        }
      }, 1000);
    } else {
      // Si moins que la limite, fermer automatiquement le dialogue après un certain temps
      setTimeout(() => {
        setOpenCheatDialog(false);
      }, 3000);
    }
  }, [cheatCount, lastCheatTime, isExpulsionImminent]);

  // Fonction pour gérer l'expulsion de l'étudiant
  const handleExpulsion = useCallback(() => {
    console.log('Expulsion de l\'étudiant pour cause de triche multiple');
    
    // Rediriger vers la page de résultats avec le paramètre d'expulsion
    // indiquant que l'étudiant doit recommencer le module
    navigate('/results?expelled=true&restart=module');
  }, [navigate]);

  // Nettoyer les timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (expulsionTimeoutRef.current) {
        clearInterval(expulsionTimeoutRef.current);
      }
      if (pageChangeTimeout.current) {
        clearTimeout(pageChangeTimeout.current);
      }
    };
  }, []);

  // Gérer la fermeture du dialogue de triche
  const handleCloseCheatDialog = () => {
    setOpenCheatDialog(false);
    if (cheatCount >= MAX_CHEAT_COUNT || cheatInfo?.type === 'time_up') {
      handleExpulsion();
    }
  };

  // Gérer la soumission de l'examen
  const handleSubmitExam = () => {
    // Afficher une confirmation
    if (window.confirm("Êtes-vous sûr de vouloir soumettre votre examen ? Cette action est irréversible.")) {
      // Simuler l'envoi des données
      console.log("Soumission de l'examen...");
      
      // Rediriger vers la page des résultats
      navigate('/results');
    }
  };

  // Formater les messages de type de triche pour une meilleure lisibilité
  const formatCheatType = (type) => {
    const types = {
      'window_change': 'Changement de fenêtre',
      'page_change': 'Sortie de la page d\'examen',
      'multiple_window_changes': 'Changements de fenêtre multiples',
      'multiple_faces': 'Plusieurs personnes détectées',
      'no_face': 'Absence de visage',
      'rapid_movement': 'Mouvements suspects',
      'eyes_covered': 'Yeux non visibles',
      'paper_detected': 'Document détecté',
      'time_up': 'Temps écoulé'
    };
    
    return types[type] || type;
  };

  // Afficher l'écran de chargement
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
      {/* En-tête de l'examen avec le temps restant */}
      <ExamHeader 
        examTitle={examTitle}
        examId={currentExamId}
        timeRemaining={timeRemaining}
        maxTime={maxTime}
        formatTime={formatTime}
      />

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Colonne gauche - Webcam et instructions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              {/* Composant de détection de triche amélioré avec nouvelles fonctionnalités */}
              <CheatDetectionComponent 
                examId={currentExamId} 
                onCheatDetected={handleCheatDetected}
                onPaperDetection={handlePaperDetection}
                onExpulsion={handleExpulsion}
                tolerance={{
                  windowChange: 2000,
                  pageChange: 5000,       // 5 secondes pour le changement de page
                  noFace: 3000,
                  multiplePersons: 1500,
                  rapidMovement: 3000,
                  eyesCovered: 3000,
                  paperDetection: 2500    // Délai pour la détection de documents
                }}
                maxCheats={MAX_CHEAT_COUNT}
                initialCheatCount={cheatCount}
              />
              
              {/* Statistiques de l'examen */}
              <Card elevation={1} sx={{ mt: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Progression de l'examen
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Questions répondues: {examProgress.questionsAnswered}/{examProgress.totalQuestions}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(examProgress.questionsAnswered / examProgress.totalQuestions) * 100} 
                      color="success"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: examProgress.textResponseSubmitted ? 'success.light' : 'warning.light', 
                    color: 'white',
                    borderRadius: 1,
                    mb: 2
                  }}>
                    <Typography variant="body2">
                      {examProgress.textResponseSubmitted 
                        ? "✓ Réponse détaillée soumise" 
                        : "⚠ Réponse détaillée requise"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: canSubmitExam ? 'success.light' : 'warning.light', 
                    color: 'white',
                    borderRadius: 1
                  }}>
                    <Typography variant="body2" fontWeight="bold">
                      {canSubmitExam 
                        ? "✓ Vous pouvez soumettre l'examen" 
                        : "⚠ Veuillez compléter toutes les sections"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Instructions de l'examen avec les nouvelles règles */}
              <Card elevation={1}>
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
                    • Ne quittez pas la page d'examen pendant plus de 5 secondes
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Aucun cahier, livre ou document papier ne doit être visible
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Aucune autre personne ne doit être visible à l'écran
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Complétez toutes les questions avant la fin du temps imparti
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'error.main', fontWeight: 'bold' }}>
                    • Attention: {MAX_CHEAT_COUNT} infractions = expulsion automatique et reprise du module depuis le début
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Colonne droite - Questions et réponses */}
          <Grid item xs={12} md={8}>
            {/* Composant des questions à choix multiples */}
            <QuestionComponent onAnswerSubmit={handleAnswerSubmit} />

            {/* Composant de réponse textuelle */}
            <AnswerComponent onTextChange={handleTextResponseChange} />
            
            {/* Bouton de soumission final */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="success" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
                disabled={!canSubmitExam}
                onClick={handleSubmitExam}
              >
                Terminer et soumettre l'examen
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogue de triche amélioré avec les nouvelles infractions */}
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
            {cheatInfo?.type === 'time_up' 
              ? "Temps écoulé" 
              : "Violation des Règles de l'Examen"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {cheatInfo && (cheatInfo.cheatCount >= MAX_CHEAT_COUNT || cheatInfo.type === 'time_up') ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="bold">
                {cheatInfo.type === 'time_up' 
                  ? "Le temps imparti est écoulé. L'examen va être soumis automatiquement."
                  : `Cet examen va être terminé en raison de violations multiples (${cheatInfo.cheatCount}/${MAX_CHEAT_COUNT}). Vous devrez reprendre le module depuis le début.`}
              </Typography>
              {expulsionCountdown !== null && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Redirection dans {expulsionCountdown} secondes...
                </Typography>
              )}
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="bold">
                Avertissement: Infraction {cheatInfo?.cheatCount || 1}/{MAX_CHEAT_COUNT} détectée.
              </Typography>
            </Alert>
          )}
          
          <DialogContentText id="cheat-alert-dialog-description">
            {cheatInfo?.type === 'time_up' ? (
              <Typography variant="body1" paragraph>
                Votre temps d'examen est terminé. Toutes vos réponses actuelles seront automatiquement soumises.
              </Typography>
              ) : (
              <>
                <Typography variant="body1" paragraph>
                  Un comportement suspect a été détecté pendant l'examen. 
                  Cela peut inclure :
                </Typography>
                
                <ul>
                  <li>Plusieurs visages détectés dans le champ de la caméra</li>
                  <li>Changement de fenêtre ou d'onglet</li>
                  <li>Sortie de la page d'examen pendant plus de 5 secondes</li>
                  <li>Absence de visage dans le champ de la caméra</li>
                  <li>Document, livre ou cahier détecté dans le champ de la caméra</li>
                  <li>Mouvements suspects ou position incorrecte</li>
                  <li>Yeux couverts ou non visibles</li>
                </ul>

                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Détails de la violation :
                </Typography>
                
                {cheatInfo && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #ddd' }}>
                    <Typography variant="body2">
                      <strong>Type :</strong> {formatCheatType(cheatInfo.type)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Message :</strong> {cheatInfo.message}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Horodatage :</strong> {new Date(cheatInfo.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color={cheatInfo.cheatCount >= MAX_CHEAT_COUNT ? "error.main" : "warning.main"} fontWeight="bold">
                      <strong>Infractions :</strong> {cheatInfo.cheatCount}/{MAX_CHEAT_COUNT}
                    </Typography>
                  </Box>
                )}

                {cheatInfo && cheatInfo.cheatCount >= MAX_CHEAT_COUNT ? (
                  <>
                    <Typography variant="body1" sx={{ mt: 3 }}>
                      Vous avez atteint le nombre maximum d'infractions autorisées.
                      Vous allez être redirigé et devrez reprendre le module depuis le début.
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" sx={{ mt: 3 }}>
                    Veuillez respecter les règles de l'examen. À la troisième infraction, 
                    vous serez automatiquement expulsé de l'examen et devrez reprendre le module depuis le début.
                  </Typography>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {cheatInfo?.type === 'time_up' ? (
            <Button 
              onClick={() => {
                navigate('/results?timeExpired=true');
              }} 
              color="primary" 
              variant="contained"
              autoFocus
            >
              Voir les résultats
            </Button>
          ) : cheatInfo && cheatInfo.cheatCount >= MAX_CHEAT_COUNT ? (
            <Button 
              onClick={handleExpulsion} 
              color="error" 
              variant="contained"
              autoFocus
            >
              QUITTER L'EXAMEN
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleCloseCheatDialog} 
                color="primary"
                variant="outlined"
              >
                J'ai compris
              </Button>
              <Button 
                onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir quitter l'examen ? Cette action est irréversible.")) {
                    navigate('/');
                  }
                }} 
                color="error"
              >
                Quitter l'examen
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExamPage;