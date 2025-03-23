// src/pages/AdminDashboard.jsx
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
  VerifiedUser as VerifiedUserIcon, 
  Warning as WarningIcon,
  DonutLarge as DonutLargeIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import AdminLayout from '../components/layouts/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockStatistics, mockUsers, mockModules, mockCheatAttempts } from '../data/mockData';

const AdminDashboard = ({ toggleDarkMode, darkMode }) => {
  const { userRole, user, hasPermission, ROLES, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [popularModules, setPopularModules] = useState([]);
  const [cheatAttempts, setCheatAttempts] = useState([]);
  const navigate = useNavigate();
  
  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filtrer les données selon le rôle de l'utilisateur
        if (userRole === ROLES.ADMIN) {
          // Administrateur système - Accès complet aux données
          setStats(mockStatistics);
          setRecentUsers(mockUsers.slice(0, 5));
          setPopularModules(mockModules.slice(0, 3));
          setCheatAttempts(mockCheatAttempts);
        } else {
          // Professeur - Données filtrées selon les cours assignés
          // Simulons que le professeur est assigné aux modules 1 et 2
          const assignedModuleIds = [1, 2];
          
          // Filtrer les modules assignés au professeur
          const teacherModules = mockModules.filter(module => 
            assignedModuleIds.includes(module.id)
          );
          
          // Calculer des statistiques spécifiques au professeur
          const teacherStats = {
            totalStudents: teacherModules.reduce((sum, module) => sum + module.enrolledStudents, 0),
            activeStudents: Math.floor(teacherModules.reduce((sum, module) => sum + module.enrolledStudents, 0) * 0.7),
            completedModules: teacherModules.reduce((sum, module) => 
              sum + Math.floor(module.enrolledStudents * module.completionRate / 100), 0
            ),
            issuedCertificates: Math.floor(teacherModules.reduce((sum, module) => 
              sum + Math.floor(module.enrolledStudents * module.completionRate / 100 * 0.8), 0
            )),
            cheatAttempts: mockCheatAttempts.filter(attempt => 
              teacherModules.some(module => module.title.includes(attempt.examTitle))
            ).length,
            averageScore: Math.floor(
              teacherModules.reduce((sum, module) => sum + module.completionRate, 0) / teacherModules.length
            ),
            monthlyProgress: mockStatistics.monthlyProgress
          };
          
          setStats(teacherStats);
          
          // Filtrer les utilisateurs des modules assignés
          // Simulons que les utilisateurs 2, 3, et 5 sont dans les modules du professeur
          const teacherUserIds = [2, 3, 5];
          setRecentUsers(mockUsers.filter(user => teacherUserIds.includes(user.id)).slice(0, 5));
          
          // Modules assignés au professeur
          setPopularModules(teacherModules);
          
          // Filtrer les tentatives de triche pour les examens du professeur
          setCheatAttempts(mockCheatAttempts.filter(attempt => 
            teacherModules.some(module => module.title.includes(attempt.examTitle))
          ));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userRole, ROLES]);
  
  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
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
              {userRole === ROLES.ADMIN 
                ? 'Tableau de Bord Administrateur' 
                : 'Tableau de Bord Enseignant'}
            </Typography>
            <Chip 
              label={user?.name || 'Utilisateur'} 
              color={userRole === ROLES.ADMIN ? 'error' : 'success'}
              icon={userRole === ROLES.ADMIN ? <PersonIcon /> : <SchoolIcon />}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress sx={{ color: '#ff9900' }} />
            </Box>
          ) : (
            <>
              {/* Statistiques générales */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<PersonIcon sx={{ fontSize: 48, color: '#ff9900', mb: 1 }} />}
                    value={stats?.totalStudents}
                    label="Étudiants Total"
                    color="#ff9900"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<SchoolIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />}
                    value={stats?.activeStudents}
                    label="Étudiants Actifs"
                    color="#4caf50"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<AssignmentIcon sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />}
                    value={stats?.completedModules}
                    label="Modules Complétés"
                    color="#2196f3"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<VerifiedUserIcon sx={{ fontSize: 48, color: '#673ab7', mb: 1 }} />}
                    value={stats?.issuedCertificates}
                    label="Certificats Émis"
                    color="#673ab7"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<WarningIcon sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />}
                    value={stats?.cheatAttempts}
                    label="Tentatives de Triche"
                    color="#f44336"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <StatCard 
                    icon={<DonutLargeIcon sx={{ fontSize: 48, color: '#009688', mb: 1 }} />}
                    value={`${stats?.averageScore}%`}
                    label="Score Moyen"
                    color="#009688"
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
                          bgcolor: userRole === ROLES.ADMIN ? '#f44336' : '#4caf50'
                        }}
                      >
                        {user?.name?.charAt(0) || <AccountCircleIcon />}
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {user?.name || 'Utilisateur'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {user?.email || 'email@exemple.com'}
                      </Typography>
                      
                      <Chip 
                        label={userRole === ROLES.ADMIN ? 'Administrateur système' : 'Professeur'} 
                        color={userRole === ROLES.ADMIN ? 'error' : 'success'}
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
                        Modules Populaires
                      </Typography>
                      {hasPermission('viewModules') && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<SchoolIcon />}
                        >
                          Tous les modules
                        </Button>
                      )}
                    </Box>
                    <List>
                      {popularModules.length > 0 ? (
                        popularModules.map((module) => (
                          <React.Fragment key={module.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{module.title}</Typography>
                                    <Chip 
                                      size="small" 
                                      label={`${module.completionRate}%`}
                                      sx={{ 
                                        bgcolor: module.completionRate > 75 ? '#e8f5e9' : '#fff3e0',
                                        color: module.completionRate > 75 ? '#2e7d32' : '#e65100'
                                      }}
                                    />
                                  </Box>
                                )} 
                                secondary={`${module.enrolledStudents} étudiants • ${module.completionRate}% taux de complétion`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucun module disponible
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
                        Dernières connexions
                      </Typography>
                      {hasPermission('viewStudentProgress') && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<GroupIcon />}
                        >
                          Tous les étudiants
                        </Button>
                      )}
                    </Box>
                    <List>
                      {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                          <React.Fragment key={user.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{user.name}</Typography>
                                    <Box>
                                      <Tooltip title="Voir le profil">
                                        <IconButton size="small" sx={{ ml: 1 }}>
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Envoyer un message">
                                        <IconButton size="small" sx={{ ml: 0.5 }}>
                                          <MailIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                )} 
                                secondary={`${user.email} • ${user.lastLogin}`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucune connexion récente
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Incidents récents de triche
                      </Typography>
                      {hasPermission('viewCheatDetection') && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="error"
                          startIcon={<WarningIcon />}
                        >
                          Tous les incidents
                        </Button>
                      )}
                    </Box>
                    {cheatAttempts.length > 0 ? (
                      <List>
                        {cheatAttempts.map((attempt) => (
                          <React.Fragment key={attempt.id}>
                            <ListItem>
                              <ListItemText 
                                primary={(
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">{attempt.studentName}</Typography>
                                    <Chip 
                                      size="small" 
                                      label={attempt.type}
                                      color="error"
                                      variant="outlined"
                                    />
                                  </Box>
                                )} 
                                secondary={`${attempt.examTitle} • ${attempt.date} à ${attempt.timestamp}`}
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aucun incident récent
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                
                {/* Colonne de droite */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Progression Mensuelle
                      </Typography>
                      {hasPermission('viewStatistics') && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<TrendingUpIcon />}
                        >
                          Statistiques détaillées
                        </Button>
                      )}
                    </Box>
                    <Box sx={{ height: 300, p: 2 }}>
                      {stats?.monthlyProgress && stats.monthlyProgress.length > 0 ? (
                        stats.monthlyProgress.map((data, index) => (
                          <Card key={index} sx={{ mb: 2, borderLeft: '4px solid #ff9900' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="div">
                                  {data.month} 2025
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                  <Chip size="small" label={`${data.students} étudiants`} />
                                  <Chip size="small" label={`${data.completions} modules`} color="primary" />
                                </Stack>
                              </Box>
                              <Box sx={{ mt: 1 }}>
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
                                    width: `${(data.completions / data.students) * 100}%`,
                                    bgcolor: '#ff9900',
                                    borderRadius: 3
                                  }}/>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                  Taux de complétion: {Math.round((data.completions / data.students) * 100)}%
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

export default AdminDashboard;