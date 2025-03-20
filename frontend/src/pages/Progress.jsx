// src/pages/Progress.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  Stars as StarsIcon
} from '@mui/icons-material';

// Données fictives pour la progression
const mockUserProgress = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  totalProgress: 65,
  points: 1250,
  badges: 8,
  completedModules: 2,
  totalModules: 5,
  currentModule: {
    id: 3,
    title: "Structures Conditionnelles",
    progress: 40,
    courses: [
      { id: 1, title: "Introduction aux conditions", completed: true, duration: "45 min" },
      { id: 2, title: "If/Else et opérateurs logiques", completed: true, duration: "60 min" },
      { id: 3, title: "Switch et structures avancées", completed: false, duration: "50 min", current: true },
      { id: 4, title: "Bonnes pratiques et optimisation", completed: false, duration: "40 min" }
    ],
    quizzes: [
      { id: 1, title: "Quiz: Introduction aux conditions", completed: true, score: 85 },
      { id: 2, title: "Quiz: If/Else", completed: true, score: 92 },
      { id: 3, title: "Quiz: Switch", completed: false }
    ],
    finalExam: {
      id: 1,
      title: "Examen Final: Structures Conditionnelles",
      completed: false,
      available: false
    }
  },
  modules: [
    { id: 1, title: "Introduction à la Programmation", progress: 100, completed: true },
    { id: 2, title: "Variables et Types de Données", progress: 100, completed: true },
    { id: 3, title: "Structures Conditionnelles", progress: 40, current: true },
    { id: 4, title: "Boucles et Itérations", progress: 0, locked: true },
    { id: 5, title: "Fonctions et Procédures", progress: 0, locked: true }
  ],
  lastActivities: [
    { id: 1, type: "course", title: "If/Else et opérateurs logiques", date: "2025-03-18", score: null },
    { id: 2, type: "quiz", title: "Quiz: If/Else", date: "2025-03-18", score: 92 },
    { id: 3, type: "exam", title: "Examen Final: Variables et Types", date: "2025-03-15", score: 88 }
  ]
};

const Progress = () => {
  const [activeStep, setActiveStep] = useState(
    mockUserProgress.currentModule.courses.findIndex(course => course.current) || 0
  );
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getModuleStatusColor = (module) => {
    if (module.completed) return 'success';
    if (module.current) return 'primary';
    if (module.locked) return 'default';
    return 'info';
  };

  const getModuleStatusText = (module) => {
    if (module.completed) return 'Complété';
    if (module.current) return 'En cours';
    if (module.locked) return 'Verrouillé';
    return 'À venir';
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Colonne de gauche: Profil et progression globale */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {mockUserProgress.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {mockUserProgress.email}
                </Typography>
                <Chip 
                  icon={<StarsIcon />} 
                  label={`${mockUserProgress.points} Points`} 
                  color="primary" 
                  sx={{ mt: 1 }}
                />
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Progression globale
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Progression totale
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {mockUserProgress.totalProgress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={mockUserProgress.totalProgress} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2">
                  Modules complétés: {mockUserProgress.completedModules}/{mockUserProgress.totalModules}
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Tous les modules
              </Typography>
              
              <List>
                {mockUserProgress.modules.map((module) => (
                  <Paper 
                    key={module.id} 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      bgcolor: module.current ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      border: module.current ? '1px solid rgba(25, 118, 210, 0.2)' : 'none'
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        {module.completed ? (
                          <CheckCircleIcon color="success" />
                        ) : module.current ? (
                          <PlayCircleFilledIcon color="primary" />
                        ) : (
                          <AssignmentIcon color={module.locked ? "disabled" : "action"} />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={module.title} 
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={module.progress} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {module.progress}%
                              </Typography>
                              <Chip 
                                label={getModuleStatusText(module)} 
                                size="small" 
                                color={getModuleStatusColor(module)}
                                sx={{ height: 20 }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Paper>
          </Grid>
          
          {/* Colonne de droite: Module actuel et activités récentes */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Module actuel: {mockUserProgress.currentModule.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={mockUserProgress.currentModule.progress} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {mockUserProgress.currentModule.progress}%
                </Typography>
              </Box>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {mockUserProgress.currentModule.courses.map((course, index) => (
                  <Step key={course.id}>
                    <StepLabel
                      optional={
                        <Typography variant="caption" display="block" color="text.secondary">
                          <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {course.duration}
                        </Typography>
                      }
                    >
                      <Typography sx={{ fontWeight: course.current ? 'bold' : 'normal' }}>
                        {course.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === mockUserProgress.currentModule.courses.length - 1
                            ? 'Terminer'
                            : 'Continuer'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Retour
                        </Button>
                      </Box>
                      
                      {/* Afficher le quiz correspondant au cours */}
                      {mockUserProgress.currentModule.quizzes[index] && (
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                              Quiz associé
                            </Typography>
                            <Typography variant="body1">
                              {mockUserProgress.currentModule.quizzes[index].title}
                            </Typography>
                            {mockUserProgress.currentModule.quizzes[index].completed && (
                              <Typography variant="body2" color="success.main">
                                Score: {mockUserProgress.currentModule.quizzes[index].score}%
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button size="small" color="primary">
                              {mockUserProgress.currentModule.quizzes[index].completed ? 'Revoir' : 'Commencer'}
                            </Button>
                          </CardActions>
                        </Card>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              {/* Examen final */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Examen Final
                </Typography>
                <Card variant={mockUserProgress.currentModule.finalExam.available ? "outlined" : "elevation"}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {mockUserProgress.currentModule.finalExam.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {mockUserProgress.currentModule.finalExam.available 
                        ? "Disponible lorsque tous les cours et quiz sont terminés"
                        : "L'examen sera disponible lorsque tous les cours et quiz seront terminés"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      disabled={!mockUserProgress.currentModule.finalExam.available}
                    >
                      Passer l'examen
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Activités récentes
              </Typography>
              
              <List>
                {mockUserProgress.lastActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {activity.type === 'course' && <PlayCircleFilledIcon color="primary" />}
                      {activity.type === 'quiz' && <AssignmentIcon color="secondary" />}
                      {activity.type === 'exam' && <SchoolIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.title}
                      secondary={`${activity.date}`}
                    />
                    <ListItemSecondaryAction>
                      {activity.score !== null && (
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {activity.score}%
                        </Typography>
                      )}
                      <IconButton edge="end" color="primary">
                        <ArrowForwardIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Progress;