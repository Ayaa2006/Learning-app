// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SupervisorAccount as SupervisorIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as StudentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/common/Logo';

const Login = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false; // Par défaut en mode clair
  });
  
  const { login, ROLES } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  
  // États pour la gestion des onglets
  const [tabValue, setTabValue] = useState(0);
  
  // États pour la connexion étudiant
  const [studentEmail, setStudentEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // États pour la connexion admin/prof
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminRole, setAdminRole] = useState(ROLES.ADMIN); // Par défaut, administrateur système
  
  // États partagés
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Style constants
  const primaryColor = '#ff9900'; // Orange comme accent
  const darkText = '#0a0e17';
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Définition du thème en fonction du mode
  const appTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
      },
      background: {
        default: darkMode ? '#0a0e17' : '#f5f7fa',
        paper: darkMode ? '#111623' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f0f2f5' : '#0a0e17',
        secondary: darkMode ? '#b0b7c3' : '#4a5568',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  // Sauvegarder le mode dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // Toggle pour le mode sombre/clair
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(''); // Réinitialiser les erreurs lors du changement d'onglet
  };

  // Connexion étudiant avec email académique et date de naissance
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    
    if (!studentEmail) {
      setError('Veuillez entrer votre email académique');
      return;
    }
    
    if (!birthDate) {
      setError('Veuillez entrer votre date de naissance');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer un objet utilisateur avec les informations de l'étudiant
      const userData = {
        id: Math.floor(Math.random() * 10000),
        email: studentEmail,
        name: studentEmail.split('@')[0], // Simulation d'un nom à partir de l'email
        birthDate: birthDate,
        role: ROLES.STUDENT
      };
      
      // Connexion via le contexte d'authentification
      const loginSuccess = login(userData, ROLES.STUDENT);
      
      if (loginSuccess) {
        setLoginSuccess(true);
        // Rediriger vers le tableau de bord étudiant
        navigate('/student-dashboard');
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Connexion administrateur ou professeur
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!adminEmail) {
      setError('Veuillez entrer votre email académique');
      return;
    }
    
    if (!adminPassword) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer un objet utilisateur avec les informations de l'admin/prof
      const userData = {
        id: Math.floor(Math.random() * 10000),
        email: adminEmail,
        name: adminEmail.split('@')[0], // Simulation d'un nom à partir de l'email
        role: adminRole
      };
      
      // Connexion via le contexte d'authentification
      const loginSuccess = login(userData, adminRole);
      
      if (loginSuccess) {
        setLoginSuccess(true);
        // Rediriger vers le tableau de bord approprié
        navigate('/admin-dashboard');
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Identifiants administrateur incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour accéder directement aux pages (pour test seulement)
  const goToPage = (page) => {
    navigate(page);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Contenu de Login - uniquement le contenu sans le header */}
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* Côté gauche avec illustration */}
          <Grid item xs={12} md={6} sx={{ 
            bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#ffffff', 
            color: appTheme.palette.text.primary,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            position: 'relative'
          }}>
            <Box sx={{ 
              display: 'center', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%',
            }}>
              <img 
                src="/images/login-illustration__2_-removebg-preview (1).png" 
                alt="Login Illustration"
                style={{ 
                  width: '100%', 
                  maxWidth: '550px',
                  height: 'auto', 
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x500?text=E-Learning+Login";
                }}
              />
            </Box>
          </Grid>
          
          {/* Côté droit avec formulaire */}
          <Grid item xs={12} md={6} sx={{ 
            p: { xs: 4, sm: 6, md: 10 },
            bgcolor: darkMode ? '#111623' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Logo et toggle de thème */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4 
            }}>
              <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 'bold', color: 'text.primary', textDecoration: 'none' }}>
                Skill<span style={{ color: appTheme.palette.primary.main }}>Path</span>
              </Typography>
              
              {/* Toggle Theme */}
              <IconButton onClick={toggleDarkMode} color="inherit" aria-label={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {loginSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Connexion réussie ! Redirection en cours...
              </Alert>
            )}
            
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '2.2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Bienvenue sur SkillPath !
              </Typography>
              
              {/* Onglets pour choisir le type de connexion */}
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="login-tabs"
                sx={{ 
                  mb: 4,
                  '& .MuiTabs-indicator': {
                    backgroundColor: primaryColor,
                  },
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                  }
                }}
              >
                <Tab 
                  icon={<StudentIcon />} 
                  label="Étudiant" 
                  id="student-tab"
                  aria-controls="student-panel"
                  sx={{
                    '&.Mui-selected': {
                      color: primaryColor,
                    },
                  }}
                />
                <Tab 
                  icon={<SupervisorIcon />} 
                  label="Personnel" 
                  id="admin-tab"
                  aria-controls="admin-panel"
                  sx={{
                    '&.Mui-selected': {
                      color: primaryColor,
                    },
                  }}
                />
              </Tabs>
              
              {/* Panneau de connexion étudiant */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 0}
                id="student-panel"
                aria-labelledby="student-tab"
              >
                {tabValue === 0 && (
                  <Box component="form" onSubmit={handleStudentLogin}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Email académique
                    </Typography>
                    <TextField
                      fullWidth
                      id="student-email"
                      name="studentEmail"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Entrez votre email académique"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Date de naissance
                    </Typography>
                    <TextField
                      fullWidth
                      id="birth-date"
                      name="birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading || !studentEmail || !birthDate}
                      sx={{ 
                        py: 1.5,
                        mb: 3,
                        bgcolor: primaryColor,
                        color: darkText,
                        '&:hover': {
                          bgcolor: '#ffb347'
                        },
                        '&.Mui-disabled': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              {/* Panneau de connexion personnel (admin/prof) */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 1}
                id="admin-panel"
                aria-labelledby="admin-tab"
              >
                {tabValue === 1 && (
                  <Box component="form" onSubmit={handleAdminLogin}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Email académique
                    </Typography>
                    <TextField
                      fullWidth
                      id="admin-email"
                      name="adminEmail"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="Entrez votre email académique"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Mot de passe
                    </Typography>
                    <TextField
                      fullWidth
                      id="admin-password"
                      name="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      variant="outlined"
                      margin="normal"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ mb: 3 }}
                    />
                    
                    {/* Type d'utilisateur - PARTIE MODIFIÉE */}
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Type d'utilisateur
                    </Typography>
                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                      <Select
                        id="admin-role"
                        value={adminRole}
                        onChange={(e) => setAdminRole(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value={ROLES.ADMIN}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AdminIcon sx={{ mr: 1, color: '#ff9900' }} />
                            <Box>
                              <Typography variant="body1">Administrateur système</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Accès en lecture seule, gestion des utilisateurs et certificats
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                        <MenuItem value={ROLES.TEACHER}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SupervisorIcon sx={{ mr: 1, color: '#4caf50' }} />
                            <Box>
                              <Typography variant="body1">Professeur</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Création et gestion du contenu pédagogique (cours, QCM, examens)
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading || !adminEmail || !adminPassword}
                      sx={{ 
                        py: 1.5,
                        mb: 3,
                        bgcolor: primaryColor,
                        color: darkText,
                        '&:hover': {
                          bgcolor: '#ffb347'
                        },
                        '&.Mui-disabled': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      {loading ? 'Connexion en cours...' : 'Accéder à l\'administration'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Liens de test pour accéder directement aux pages (à enlever en production) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                  Accès rapide aux pages (Test uniquement)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/student-dashboard')}
                      sx={{ mb: 1 }}
                    >
                      Dashboard Étudiant
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/admin-dashboard')}
                      sx={{ mb: 1 }}
                    >
                      Dashboard Admin
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/admin-courses')}
                      sx={{ mb: 1 }}
                    >
                      Gestion Cours
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/admin-qcm')}
                      sx={{ mb: 1 }}
                    >
                      Gestion QCM
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/admin-exams')}
                      sx={{ mb: 1 }}
                    >
                      Gestion Examens
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/admin/certificats')}
                      sx={{ mb: 1 }}
                    >
                      Certificats
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/progress')}
                      sx={{ mb: 1 }}
                    >
                      Progression
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/certificate')}
                      sx={{ mb: 1 }}
                    >
                      Mes Certificats
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/ExamPage')}
                      sx={{ mb: 1 }}
                    >
                      Commencer l'Examen
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToPage('/ExamWithProctoring')}
                      sx={{ mb: 1, bgcolor: '#ff5722', color: 'white', '&:hover': { bgcolor: '#e64a19' } }}
                    >
                      Examen avec Surveillance
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  Vous n'avez pas encore de compte ?{' '}
                  <Link to="/register" style={{ color: primaryColor, fontWeight: 'bold', textDecoration: 'none' }}>
                    S'inscrire
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Login;