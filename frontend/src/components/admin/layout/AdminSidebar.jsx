// components/admin/layout/AdminSidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryBooksIcon,
  Assignment as AssignmentIcon,
  Extension as ExtensionIcon,
  VerifiedUser as VerifiedUserIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

// Largeur du drawer
const drawerWidth = 260;

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // État pour le drawer ouvert/fermé (responsive)
  const [open, setOpen] = useState(true);
  
  // État pour les sous-menus
  const [menuOpen, setMenuOpen] = useState({
    users: false,
    courses: false,
    modules: false,
    exams: false
  });

  // Fonction pour basculer l'état du drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Fonction pour basculer l'état d'un sous-menu
  const toggleSubMenu = (menu) => {
    setMenuOpen({
      ...menuOpen,
      [menu]: !menuOpen[menu]
    });
  };

  // Fonction pour vérifier si un chemin est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fonction pour vérifier si un chemin parent est actif
  const isParentActive = (parentPath) => {
    return location.pathname.startsWith(parentPath);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : theme => theme.spacing(7),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : theme => theme.spacing(7),
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: theme => theme.spacing(1),
        }}
      >
        {open && (
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: 'bold',
              ml: 2
            }}
          >
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      
      <Divider />
      
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/admin/dashboard"
            selected={isActive('/admin/dashboard')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        
        {/* Gestion des utilisateurs */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleSubMenu('users')}
            selected={isParentActive('/admin/users')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <PersonIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary="Utilisateurs" />
                {menuOpen.users ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={open && menuOpen.users} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin/users"
              selected={isActive('/admin/users')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Liste des utilisateurs" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/users/create"
              selected={isActive('/admin/users/create')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Ajouter un utilisateur" />
            </ListItemButton>
          </List>
        </Collapse>
        
        {/* Gestion des modules */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleSubMenu('modules')}
            selected={isParentActive('/admin/modules')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <LibraryBooksIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary="Modules" />
                {menuOpen.modules ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={open && menuOpen.modules} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin/modules"
              selected={isActive('/admin/modules')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Liste des modules" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/modules/create"
              selected={isActive('/admin/modules/create')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Créer un module" />
            </ListItemButton>
          </List>
        </Collapse>
        
        {/* Gestion des cours */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleSubMenu('courses')}
            selected={isParentActive('/admin/courses')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary="Cours" />
                {menuOpen.courses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={open && menuOpen.courses} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin/courses"
              selected={isActive('/admin/courses')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Liste des cours" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/courses/create"
              selected={isActive('/admin/courses/create')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Créer un cours" />
            </ListItemButton>
          </List>
        </Collapse>
        
        {/* Gestion des examens */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleSubMenu('exams')}
            selected={isParentActive('/admin/exams')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <AssignmentIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary="Examens" />
                {menuOpen.exams ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={open && menuOpen.exams} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin/exams"
              selected={isActive('/admin/exams')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Liste des examens" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/exams/create"
              selected={isActive('/admin/exams/create')}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Créer un examen" />
            </ListItemButton>
          </List>
        </Collapse>
        
        {/* Certificats */}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/admin/certificates"
            selected={isParentActive('/admin/certificates')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <VerifiedUserIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Certificats" />}
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider />
      
      <List>
        {/* Paramètres */}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/admin/settings"
            selected={isActive('/admin/settings')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Paramètres" />}
          </ListItemButton>
        </ListItem>
        
        {/* Déconnexion */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Déconnexion" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;