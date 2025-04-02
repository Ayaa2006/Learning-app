import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid,
  Card, 
  CardContent,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GradingIcon from '@mui/icons-material/Grading';

/**
 * Page de résultats d'examen
 * Affiche le score, les réponses, et les incidents de triche détectés
 */
function ExamResultsPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const location = useLocation();
  
  // Récupérer des données de l'URL si présentes (par exemple examId et si l'examen a été terminé par expulsion)
  const searchParams = new URLSearchParams(location.search);
  const wasExpelled = searchParams.get("expelled") === "true";
  const timeExpired = searchParams.get("timeExpired") === "true";
  
  // États des résultats
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);
  const [cheatIncidents, setCheatIncidents] = useState([]);
  const [error, setError] = useState(null);
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  
  // Récupération des données de l'examen et des incidents
  useEffect(() => {
    // Simuler un temps de chargement
    setTimeout(() => {
      try {
        // Dans une implémentation réelle, ce serait un appel API
        // Ici nous simulons les données
        const mockExamData = {
          id: examId || "EX-2023-123",
          title: "Introduction à l'Informatique",
          moduleId: "MOD-INFO-101",
          moduleName: "Fondements de l'informatique",
          date: new Date().toISOString(),
          duration: "01:15:23", // Temps passé
          maxDuration: "01:30:00", // Temps maximum autorisé
          score: wasExpelled ? 0 : 78, // 0 si expulsé, sinon score réel
          passingScore: 70,
          status: wasExpelled ? "EXPULSÉ" : timeExpired ? "TEMPS ÉCOULÉ" : "TERMINÉ",
          questions: [
            {
              id: 1,
              text: "Quelle est la capitale de la France ?",
              userAnswer: "c",
              correctAnswer: "c",
              isCorrect: true
            },
            {
              id: 2,
              text: "Quel est le plus grand océan du monde ?",
              userAnswer: "b",
              correctAnswer: "b",
              isCorrect: true
            },
            {
              id: 3,
              text: "Quelle est la formule chimique de l'eau ?",
              userAnswer: "a",
              correctAnswer: "a",
              isCorrect: true
            },
            {
              id: 4,
              text: "Qui a peint la Joconde ?",
              userAnswer: "b",
              correctAnswer: "c",
              isCorrect: false
            },
            {
              id: 5,
              text: "Quel est l'élément chimique le plus abondant dans l'univers ?",
              userAnswer: "a",
              correctAnswer: "c",
              isCorrect: false
            }
          ],
          openEndedResponse: {
            question: "Expliquez la différence entre la RAM et le disque dur en termes de persistance des données.",
            answer: "La RAM (Random Access Memory) est une mémoire volatile qui perd son contenu lorsque l'ordinateur est éteint, tandis que le disque dur est une mémoire non volatile qui conserve les données même sans alimentation électrique. La RAM est utilisée pour le stockage temporaire pendant l'exécution des programmes, alors que le disque dur sert au stockage à long terme des données et des programmes.",
            score: 8, // Sur 10
            feedback: "Bonne explication, mais manque de détails sur les différences de performance."
          }
        };

        // Simuler des incidents de triche
        const mockCheatIncidents = wasExpelled ? [
          {
            type: "window_change",
            message: "Changement de fenêtre #1 détecté",
            timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
            severity: "warning"
          },
          {
            type: "no_face",
            message: "Aucun visage détecté dans le cadre",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
            severity: "warning"
          },
          {
            type: "multiple_faces",
            message: "2 visages détectés dans le cadre",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            severity: "error"
          }
        ] : [];

        setExamData(mockExamData);
        setCheatIncidents(mockCheatIncidents);
        
        // Vérifier si un certificat est disponible
        const hasPassed = mockExamData.score >= mockExamData.passingScore;
        setCertificateAvailable(hasPassed && !wasExpelled);
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des résultats:", err);
        setError("Impossible de charger les résultats de l'examen. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    }, 1800);
  }, [examId, wasExpelled, timeExpired]);

  // Calcul des statistiques
  const calculateStats = () => {
    if (!examData) return { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };
    
    const totalQuestions = examData.questions.length;
    const correctAnswers = examData.questions.filter(q => q.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    return { totalQuestions, correctAnswers, accuracy };
  };
  
  const stats = calculateStats();

  // Générer un certificat (simulation)
  const handleGenerateCertificate = () => {
    alert("Génération du certificat en cours...\nCette fonctionnalité serait connectée à un service de génération de PDF dans une implémentation réelle.");
    // Dans une implémentation réelle, cela déclencherait un appel API pour générer un PDF
  };

  // Rediriger vers la page d'accueil
  const handleGoHome = () => {
    navigate('/');
  };

  // Rediriger vers le tableau de bord des modules
  const handleGoToModules = () => {
    navigate('/modules');
  };

  // Afficher l'écran de chargement
  if (loading) {
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
            Calcul des résultats en cours...
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Veuillez patienter pendant que nous analysons vos réponses
          </Typography>
          <LinearProgress sx={{ height: 8, borderRadius: 1, mb: 2 }} />
        </Box>
      </Box>
    );
  }

  // Afficher l'erreur si présente
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
        >
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      {/* En-tête */}
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleGoHome} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              Résultats d'Examen
            </Typography>
            {examData && (
              <Typography variant="subtitle2" color="text.secondary">
                {examData.title} - {new Date(examData.date).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          
          {/* Afficher le statut avec un chip approprié */}
          {examData && (
            <Chip 
              label={examData.status} 
              color={
                examData.status === 'EXPULSÉ' ? 'error' : 
                examData.status === 'TEMPS ÉCOULÉ' ? 'warning' : 
                examData.score >= examData.passingScore ? 'success' : 'error'
              }
              icon={
                examData.status === 'EXPULSÉ' ? <CancelIcon /> : 
                examData.status === 'TEMPS ÉCOULÉ' ? <WarningIcon /> : 
                examData.score >= examData.passingScore ? <CheckCircleIcon /> : <CancelIcon />
              }
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Colonne de gauche - Résumé et Actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              {/* Carte du score */}
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Résultat global
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Score */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: examData && examData.score >= examData.passingScore ? 'success.light' : 'error.light',
                    color: 'white',
                    mb: 2
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {examData && `${examData.score}%`}
                    </Typography>
                    <Typography variant="body2">
                      {examData && examData.score >= examData.passingScore 
                        ? "Félicitations, vous avez réussi !" 
                        : "Vous n'avez pas atteint le score minimum."}
                    </Typography>
                  </Box>
                  
                  {/* Informations supplémentaires */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Score minimum requis:</span>
                      <span><strong>{examData && `${examData.passingScore}%`}</strong></span>
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Temps utilisé:</span>
                      <span><strong>{examData && examData.duration}</strong></span>
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Statut:</span>
                      <span><strong>{examData && examData.status}</strong></span>
                    </Typography>
                  </Box>
                  
                  {/* Alerte en cas d'expulsion */}
                  {wasExpelled && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Cet examen a été terminé suite à des violations des règles de surveillance.
                    </Alert>
                  )}
                  
                  {/* Alerte en cas de temps expiré */}
                  {timeExpired && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Cet examen a été soumis automatiquement car le temps imparti était écoulé.
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              {/* Statistiques */}
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistiques
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Questions QCM correctes: {stats.correctAnswers}/{stats.totalQuestions}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.accuracy} 
                      color={stats.accuracy >= 70 ? "success" : "error"}
                      sx={{ height: 8, borderRadius: 1, mb: 1 }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                      Précision: {stats.accuracy.toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Réponse ouverte: {examData?.openEndedResponse.score}/10
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={examData ? (examData.openEndedResponse.score / 10) * 100 : 0} 
                      color={examData && examData.openEndedResponse.score >= 7 ? "success" : "warning"}
                      sx={{ height: 8, borderRadius: 1, mb: 1 }} 
                    />
                  </Box>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}>
                    {certificateAvailable && (
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleGenerateCertificate}
                        fullWidth
                      >
                        Télécharger le certificat
                      </Button>
                    )}
                    
                    <Button 
                      variant="contained" 
                      startIcon={<GradingIcon />}
                      onClick={handleGoToModules}
                      fullWidth
                    >
                      Retour aux modules
                    </Button>
                    
                    {(wasExpelled || (examData && examData.score < examData.passingScore)) && (
                      <Button 
                        variant="outlined" 
                        color="warning"
                        onClick={() => navigate(`/exams/${examId}/restart`)}
                        fullWidth
                      >
                        Repasser l'examen
                      </Button>
                    )}
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<HomeIcon />}
                      onClick={handleGoHome}
                      fullWidth
                    >
                      Accueil
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Colonne de droite - Détails des réponses et incidents */}
          <Grid item xs={12} md={8}>
            {/* Réponses aux questions */}
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Détail des réponses
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {examData && examData.questions.map((question, index) => (
                    <ListItem 
                      key={question.id} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        borderRadius: 1, 
                        bgcolor: question.isCorrect ? 'success.light' : 'error.light',
                        color: 'white'
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        {question.isCorrect ? (
                          <CheckCircleIcon fontSize="large" />
                        ) : (
                          <CancelIcon fontSize="large" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Question {index + 1}: {question.text}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1, color: 'rgba(255,255,255,0.85)' }}>
                            <Typography variant="body2">
                              Votre réponse: {question.userAnswer} {question.isCorrect ? '✓' : '✗'}
                            </Typography>
                            {!question.isCorrect && (
                              <Typography variant="body2">
                                Réponse correcte: {question.correctAnswer}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                {/* Réponse ouverte */}
                {examData && examData.openEndedResponse && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                    <Typography variant="h6" gutterBottom>
                      Réponse ouverte
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Question:</strong> {examData.openEndedResponse.question}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      <strong>Votre réponse:</strong>
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'white' }}>
                      <Typography variant="body2">
                        {examData.openEndedResponse.answer}
                      </Typography>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        <strong>Score:</strong> {examData.openEndedResponse.score}/10
                      </Typography>
                      <Chip 
                        label={examData.openEndedResponse.score >= 7 ? "Satisfaisant" : "À améliorer"} 
                        color={examData.openEndedResponse.score >= 7 ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <strong>Commentaire:</strong> {examData.openEndedResponse.feedback}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
            
            {/* Incidents de triche */}
            {cheatIncidents.length > 0 && (
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Incidents de surveillance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Des violations des règles de surveillance ont été détectées pendant l'examen, ce qui a entraîné l'annulation des résultats.
                  </Alert>
                  
                  <List>
                    {cheatIncidents.map((incident, index) => (
                      <ListItem 
                        key={index} 
                        sx={{ 
                          mb: 1, 
                          p: 1.5, 
                          borderRadius: 1, 
                          bgcolor: incident.severity === 'error' ? 'error.light' : 'warning.light',
                          color: 'white'
                        }}
                      >
                        <ListItemIcon sx={{ color: 'white' }}>
                          {incident.severity === 'error' ? (
                            <CancelIcon />
                          ) : (
                            <WarningIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {incident.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                              {new Date(incident.timestamp).toLocaleString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ExamResultsPage;