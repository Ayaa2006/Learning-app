// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
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
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from '../components/common/Logo';

// Style constants
const darkBg = 'rgba(255, 255, 255, 0.95)';
const primaryColor = '#ff9900'; // Orange comme accent
const lightText = '#ffffff';
const darkText = '#0a0e17';

// Fonction pour cacher le header lors du défilement vers le bas
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate(); // Hook pour la navigation
  
  // États pour la gestion des onglets (utilisateur vs admin)
  const [tabValue, setTabValue] = useState(0);
  
  // États pour la connexion utilisateur
  const [userEmail, setUserEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // États pour la connexion admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // États partagés
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accentColor = '#ff9900';

  // États pour le header
  const [transparent, setTransparent] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesMenuAnchor, setModulesMenuAnchor] = useState(null);

  // Gestionnaire de défilement pour rendre le header transparent
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      setTransparent(false);
    } else {
      setTransparent(true);
    }
  };

  // Ajouter l'écouteur d'événement au montage
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Gestion du menu des modules
  const handleModulesMenuOpen = (event) => {
    setModulesMenuAnchor(event.currentTarget);
  };

  const handleModulesMenuClose = () => {
    setModulesMenuAnchor(null);
  };

  // Gestion du menu mobile
  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(''); // Réinitialiser les erreurs lors du changement d'onglet
  };

  // Connexion utilisateur avec email académique et date de naissance
  const handleUserLogin = async (e) => {
    e.preventDefault();
    
    if (!userEmail) {
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
      
      // Rediriger vers la page de progression utilisateur
      navigate('/progress');
      console.log('User login successful', { userEmail, birthDate });
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Connexion administrateur avec email académique et mot de passe
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
      
      // Rediriger vers le tableau de bord admin
      navigate('/admin-dashboard');
      console.log('Admin login successful', { adminEmail, adminPassword });
    } catch (err) {
      setError('Identifiants administrateur incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour accéder directement aux pages d'administration (pour test seulement)
  const goToAdminPage = (page) => {
    navigate(page);
  };

  return (
    <>
      {/* Intégration du Header */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={transparent ? 0 : 4}
          sx={{ 
            background: transparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: transparent ? 'none' : 'blur(8px)',
            borderBottom: transparent ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo height={30} dark={true} />
            </Box>
          
            {/* Menu principal - version desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  component={Link} 
                  to="/modules" 
                  sx={{ 
                    mx: 1, 
                    color: '#0a0e17',
                    '&:hover': {
                      color: '#ff9900'
                    }
                  }}
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleModulesMenuOpen}
                >
                  Modules
                </Button>
                <Menu
                  anchorEl={modulesMenuAnchor}
                  open={Boolean(modulesMenuAnchor)}
                  onClose={handleModulesMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'modules-button',
                  }}
                >
                  <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/programming">
                    Programmation
                  </MenuItem>
                  <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/design">
                    Design
                  </MenuItem>
                  <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/business">
                    Business
                  </MenuItem>
                </Menu>

                <Button 
                  component={Link} 
                  to="/courses" 
                  sx={{ 
                    mx: 1, 
                    color: '#0a0e17',
                    '&:hover': {
                      color: '#ff9900'
                    }
                  }}
                >
                  Cours
                </Button>
                <Button 
                  component={Link} 
                  to="/exams" 
                  sx={{ 
                    mx: 1, 
                    color: '#0a0e17',
                    '&:hover': {
                      color: '#ff9900'
                    }
                  }}
                >
                  Examens
                </Button>
                <Button 
                  component={Link} 
                  to="/certifications" 
                  sx={{ 
                    mx: 1, 
                    color: '#0a0e17',
                    '&:hover': {
                      color: '#ff9900'
                    }
                  }}
                >
                  Certificats
                </Button>
                <Button 
                  component={Link} 
                  to="/about" 
                  sx={{ 
                    mx: 1, 
                    color: '#0a0e17',
                    '&:hover': {
                      color: '#ff9900'
                    }
                  }}
                >
                  À propos
                </Button>
              </Box>
            )}

            {/* Actions - Login/Register */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile ? (
                <>
                  <Button 
                    component={Link} 
                    to="/login" 
                    sx={{ 
                      color: '#0a0e17',
                      textTransform: 'none'
                    }}
                  >
                    Connexion
                  </Button>
                  <IconButton 
                    edge="end" 
                    onClick={handleMobileMenuOpen}
                    sx={{ 
                      ml: 1,
                      color: '#0a0e17'
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={mobileMenuOpen}
                    onClose={handleMobileMenuClose}
                  >
                    <MenuItem component={Link} to="/modules" onClick={handleMobileMenuClose}>
                      Modules
                    </MenuItem>
                    <MenuItem component={Link} to="/courses" onClick={handleMobileMenuClose}>
                      Cours
                    </MenuItem>
                    <MenuItem component={Link} to="/exams" onClick={handleMobileMenuClose}>
                      Examens
                    </MenuItem>
                    <MenuItem component={Link} to="/certifications" onClick={handleMobileMenuClose}>
                      Certificats
                    </MenuItem>
                    <MenuItem component={Link} to="/about" onClick={handleMobileMenuClose}>
                      À propos
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    component={Link} 
                    to="/login" 
                    sx={{ 
                      bgcolor: '#ff9900', 
                      color: '#ffffff',
                      '&:hover': {
                        bgcolor: '#ffb347',
                        color: '#ffffff',
                      }
                    }}
                  >
                    Connexion
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Contenu de Login */}
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Côté gauche avec illustration (conservé de ton code original) */}
        <Grid item xs={12} md={6} sx={{ 
          bgcolor: lightText, 
          color: lightText,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          p: 4,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/images/login-illustration.png" 
              alt="Login Illustration"
              style={{ 
                width: '120%', 
                maxWidth: '550px',
                height: 'auto'
              }}
              mt={2}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/500x500?text=E-Learning+Login";
              }}
            />
          </Box>
        </Grid>
        
        {/* Côté droit avec formulaire amélioré */}
        <Grid item xs={9} md={6} sx={{ 
          p: { xs: 70, sm: 9, md: 10 },
          bgcolor: '#ffffff',
          display: 'center',
          flexDirection: 'column',
        }}>
          {/* Afficher le logo sur mobile */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            justifyContent: 'center',
            mb: 4 
          }}>
            <Logo height={40} dark />
          </Box>
        
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Box sx={{ mt: 7, width: '100%' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '2.6rem', md: '30px' },
                fontWeight: 'bold',
                mb: 3
              }}
              style={{ color: darkText }}
            >
              Welcome to SkillPath !
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
                icon={<PersonIcon />} 
                label="Utilisateur" 
                id="user-tab"
                aria-controls="user-panel"
                sx={{
                  '&.Mui-selected': {
                    color: primaryColor,
                  },
                }}
              />
              <Tab 
                icon={<SchoolIcon />} 
                label="Administrateur" 
                id="admin-tab"
                aria-controls="admin-panel"
                sx={{
                  '&.Mui-selected': {
                    color: primaryColor,
                  },
                }}
              />
            </Tabs>
            
            {/* Panneau de connexion utilisateur avec email académique et date de naissance */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 0}
              id="user-panel"
              aria-labelledby="user-tab"
            >
              {tabValue === 0 && (
                <Box component="form" onSubmit={handleUserLogin}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    Email académique
                  </Typography>
                  <TextField
                    fullWidth
                    id="user-email"
                    name="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
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
                    disabled={loading || !userEmail || !birthDate}
                    sx={{ 
                      py: 1.5,
                      mb: 3,
                      bgcolor: primaryColor,
                      color: darkText,
                      '&:hover': {
                        bgcolor: '#ff9900'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#0a0e17',
                        color: 'rgba(255, 255, 255, 0.95)'
                      }
                    }}
                  >
                    {loading ? 'Processing...' : 'Log in'}
                  </Button>
                </Box>
              )}
            </Box>
            
            {/* Panneau de connexion administrateur avec email académique et mot de passe */}
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
                        bgcolor: '#ff9900'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#0a0e17',
                        color: 'rgba(255, 255, 255, 0.95)'
                      }
                    }}
                  >
                    {loading ? 'Processing...' : 'Admin Access'}
                  </Button>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Liens de test pour accéder directement aux pages admin (à enlever en production) */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pages d'administration (Test uniquement)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => goToAdminPage('/admin-dashboard')}
                    sx={{ mb: 1 }}
                  >
                    Dashboard Admin
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => goToAdminPage('/admin-courses')}
                    sx={{ mb: 1 }}
                  >
                    Gestion Cours
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => goToAdminPage('/admin-qcm')}
                    sx={{ mb: 1 }}
                  >
                    Gestion QCM
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => goToAdminPage('/admin-exams')}
                    sx={{ mb: 1 }}
                  >
                    Gestion Examens
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    fullWidth
                    onClick={() => goToAdminPage('/admin/certificats')}
                    sx={{ mb: 1 }}
                  >
                    Certificats
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: primaryColor, fontWeight: 'bold', textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;