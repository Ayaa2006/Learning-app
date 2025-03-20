// src/components/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as CourseIcon,
  Quiz as QuizIcon,
  Assignment as ExamIcon,
  VerifiedUser as CertificateIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminLayout = ({ children, toggleDarkMode, darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    navigate('/login');
  };
  
  const menuItems = [
    { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/admin-dashboard' },
    { text: 'Gestion des Cours', icon: <CourseIcon />, path: '/admin-courses' },
    { text: 'Gestion des QCM', icon: <QuizIcon />, path: '/admin-qcm' },
    { text: 'Gestion des Examens', icon: <ExamIcon />, path: '/admin-exams' },
    { text: 'Certificats', icon: <CertificateIcon />, path: '/admin/certificats' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/admin-settings' }
  ];
  
  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 2,
        bgcolor: darkMode ? 'rgba(17, 22, 35, 0.95)' : '#ff9900',
        color: darkMode ? 'white' : 'black'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          SkillPath Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: darkMode ? 'rgba(255, 153, 0, 0.15)' : 'rgba(255, 153, 0, 0.1)',
                  borderRight: '3px solid #ff9900',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255, 153, 0, 0.25)' : 'rgba(255, 153, 0, 0.2)',
                  }
                },
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#ff9900' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: darkMode ? 'rgba(26, 32, 46, 0.95)' : 'white',
          color: darkMode ? 'white' : 'black',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
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
            component="div" 
            sx={{ 
              flexGrow: 1,
              display: { xs: 'none', md: 'block' }
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Administration'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={darkMode ? 'Mode Clair' : 'Mode Sombre'}>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                sx={{ mr: 2 }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationMenu}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  John Smith a tenté de tricher à l'examen
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  2 nouveaux étudiants inscrits aujourd'hui
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  5 certificats générés cette semaine
                </Typography>
              </MenuItem>
            </Menu>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff9900' }}>A</Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Mon Profil</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Déconnexion</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer pour Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer pour Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: darkMode ? 'rgba(26, 32, 46, 0.95)' : 'white',
              color: darkMode ? 'white' : 'black',
              borderRight: '1px solid',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px' // hauteur de la toolbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;