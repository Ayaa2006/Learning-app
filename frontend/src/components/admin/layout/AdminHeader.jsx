// components/admin/layout/AdminHeader.jsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Box, 
  Avatar, 
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon, 
  AccountCircle, 
  Settings as SettingsIcon, 
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const AdminHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // États pour les menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  // Ouvrir le menu du profil
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Fermer le menu du profil
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Ouvrir le menu des notifications
  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  // Fermer le menu des notifications
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Naviguer vers la page du profil
  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/admin/profile');
  };
  
  // Naviguer vers la page des paramètres
  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/admin/settings');
  };
  
  // Déconnexion
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };
  
  // Vérifier si le menu du profil est ouvert
  const isMenuOpen = Boolean(anchorEl);
  
  // Vérifier si le menu des notifications est ouvert
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);
  
  // ID pour le menu du profil
  const menuId = 'primary-search-account-menu';
  
  // ID pour le menu des notifications
  const notificationsMenuId = 'primary-notifications-menu';
  
  // Rendu du menu du profil
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1">{currentUser?.firstName} {currentUser?.lastName}</Typography>
        <Typography variant="body2" color="textSecondary">{currentUser?.email}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleProfileClick}>
        <AccountCircle sx={{ mr: 2 }} />
        Mon profil
      </MenuItem>
      <MenuItem onClick={handleSettingsClick}>
        <SettingsIcon sx={{ mr: 2 }} />
        Paramètres
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 2 }} />
        Déconnexion
      </MenuItem>
    </Menu>
  );
  
  // Rendu du menu des notifications
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={notificationsMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1">Notifications</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleNotificationsMenuClose}>
        <Typography variant="body2">Pas de nouvelles notifications</Typography>
      </MenuItem>
    </Menu>
  );
  
  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          backgroundColor: 'white' 
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show new notifications"
            aria-controls={notificationsMenuId}
            aria-haspopup="true"
            onClick={handleNotificationsMenuOpen}
            color="inherit"
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* Profil */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            {currentUser?.profileImage ? (
              <Avatar 
                alt={`${currentUser.firstName} ${currentUser.lastName}`} 
                src={currentUser.profileImage} 
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }}>
                {currentUser?.firstName?.charAt(0)}
                {currentUser?.lastName?.charAt(0)}
              </Avatar>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderNotificationsMenu}
    </>
  );
};

export default AdminHeader;