// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

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
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  TextField,
  Switch,
  Tooltip
} from '@mui/material';
import { 
  PlayCircleFilled as PlayCircleFilledIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowForward as ArrowForwardIcon,
  Bookmark as BookmarkIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Book as BookIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  DoNotDisturb as DoNotDisturbIcon,
  NightlightRound as DarkModeIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

// Pages principales pour la navigation
const pages = [
  { name: 'Mes cours', icon: <BookIcon />, path: '/courses' },
  { name: 'Progression', icon: <TimelineIcon />, path: '/progress' },
  { name: 'Certificate', icon: <SchoolIcon />, path: '/certificate' }
];

const StudentDashboard = () => {
  // Déclarations d'état
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "/images/avatar.jpg",
    language: "Français",
    role: "Étudiant",
    memberSince: "",
    lastLogin: "",
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
    upcomingEvents: [],
    recentActivities: [],
    recommendations: [],
    achievements: [],
    preferences: {
      emailNotifications: true,
      darkMode: false,
      showProgress: true,
      showAchievements: true,
      twoFactorAuth: false
    },
    notifications: [],
    certificates: [],
    courses: {
      completed: [],
      inProgress: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    language: ""
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Effet pour charger les données du profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Rediriger vers la page de connexion si pas de token
          navigate('/login');
          return;
        }
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log("Récupération du profil...");
        const response = await axios.get('/api/users/profile');
        console.log("Données reçues:", response.data);
        
        if (!response.data) {
          // Gérer le cas où aucune donnée n'est retournée
          console.error('Aucune donnée utilisateur récupérée');
          navigate('/login');
          return;
        }
  
        // Mise à jour avec les données réelles
        const userData = {
          name: response.data.name, // Supprimer les valeurs par défaut
          email: response.data.email,
          phone: response.data.phone || "+33 6 12 34 56 78",
          avatar: "/images/avatar.jpg",
          language: response.data.language || "Français",
          role: response.data.role || "STUDENT",
          memberSince: response.data.createdAt ? new Date(response.data.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : "",
          lastLogin: response.data.lastLogin ? new Date(response.data.lastLogin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Jamais",
          currentModule: {
            id: 3,
            title: "Structures Conditionnelles",
            progress: response.data.progress || 40,
            nextLesson: "Switch et structures avancées"
          },
          stats: {
            completedCourses: response.data.coursesCompleted || 12,
            completedQuizzes: 8,
            totalPoints: response.data.totalPoints || 1250,
            hoursSpent: 28,
            consecutiveDays: 5
          },
          // Conserver les autres données par défaut
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
          ],
          preferences: {
            emailNotifications: true,
            darkMode: false,
            showProgress: true,
            showAchievements: true,
            twoFactorAuth: false
          },
          notifications: [
            { id: 1, content: "Nouveau cours disponible: Structures avancées", date: "2025-03-18", read: false },
            { id: 2, content: "Votre certificat est prêt à être téléchargé", date: "2025-03-15", read: true }
          ],
          certificates: [
            { id: 1, title: "Introduction à la Programmation", issueDate: "2025-02-15" },
            { id: 2, title: "Variables et Types de Données", issueDate: "2025-03-08" }
          ],
          courses: {
            completed: [
              { id: 1, title: "Introduction à la Programmation", date: "2025-02-15" },
              { id: 2, title: "Variables et Types de Données", date: "2025-03-08" }
            ],
            inProgress: [
              { id: 3, title: "Structures Conditionnelles", progress: 40 }
            ]
          }
        };
        
       
        setStudentData(userData);
      setUserInfo({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        language: userData.language
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      // Gérer différents types d'erreurs
      if (error.response && error.response.status === 401) {
        // Token invalide, rediriger vers la connexion
        navigate('/login');
      }
      setLoading(false);
    }
  };
  
  fetchUserProfile();
}, [navigate]);

  // Ajouter une condition de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleNavigate = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };
  
  const handleChangeView = (view) => {
    setSelectedView(view);
    if (view === 'profile') {
      setTabValue(0); // Reset to first tab when switching to profile
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    setEditMode(false);
    console.log("Profil mis à jour:", userInfo);
  };
  
  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    console.log(`Préférence ${name} modifiée: ${checked}`);
  };

  // Rendu du tableau de bord principal
  const renderDashboard = () => (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Bonjour, {studentData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue sur votre tableau de bord personnalisé
          </Typography>
        </Box>
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
    </>
  );

  // Composants pour le profil utilisateur
  const renderProfileInfo = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Informations personnelles
        </Typography>
        <Button 
          startIcon={editMode ? null : <EditIcon />}
          onClick={handleEditToggle}
          color={editMode ? "error" : "primary"}
        >
          {editMode ? "Annuler" : "Modifier"}
        </Button>
      </Box>
      
      {editMode ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom complet"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Langue préférée"
              name="language"
              value={userInfo.language}
              onChange={handleInputChange}
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="Français">Français</option>
              <option value="English">English</option>
              <option value="Español">Español</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained"
                onClick={handleSaveProfile}
              >
                Enregistrer
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Nom complet"
              secondary={studentData.name}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={studentData.email}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary="Téléphone"
              secondary={studentData.phone}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Langue préférée"
              secondary={studentData.language}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Membre depuis"
              secondary={studentData.memberSince}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dernière connexion"
              secondary={studentData.lastLogin}
            />
          </ListItem>
        </List>
      )}
    </Paper>
  );
  
  const renderSecuritySettings = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Sécurité
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <VpnKeyIcon />
          </ListItemIcon>
          <ListItemText
            primary="Mot de passe"
            secondary="Dernière modification: il y a 2 mois"
          />
          <Button 
            variant="outlined" 
            size="small"
          >
            Modifier
          </Button>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText
            primary="Authentification à deux facteurs"
            secondary="Renforce la sécurité de votre compte"
          />
          <Switch 
            checked={studentData.preferences.twoFactorAuth} 
            onChange={handlePreferenceChange}
            name="twoFactorAuth"
            color="primary"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DoNotDisturbIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sessions actives"
            secondary="Gérer les appareils connectés"
          />
          <Button 
            variant="outlined" 
            size="small" 
            color="warning"
          >
            Voir
          </Button>
        </ListItem>
      </List>
    </Paper>
  );
  
  const renderNotificationSettings = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Notifications
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText
            primary="Notifications par email"
            secondary="Recevez les mises à jour par email"
          />
          <Switch 
            checked={studentData.preferences.emailNotifications} 
            onChange={handlePreferenceChange}
            name="emailNotifications"
            color="primary"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText
            primary="Nouveaux cours"
            secondary="Soyez informé des nouveaux cours disponibles"
          />
          <Switch 
            defaultChecked 
            onChange={handlePreferenceChange}
            name="newCourses"
            color="primary"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText
            primary="Rappels d'examens"
            secondary="Rappels pour les quiz et examens à venir"
          />
          <Switch 
            defaultChecked 
            onChange={handlePreferenceChange}
            name="examReminders"
            color="primary"
          />
        </ListItem>
      </List>
    </Paper>
  );
  
  const renderDisplaySettings = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Affichage
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Mode sombre"
            secondary="Changer l'apparence de l'interface"
          />
          <Switch 
            checked={studentData.preferences.darkMode} 
            onChange={handlePreferenceChange}
            name="darkMode"
            color="primary"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText
            primary="Afficher ma progression"
            secondary="Montrer votre progression sur le tableau de bord"
          />
          <Switch 
            checked={studentData.preferences.showProgress} 
            onChange={handlePreferenceChange}
            name="showProgress"
            color="primary"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Afficher mes accomplissements"
            secondary="Montrer vos badges et récompenses"
          />
          <Switch 
            checked={studentData.preferences.showAchievements} 
            onChange={handlePreferenceChange}
            name="showAchievements"
            color="primary"
          />
        </ListItem>
      </List>
    </Paper>
  );
  
  const renderCertificates = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Vos certificats
        </Typography>
        <Button 
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
        >
          Voir tous
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {studentData.certificates.map(cert => (
          <Grid item xs={12} md={6} key={cert.id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">
                  {cert.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Délivré le: {cert.issueDate}
              </Typography>
              <Button 
                variant="outlined"
                fullWidth
                size="small"
              >
                Afficher
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
  
  const renderNotifications = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Notifications récentes
      </Typography>
      
      <List>
        {studentData.notifications.map(notification => (
          <ListItem 
            key={notification.id}
            sx={{ 
              bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemIcon>
              <NotificationsIcon color={notification.read ? "action" : "primary"} />
            </ListItemIcon>
            <ListItemText
              primary={notification.content}
              secondary={notification.date}
              primaryTypographyProps={{
                fontWeight: notification.read ? 'normal' : 'bold'
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button 
          variant="text" 
          endIcon={<ArrowForwardIcon />}
        >
          Voir toutes les notifications
        </Button>
      </Box>
    </Paper>
  );

  // Rendu du profil utilisateur avec onglets
  const renderProfile = () => (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Mon profil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez vos informations personnelles et paramètres
          </Typography>
        </Box>
      </Box>
      
      <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Profil" />
          <Tab icon={<SettingsIcon />} label="Paramètres" />
          <Tab icon={<BookIcon />} label="Apprentissage" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              {renderProfileInfo()}
            </Grid>
            <Grid item xs={12} md={5}>
              {renderCertificates()}
            </Grid>
          </Grid>
        )}
        
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderSecuritySettings()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderNotificationSettings()}
            </Grid>
            <Grid item xs={12}>
              {renderDisplaySettings()}
            </Grid>
          </Grid>
        )}
        
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Votre apprentissage
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', height: '100%', textAlign: 'center', p: 2 }}>
                      <BookIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {studentData.stats.completedCourses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cours complétés
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', height: '100%', textAlign: 'center', p: 2 }}>
                      <SchoolIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {studentData.certificates.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Certificats obtenus
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', height: '100%', textAlign: 'center', p: 2 }}>
                      <SettingsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {studentData.courses.inProgress.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cours en cours
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                  Cours complétés
                </Typography>
                <List>
                  {studentData.courses.completed.map(course => (
                    <ListItem key={course.id}>
                      <ListItemIcon>
                        <BookIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={course.title}
                        secondary={`Complété le: ${course.date}`}
                      />
                      <Chip 
                        label="Complété" 
                        color="success" 
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                  Cours en progression
                </Typography>
                <List>
                  {studentData.courses.inProgress.map(course => (
                    <ListItem key={course.id}>
                      <ListItemIcon>
                        <BookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={course.title}
                        secondary={`Progression: ${course.progress}%`}
                      />
                      <Button 
                        variant="contained" 
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                      >
                        Continuer
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderNotifications()}
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Barre de navigation supérieure */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Version mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {page.icon}
                      <Typography textAlign="center" sx={{ ml: 1 }}>{page.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handleChangeView('profile')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon />
                    <Typography textAlign="center" sx={{ ml: 1 }}>Mon profil</Typography>
                  </Box>
                </MenuItem>
              </Menu>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, ml: 1 }}
              >
                SkillPath
              </Typography>
            </Box>
            
            {/* Version desktop */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 'bold', color: 'primary.main' }}
            >
              SkillPath
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavigate(page.path)}
                  sx={{ my: 2, display: 'flex', alignItems: 'center', color: 'text.primary', mr: 1 }}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              ))}
              <Button
                onClick={() => handleChangeView('profile')}
                sx={{ 
                  my: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: selectedView === 'profile' ? 'primary.main' : 'text.primary',
                  fontWeight: selectedView === 'profile' ? 'bold' : 'normal',
                  mr: 1
                }}
                startIcon={<PersonIcon />}
              >
                Mon profil
              </Button>
              <Button
                onClick={() => handleChangeView('dashboard')}
                sx={{ 
                  my: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: selectedView === 'dashboard' ? 'primary.main' : 'text.primary',
                  fontWeight: selectedView === 'dashboard' ? 'bold' : 'normal'
                }}
                startIcon={<DashboardIcon />}
              >
                Tableau de bord
              </Button>
            </Box>

            {/* Menu utilisateur et notifications */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton sx={{ mr: 1 }} color="inherit">
                <Badge badgeContent={studentData.notifications.filter(n => !n.read).length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Tooltip title="Paramètres du compte">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={studentData.name} src={studentData.avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => { handleChangeView('profile'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Mon profil</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Paramètres</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Mes cours</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <BookIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Mes certificats</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Notifications</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography color="error">Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenu principal */}
      <Box sx={{ bgcolor: '#f5f7fb', minHeight: 'calc(100vh - 64px)', py: 4 }}>
        <Container maxWidth="lg">
          {selectedView === 'dashboard' ? renderDashboard() : renderProfile()}
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;