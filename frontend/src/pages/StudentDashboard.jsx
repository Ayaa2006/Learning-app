// src/pages/StudentDashboard.jsx
import React from 'react';
import UserLayout from '../components/layouts/UserLayout';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActionArea, 
  Button, 
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { 
  PlayCircleFilled as PlayCircleFilledIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowForward as ArrowForwardIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Données fictives pour le tableau de bord étudiant
const studentData = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: "/images/avatar.jpg",
  currentModule: {
    id: 3,
    title: "Structures Conditionnelles",
    progress: 40,
    nextLesson: "Switch et structures avancées"
  },
  stats: {
    completedCourses: 12,
    completedQuizzes: 8,
    totalPoints: 1250,
    hoursSpent: 28,
    consecutiveDays: 5
  },
  upcomingEvents: [
    { id: 1, title: "Examen Final: Structures Conditionnelles", date: "2025-03-25", type: "exam" },
    { id: 2, title: "Session de support: Boucles et Itérations", date: "2025-03-22", type: "support" }
  ],
  recentActivities: [
    { id: 1, title: "Cours: If/Else et opérateurs logiques", date: "2025-03-18", type: "course" },
    { id: 2, title: "Quiz: If/Else", date: "2025-03-18", type: "quiz", score: 92 },
    { id: 3, title: "Examen: Variables et Types", date: "2025-03-15", type: "exam", score: 88 }
  ],
  recommendations: [
    { id: 1, title: "Structures de contrôle avancées", type: "course" },
    { id: 2, title: "Challenge: Logique conditionnelle", type: "challenge" },
    { id: 3, title: "Exercices pratiques sur les conditions", type: "practice" }
  ],
  achievements: [
    { id: 1, title: "Première semaine complète", description: "Connecté 7 jours consécutifs", icon: "streak" },
    { id: 2, title: "Quiz parfait", description: "Obtenu 100% sur un quiz", icon: "quiz" },
    { id: 3, title: "Premier module", description: "Complété votre premier module", icon: "module" }
  ]
};

const StudentDashboard = () => {
  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Bonjour, {studentData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenue sur votre tableau de bord personnalisé
            </Typography>
          </Box>
          <Avatar 
            src={studentData.avatar} 
            alt={studentData.name}
            sx={{ width: 64, height: 64 }}
          />
        </Box>
        
        <Grid container spacing={3}>
          {/* Progression actuelle */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Votre progression actuelle
                  </Typography>
                  <Typography variant="body1">
                    Module: {studentData.currentModule.title}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/progress"
                >
                  Continuer l'apprentissage
                </Button>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Progression du module
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {studentData.currentModule.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={studentData.currentModule.progress} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <PlayCircleFilledIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Prochain cours: {studentData.currentModule.nextLesson}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Statistiques */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Vos statistiques
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {studentData.stats.completedCourses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cours complétés
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {studentData.stats.completedQuizzes}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quiz réussis
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {studentData.stats.totalPoints}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Points accumulés
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(103, 58, 183, 0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        {studentData.stats.hoursSpent}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Temps d'apprentissage
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>{studentData.stats.consecutiveDays} jours</strong> consécutifs d'apprentissage
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Événements à venir */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Événements à venir
              </Typography>
              
              <List>
                {studentData.upcomingEvents.map((event) => (
                  <ListItem key={event.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {event.type === 'exam' ? (
                        <SchoolIcon color="warning" />
                      ) : (
                        <CalendarTodayIcon color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={event.title} 
                      secondary={`Date: ${event.date}`}
                    />
                    <Button variant="outlined" size="small">
                      Rappel
                    </Button>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForwardIcon />}
                >
                  Voir tous les événements
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Activités récentes */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Activités récentes
              </Typography>
              
              <List>
                {studentData.recentActivities.map((activity) => (
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
                    {activity.score && (
                      <Chip 
                        label={`${activity.score}%`} 
                        color={activity.score >= 80 ? "success" : activity.score >= 60 ? "warning" : "error"}
                        size="small"
                      />
                    )}
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForwardIcon />}
                >
                  Voir toutes les activités
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Recommandations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recommandé pour vous
              </Typography>
              
              <Grid container spacing={2}>
                {studentData.recommendations.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card variant="outlined">
                      <CardActionArea sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            mr: 2, 
                            bgcolor: 'primary.light', 
                            borderRadius: '50%', 
                            width: 40, 
                            height: 40, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            {item.type === 'course' && <PlayCircleFilledIcon sx={{ color: 'white' }} />}
                            {item.type === 'challenge' && <EmojiEventsIcon sx={{ color: 'white' }} />}
                            {item.type === 'practice' && <AssignmentIcon sx={{ color: 'white' }} />}
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.type === 'course' && 'Cours recommandé'}
                              {item.type === 'challenge' && 'Challenge pour tester vos compétences'}
                              {item.type === 'practice' && 'Exercices pratiques'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          
          {/* Accomplissements */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Vos accomplissements
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {studentData.achievements.map((achievement) => (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          mb: 2, 
                          mx: 'auto', 
                          bgcolor: 'primary.main', 
                          borderRadius: '50%', 
                          width: 60, 
                          height: 60, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          {achievement.icon === 'streak' && <TimelineIcon sx={{ color: 'white', fontSize: 30 }} />}
                          {achievement.icon === 'quiz' && <AssignmentIcon sx={{ color: 'white', fontSize: 30 }} />}
                          {achievement.icon === 'module' && <BookmarkIcon sx={{ color: 'white', fontSize: 30 }} />}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  endIcon={<ArrowForwardIcon />}
                >
                  Voir tous les badges
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;