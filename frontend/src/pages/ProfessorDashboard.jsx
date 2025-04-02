// src/pages/ProfessorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon
} from '@mui/material';
import { 
  Book as BookIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfessorDashboard = ({ toggleDarkMode, darkMode }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalQuizzes: 0,
    totalExams: 0,
    totalStudents: 0
  });
  
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    // Fonction pour charger les données du professeur
    const loadProfessorData = async () => {
      try {
        setLoading(true);
        
        // Ces appels API sont des exemples et devront être adaptés à votre backend
        // Vous pouvez commencer par des données fictives en attendant
        
        // const statsResponse = await axios.get('/professors/stats');
        // const coursesResponse = await axios.get('/professors/courses');
        // const examsResponse = await axios.get('/professors/exams');
        
        // Données fictives pour simulation
        setStats({
          totalCourses: 12,
          totalQuizzes: 24,
          totalExams: 8,
          totalStudents: 156
        });
        
        setCourses([
          { id: 1, title: 'Introduction à la Programmation', students: 45, lastUpdated: '2025-03-15' },
          { id: 2, title: 'Structures de Données', students: 38, lastUpdated: '2025-03-10' },
          { id: 3, title: 'Algorithmes Avancés', students: 26, lastUpdated: '2025-03-05' }
        ]);
        
        setExams([
          { id: 1, title: 'Examen final: Programmation', date: '2025-04-15', participants: 42 },
          { id: 2, title: 'QCM: Structures de Données', date: '2025-04-05', participants: 35 }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    
    loadProfessorData();
  }, []);
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: darkMode ? 'background.default' : '#f5f7fb',
      color: 'text.primary'
    }}>
      {/* Header */}
      <Box 
        component="header" 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          boxShadow: 1,
          mb: 3
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Skill<span style={{ color: '#ff9900' }}>Path</span> Professeur
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={toggleDarkMode}
              >
                {darkMode ? 'Mode Clair' : 'Mode Sombre'}
              </Button>
              
              <Button 
                variant="contained"
                color="error"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
              >
                Déconnexion
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Contenu principal */}
      <Container maxWidth="xl">
        {/* Message de bienvenue */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Bonjour, {user?.firstName || 'Professeur'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue sur votre tableau de bord. Gérez vos cours, créez des examens et suivez vos étudiants.
          </Typography>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BookIcon sx={{ fontSize: 48, color: '#ff9900', mb: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalCourses}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cours Créés
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalQuizzes}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                QCM Créés
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalExams}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Examens Créés
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 48, color: '#673ab7', mb: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalStudents}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Étudiants Inscrits
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Actions Rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Actions Rapides
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<AddIcon />}
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      bgcolor: '#ff9900',
                      '&:hover': { bgcolor: '#e68a00' }
                    }}
                    onClick={() => navigate('/create-course')}
                  >
                    Créer un Cours
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<AddIcon />}
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#3d8b40' }
                    }}
                    onClick={() => navigate('/create-quiz')}
                  >
                    Créer un QCM
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<AddIcon />}
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      bgcolor: '#2196f3',
                      '&:hover': { bgcolor: '#1976d2' }
                    }}
                    onClick={() => navigate('/create-exam')}
                  >
                    Créer un Examen
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<AnalyticsIcon />}
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      bgcolor: '#673ab7',
                      '&:hover': { bgcolor: '#5e35b1' }
                    }}
                    onClick={() => navigate('/student-progress')}
                  >
                    Suivi des Étudiants
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Cours et Examens */}
        <Grid container spacing={3}>
          {/* Mes Cours */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Mes Cours
                </Typography>
                
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => navigate('/my-courses')}
                >
                  Voir Tout
                </Button>
              </Box>
              
              <List>
                {courses.map((course) => (
                  <React.Fragment key={course.id}>
                    <ListItem>
                      <ListItemIcon>
                        <BookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={course.title} 
                        secondary={`${course.students} étudiants • Mis à jour le: ${course.lastUpdated}`}
                      />
                      <Button variant="outlined" size="small">
                        Éditer
                      </Button>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
          
          {/* Examens à venir */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Examens à Venir
                </Typography>
                
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => navigate('/my-exams')}
                >
                  Voir Tout
                </Button>
              </Box>
              
              <List>
                {exams.map((exam) => (
                  <React.Fragment key={exam.id}>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={exam.title} 
                        secondary={`Date: ${exam.date} • ${exam.participants} participants`}
                      />
                      <Button variant="outlined" size="small">
                        Détails
                      </Button>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfessorDashboard;