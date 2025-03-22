// src/components/layouts/UserLayout.jsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Largeur du drawer
const drawerWidth = 240;

// Options du menu utilisateur
const userMenuOptions = ['Mon profil', 'Paramètres', 'Déconnexion'];

// Options de navigation principale
const mainNavItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Mes cours', icon: <BookIcon />, path: '/courses' },
  { text: 'Progression', icon: <SchoolIcon />, path: '/progress' },
  { text: 'Exercices', icon: <AssignmentIcon />, path: '/exercises' },
  { text: 'Certificats', icon: <EmojiEventsIcon />, path: '/certificates' }
];

// Options de navigation secondaire
const secondaryNavItems = [
  { text: 'Communauté', icon: <PeopleIcon />, path: '/community' },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' }
];

const UserLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Déterminer si un élément de navigation est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          SkillPath
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo et icône de menu pour mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/dashboard"
                sx={{
                  mr: 2,
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                SkillPath
              </Typography>
            </Box>

            {/* Navigation pour grand écran */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {mainNavItems.slice(0, 3).map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    mx: 0.5, 
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 'bold' : 'normal'
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Notifications et Menu utilisateur */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="large" 
                aria-label="show new notifications" 
                color="inherit"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Tooltip title="Options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src="/images/avatar.jpg" alt="Jane Doe" />
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
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Jane Doe
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    jane.doe@example.com
                  </Typography>
                </Box>
                <Divider />
                {userMenuOptions.map((option) => (
                  <MenuItem key={option} onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      {option === 'Mon profil' && <PersonIcon fontSize="small" />}
                      {option === 'Paramètres' && <SettingsIcon fontSize="small" />}
                      {option === 'Déconnexion' && <LogoutIcon fontSize="small" />}
                    </ListItemIcon>
                    <Typography textAlign="center">{option}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Meilleure performance sur mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer permanent */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(0, 0, 0, 0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Contenu principal */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px' // Hauteur de l'AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default UserLayout;