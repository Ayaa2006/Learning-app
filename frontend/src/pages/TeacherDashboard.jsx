// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Card, 
  CardContent, 
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Assignment as AssignmentIcon, 
  Quiz as QuizIcon, 
  BookmarkAdd as BookmarkAddIcon,
  DonutLarge as DonutLargeIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  SupervisorAccount as TeacherIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import AdminLayout from '../components/layouts/TeacherLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';

const TeacherDashboard = ({ toggleDarkMode, darkMode }) => {
  const { user, hasPermission, ROLES, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const navigate = useNavigate();

  // Effet pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await adminService.getTeacherDashboardStats();
        const dashboardData = response.data.data;
        
        setStats(dashboardData.stats);
        setMyCourses(dashboardData.myCourses || []);
        setMyQuizzes(dashboardData.myQuizzes || []);
        setStudentProgress(dashboardData.studentProgress || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Fonction pour créer un nouveau cours
  const handleCreateCourse = () => {
    navigate('/admin-courses/create');
  };
  
  // Fonction pour créer un nouveau QCM
  const handleCreateQuiz = () => {
    navigate('/admin-qcm/create');
  };
  
  // Fonction pour créer un nouvel examen
  const handleCreateExam = () => {
    navigate('/admin-exams/create');
  };
  
  // Composant pour les cartes statistiques
  const StatCard = ({ icon, value, label, color }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {icon}
      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
  
  
  return (
    <AdminLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Tableau de Bord Enseignant
            </Typography>
            <Chip 
              label={user?.name || 'Professeur'} 
              color="success"
              icon={<TeacherIcon />}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress sx={{ color: '#ff9900' }} />
            </Box>
          ) : (
            <>
              {/* Actions rapides */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Actions rapides
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateCourse}
                      sx={{ 
                        p: 1.5,
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        '&:hover': { borderColor: '#2e7d32', color: '#2e7d32', bgcolor: 'rgba(76, 175, 80, 0.04)' }
                      }}
                    >
                      Créer un nouveau cours
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateQuiz}
                      sx={{ 
                        p: 1.5,
                        borderColor: '#2196f3',
                        color: '#2196f3',
                        '&:hover': { borderColor: '#0d47a1', color: '#0d47a1', bgcolor: 'rgba(33, 150, 243, 0.04)' }
                      }}
                    >
                      Créer un nouveau QCM
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateExam}
                      sx={{ 
                        p: 1.5,
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        '&:hover': { borderColor: '#e65100', color: '#e65100', bgcolor: 'rgba(255, 152, 0, 0.04)' }
                      }}
                    >
                      Créer un nouvel examen
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            
              {/* Statistiques générales */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    icon={<AssignmentIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />}
                    value={stats?.totalCourses || 0}
                    label="Mes Cours"
                    color="#4caf50"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    icon={<QuizIcon sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />}
                    value={stats?.totalQuizzes || 0}
                    label="Mes QCM"
                    color="#2196f3"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    icon={<AssessmentIcon sx={{ fontSize: 48, color: '#ff9800', mb: 1 }} />}
                    value={stats?.totalExams || 0}
                    label="Mes Examens"
                    color="#ff9800"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    icon={<PersonIcon sx={{ fontSize: 48, color: '#673ab7', mb: 1 }} />}
                    value={stats?.totalStudents || 0}
                    label="Étudiants Inscrits"
                    color="#673ab7"
                  />
                </Grid>
              </Grid>
              
              {/* Trois colonnes de contenus */}
              <Grid container spacing={4}>
                {/* Colonne de gauche */}
                <Grid item xs={12} md={4}>
                  {/* Carte Profil et Déconnexion */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Mon Profil
                      </Typography>
                      <IconButton size="small">
                        <SettingsIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mb: 2,
                          bgcolor: '#4caf50'
                        }}
                      >
                        {user?.name?.charAt(0) || <AccountCircleIcon />}
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {user?.name || 'Professeur'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {user?.email || 'prof@skillpath.com'}
                      </Typography>
                      
                      <Chip 
                        label="Enseignant" 
                        color="success"
                        size="small"
                        sx={{ mb: 3 }}
                      />
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      Déconnexion
                    </Button>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Mes Cours
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={() => navigate('/admin-courses')}
                        color="success"
                      >
                        Tous mes cours
                      </Button>
                    </Box>
                    <List>
                      {myCourses.length > 0 ? (
                        myCourses.map((course) => (
                          <React.Fragment key={course.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{course.title}</Typography>
                                    <IconButton size="small" color="primary">
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )} 
                                secondary={`${course.enrolledStudents} étudiants • Créé le ${course.createdAt}`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucun cours disponible
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Paper>
                </Grid>
                
                {/* Colonne du milieu */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Mes QCM
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<QuizIcon />}
                        onClick={() => navigate('/admin-qcm')}
                        color="primary"
                      >
                        Tous mes QCM
                      </Button>
                    </Box>
                    <List>
                      {myQuizzes.length > 0 ? (
                        myQuizzes.map((quiz) => (
                          <React.Fragment key={quiz.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{quiz.title}</Typography>
                                    <Box>
                                      <Tooltip title="Modifier">
                                        <IconButton size="small" sx={{ ml: 1 }} color="primary">
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Voir les résultats">
                                        <IconButton size="small" sx={{ ml: 0.5 }} color="success">
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                )} 
                                secondary={`${quiz.questions} questions • ${quiz.completions} complétions`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucun QCM disponible
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Mes Examens
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<AssessmentIcon />}
                        onClick={() => navigate('/admin-exams')}
                        sx={{ color: '#ff9800', borderColor: '#ff9800' }}
                      >
                        Tous mes examens
                      </Button>
                    </Box>
                    <List>
                      {stats?.exams && stats.exams.length > 0 ? (
                        stats.exams.map((exam) => (
                          <React.Fragment key={exam.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{exam.title}</Typography>
                                    <Chip 
                                      size="small" 
                                      label={exam.status}
                                      color={exam.status === 'Actif' ? 'success' : 'default'}
                                      variant="outlined"
                                    />
                                  </Box>
                                )} 
                                secondary={`${exam.module} • ${exam.date}`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucun examen disponible
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Paper>
                </Grid>
                
                {/* Colonne de droite */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Progression des Étudiants
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<TrendingUpIcon />}
                        onClick={() => navigate('/admin/analytics')}
                      >
                        Détails
                      </Button>
                    </Box>
                    <Box sx={{ height: 300, overflowY: 'auto', p: 2 }}>
                      {studentProgress.length > 0 ? (
                        studentProgress.map((student, index) => (
                          <Card key={index} sx={{ mb: 2, borderLeft: '4px solid #4caf50' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="div">
                                  {student.name}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={`${student.progress}%`}
                                  color={student.progress > 75 ? 'success' : 'warning'}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {student.email} • Module: {student.currentModule}
                              </Typography>
                              <Box sx={{ 
                                height: 6, 
                                bgcolor: '#e0e0e0', 
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden'
                              }}>
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  height: '100%',
                                  width: `${student.progress}%`,
                                  bgcolor: student.progress > 75 ? '#4caf50' : '#ff9800',
                                  borderRadius: 3
                                }}/>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {student.completedModules} modules terminés
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Dernière activité: {student.lastActivity}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucune donnée de progression disponible
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default TeacherDashboard;