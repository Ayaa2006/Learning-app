// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ajoute cette importation - tu devras installer axios: npm install axios
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

// URL de base de l'API - à ajuster selon ton environnement
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    
    // Appel à l'API de connexion étudiant
    const response = await axios.post(`${API_URL}/api/auth/login/student`, {
      email: studentEmail,
      birthDate: birthDate
    });
    
    if (response.data.success) {
      // Stocker le token JWT dans localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Mettre à jour les en-têtes pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Créer un objet utilisateur avec les informations de l'étudiant
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: ROLES.STUDENT
      };
      
      // Connexion via le contexte d'authentification
      const loginSuccess = login(userData, ROLES.STUDENT);
      
      if (loginSuccess) {
        setLoginSuccess(true);
        // Rediriger vers le tableau de bord étudiant
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 1500);
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      }
    } else {
      setError(response.data.message || 'Échec de la connexion. Veuillez réessayer.');
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    setError(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
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
    
    // Appel à l'API de connexion staff
    const response = await axios.post(`${API_URL}/api/auth/login/staff`, {
      email: adminEmail,
      password: adminPassword,
      role: adminRole
    });
    
    if (response.data.success) {
      // Stocker le token JWT dans localStorage
      localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  // Mettre à jour les en-têtes pour les futures requêtes
  axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  
  // Créer un objet utilisateur avec les informations de l'admin/prof
  const userData = {
    id: response.data.user.id,
    email: response.data.user.email,
    name: response.data.user.name,
    role: response.data.user.role
  }; 


      
      // Connexion via le contexte d'authentification
      const loginSuccess = login(userData, userData.role);
      
      if (loginSuccess) {
        setLoginSuccess(true);
        // Rediriger vers le tableau de bord approprié
        setTimeout(() => {
          // Vérifier le rôle pour la redirection
          if (userData.role === ROLES.TEACHER) {
            navigate('/teacher-dashboard'); // Nouveau chemin pour dashboard professeur
          } else if (userData.role === ROLES.ADMIN) {
            navigate('/admin-dashboard'); // Dashboard administrateur
          }
        }, 1500);
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      } 
    } else {
      setError(response.data.message || 'Échec de la connexion. Veuillez réessayer.');
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    setError(err.response?.data?.message || 'Identifiants administrateur incorrects. Veuillez réessayer.');
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
                    
                    {/* Type d'utilisateur */}
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