// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from './Logo';

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

const Header = () => {
  const [transparent, setTransparent] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesMenuAnchor, setModulesMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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


  return (
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
  );
};

export default Header;