// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QCMIcon,
  Event as ExamIcon,
  VerifiedUser as CertificateIcon,
  Person as UserIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as TeacherIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon,
  Create as CreateIcon,
  Edit as EditIcon,
  ListAlt as ListIcon,
  Check as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Largeur du drawer
const drawerWidth = 260;

const AdminLayout = ({ children, toggleDarkMode, darkMode }) => {
  const { userRole, user, logout, hasPermission, ROLES } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Debugging pour vérifier le rôle
  useEffect(() => {
    console.log("userRole dans AdminLayout:", userRole);
    console.log("ROLES.ADMIN:", ROLES.ADMIN);
    console.log("Est-ce un admin?", userRole === ROLES.ADMIN);
    console.log("User data:", user);
  }, [userRole, ROLES, user]);
  
  // État pour le drawer sur mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  // États pour les menus déroulants
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [qcmOpen, setQcmOpen] = useState(false);
  const [examsOpen, setExamsOpen] = useState(false);
  // État pour le menu utilisateur
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  // État pour le menu de notifications
  const [notifMenuAnchorEl, setNotifMenuAnchorEl] = useState(null);
  
  // Fonction pour obtenir le titre en fonction du rôle
  const getLayoutTitle = () => {
    if (userRole === ROLES.ADMIN) {
      return "Espace Administrateur";
  
    } else {
      return "SkillPath";
    }
  };
  
   // Fonction pour obtenir le nom à afficher
   const getDisplayName = () => {
    return user?.name || "admin";
  };
  
  // Simulation de notifications
  const notificationCount = 3;
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Tentative de triche détectée pour l\'étudiant Jean Dupont',
      time: 'Il y a 5 minutes'
    },
    {
      id: 2,
      type: 'info',
      message: 'Nouveau certificat généré pour Marie Martin',
      time: 'Il y a 30 minutes'
    },
    {
      id: 3,
      type: 'success',
      message: 'Module "JavaScript Avancé" complété par 15 étudiants',
      time: 'Il y a 2 heures'
    }
  ];
  
  // Gestion des menus
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleNotifMenuOpen = (event) => {
    setNotifMenuAnchorEl(event.currentTarget);
  };
  
  const handleNotifMenuClose = () => {
    setNotifMenuAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Vérifier si un item de menu est actif
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Vérifier si un item de menu est parent d'un chemin actif
  const isParentActive = (basePath) => {
    return location.pathname.startsWith(basePath);
  };
  
  // Générer une couleur de chip pour le rôle
  const getRoleChipColor = () => {
    if (userRole === ROLES.ADMIN) return 'error';
    if (userRole === ROLES.TEACHER) return 'success';
    return 'default';
  };
  
  // Générer un libellé pour le rôle
  const getRoleLabel = () => {
    if (userRole === ROLES.ADMIN) return 'Admin';
    if (userRole === ROLES.TEACHER) return 'Prof';
    return userRole;
  };
  
  // Dashboard destination based on role
  const getDashboardPath = () => {
    if (userRole === ROLES.ADMIN) {
      return "/admin-dashboard";
    } else if (userRole === ROLES.TEACHER) {
      return "/teacher-dashboard";
    } else {
      return "/admin-dashboard";
    }
  };
  
  // Contenu du drawer
  const drawer = (
    <Box>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
      }}>
        <Typography variant="h6" component={Link} to={getDashboardPath()} sx={{ fontWeight: 'bold', color: '#ff9900', textDecoration: 'none' }}>
          {getLayoutTitle()}
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>
      <Divider />
      
      {/* Informations utilisateur */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar 
          src={user?.profilePic || ""}
          alt={getDisplayName()}
          sx={{ 
            width: 64, 
            height: 64, 
            margin: '0 auto',
            bgcolor: userRole === ROLES.ADMIN ? '#f44336' : '#4caf50',
          }}
        >
          {getDisplayName().charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
          {getDisplayName()}
        </Typography>
        <Chip 
          size="small"
          label={getRoleLabel()}
          color={getRoleChipColor()}
          sx={{ mt: 0.5 }}
          icon={userRole === ROLES.ADMIN ? <AdminIcon fontSize="small" /> : <TeacherIcon fontSize="small" />}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              size="small"
            />
          }
          label="Mode sombre"
          sx={{ mt: 1, fontSize: '0.8rem' }}
        />
      </Box>
      <Divider />
      
      {/* Navigation */}
      <List>
        {/* Dashboard - accessible à tous */}
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={getDashboardPath()}
            selected={isActive(getDashboardPath())}
          >
            <ListItemIcon>
              <DashboardIcon color={isActive(getDashboardPath()) ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Tableau de bord" />
          </ListItemButton>
        </ListItem>
        
        {/* Gestion des modules - visible uniquement pour Admin */}
        {hasPermission('createModule') && (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/admin-modules"
              selected={isActive('/admin-modules')}
            >
              <ListItemIcon>
                <SchoolIcon color={isActive('/admin-modules') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Modules de formation" />
            </ListItemButton>
          </ListItem>
        )}
        
        {/* Gestion des cours - visible pour Admin et Prof mais avec des boutons différents */}
<ListItem disablePadding>
  <ListItemButton onClick={() => setCoursesOpen(!coursesOpen)}>
    <ListItemIcon>
      <AssignmentIcon color={isParentActive('/admin-courses') ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Cours" />
    {coursesOpen ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>
</ListItem>
<Collapse in={coursesOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton 
      component={Link} 
      to="/admin-courses"
      selected={isActive('/admin-courses')}
      sx={{ pl: 4 }}
    >
      <ListItemIcon>
        <ListIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Liste des cours" />
    </ListItemButton>
    
    {/* Création de cours - uniquement pour les professeurs */}
    {hasPermission('createCourse') && (
      <ListItemButton 
        component={Link} 
        to="/admin-courses/create"
        selected={isActive('/admin-courses/create')}
        sx={{ pl: 4 }}
      >
        <ListItemIcon>
          <CreateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Créer un cours" />
      </ListItemButton>
    )}
  </List>
</Collapse>
        
       {/* Gestion des QCM - avec permissions révisées */}
<ListItem disablePadding>
  <ListItemButton onClick={() => setQcmOpen(!qcmOpen)}>
    <ListItemIcon>
      <QCMIcon color={isParentActive('/admin-qcm') ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="QCM" />
    {qcmOpen ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>
</ListItem>
<Collapse in={qcmOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton 
      component={Link} 
      to="/admin-qcm"
      selected={isActive('/admin-qcm')}
      sx={{ pl: 4 }}
    >
      <ListItemIcon>
        <ListIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Liste des QCM" />
    </ListItemButton>
    
    {/* Création de QCM - uniquement pour les professeurs */}
    {hasPermission('createQCM') && (
      <ListItemButton 
        component={Link} 
        to="/admin-qcm/create"
        selected={isActive('/admin-qcm/create')}
        sx={{ pl: 4 }}
      >
        <ListItemIcon>
          <CreateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Créer un QCM" />
      </ListItemButton>
    )}
  </List>
</Collapse>
        
        {/* Gestion des examens - avec permissions révisées */}
<ListItem disablePadding>
  <ListItemButton onClick={() => setExamsOpen(!examsOpen)}>
    <ListItemIcon>
      <ExamIcon color={isParentActive('/admin-exams') ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Examens" />
    {examsOpen ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>
</ListItem>
<Collapse in={examsOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton 
      component={Link} 
      to="/admin-exams"
      selected={isActive('/admin-exams')}
      sx={{ pl: 4 }}
    >
      <ListItemIcon>
        <ListIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Liste des examens" />
    </ListItemButton>
    
    {/* Surveillance d'examens - visible pour tous les admins */}
    <ListItemButton 
      component={Link} 
      to="/admin-exams/proctoring"
      selected={isActive('/admin-exams/proctoring')}
      sx={{ pl: 4 }}
    >
      <ListItemIcon>
        <VisibilityIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Surveillance" />
    </ListItemButton>
    
    {/* Création d'examens - uniquement pour les professeurs */}
    {hasPermission('createExam') && (
      <ListItemButton 
        component={Link} 
        to="/admin-exams/create"
        selected={isActive('/admin-exams/create')}
        sx={{ pl: 4 }}
      >
        <ListItemIcon>
          <CreateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Créer un examen" />
      </ListItemButton>
    )}
  </List>
</Collapse>
        
        {/* Certificats - émission réservée aux admin système */}
<ListItem disablePadding>
  <ListItemButton 
    component={Link} 
    to="/admin/certificats"
    selected={isActive('/admin/certificats')}
  >
    <ListItemIcon>
      <CertificateIcon color={isActive('/admin/certificats') ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Certificats" />
    {hasPermission('issueCertificate') && (
      <Chip 
        size="small" 
        label="Contrôle total" 
        color="primary" 
        variant="outlined" 
        sx={{ ml: 1, fontSize: '0.7rem' }} 
      />
    )}
  </ListItemButton>
</ListItem>

{/* Statistiques - visible pour tous */}
<ListItem disablePadding>
  <ListItemButton 
    component={Link} 
    to="/admin/analytics"
    selected={isActive('/admin/analytics')}
  >
    <ListItemIcon>
      <AnalyticsIcon color={isActive('/admin/analytics') ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Statistiques" />
  </ListItemButton>
</ListItem>
       {/* Gestion des utilisateurs - uniquement pour Admin */}
{hasPermission('manageUsers') && (
  <ListItem disablePadding>
    <ListItemButton 
      component={Link} 
      to="/admin/users"
      selected={isActive('/admin/users')}
    >
      <ListItemIcon>
        <UserIcon color={isActive('/admin/users') ? 'primary' : 'inherit'} />
      </ListItemIcon>
      <ListItemText primary="Utilisateurs" />
    </ListItemButton>
  </ListItem>
)}

{/* Paramètres - uniquement pour Admin */}
{hasPermission('manageRoles') && (
  <ListItem disablePadding>
    <ListItemButton 
      component={Link} 
      to="/admin/settings"
      selected={isActive('/admin/settings')}
    >
      <ListItemIcon>
        <SettingsIcon color={isActive('/admin/settings') ? 'primary' : 'inherit'} />
      </ListItemIcon>
      <ListItemText primary="Paramètres" />
    </ListItemButton>
  </ListItem>
)}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: darkMode ? '#111623' : '#fff',
          color: darkMode ? '#fff' : '#0a0e17',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getLayoutTitle()}
          </Typography>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              sx={{ mx: 1 }}
              onClick={handleNotifMenuOpen}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu notifications */}
          <Menu
            anchorEl={notifMenuAnchorEl}
            open={Boolean(notifMenuAnchorEl)}
            onClose={handleNotifMenuClose}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 'calc(100% - 96px)',
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotifMenuClose}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 0.5 }}>
                  {notification.type === 'warning' && <WarningIcon color="error" sx={{ mr: 1.5, mt: 0.5 }} />}
                  {notification.type === 'info' && <InfoIcon color="info" sx={{ mr: 1.5, mt: 0.5 }} />}
                  {notification.type === 'success' && <CheckIcon color="success" sx={{ mr: 1.5, mt: 0.5 }} />}
                  <Box>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography 
                variant="body2"
                component={Link}
                to="/admin/notifications"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Voir toutes les notifications
              </Typography>
            </Box>
          </Menu>
          
          {/* Profil utilisateur */}
          <Tooltip title="Profil">
            <IconButton 
              onClick={handleUserMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar 
                alt={getDisplayName()} 
                src={user?.profilePic || ""}
                sx={{ 
                  bgcolor: userRole === ROLES.ADMIN ? '#f44336' : '#f44336',
                }}
              >
                {getDisplayName().charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* Menu profil */}
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {getDisplayName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'utilisateur@exemple.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => {
              handleUserMenuClose();
              navigate('/admin/profile');
            }}>
              Mon profil
            </MenuItem>
            
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer sur mobile */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer permanent sur desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: darkMode ? '#111623' : '#fff',
              color: darkMode ? '#fff' : 'inherit',
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
          minHeight: '100vh',
          pt: { xs: 7, sm: 8 }, // Pour éviter que le contenu ne passe sous l'AppBar
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default AdminLayout;