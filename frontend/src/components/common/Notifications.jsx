// src/components/common/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Button,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

const mockNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'Quiz disponible',
    message: 'Un nouveau quiz est disponible pour le cours "Structures Conditionnelles"',
    time: '5 minutes',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Module complété',
    message: 'Félicitations ! Vous avez terminé le module "Variables et Types de Données"',
    time: '2 heures',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Échéance approchante',
    message: 'L\'examen final du module "Structures Conditionnelles" est dans 3 jours',
    time: '1 jour',
    read: false
  },
  {
    id: 4,
    type: 'info',
    title: 'Support disponible',
    message: 'Des sessions de support sont disponibles pour le prochain examen',
    time: '3 jours',
    read: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    setUnreadCount(notifications.filter(notification => !notification.read).length);
  }, [notifications]);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };
  // src/components/common/Notifications.jsx (suite)
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({...notification, read: true})
    ));
  };
  
  const getIconByType = (type) => {
    switch(type) {
      case 'success':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      case 'info':
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };
  
  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          size="large"
          aria-controls={open ? 'notifications-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notifications-button',
        }}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              sx={{
                py: 1.5,
                px: 2,
                borderLeft: notification.read ? 'none' : '3px solid',
                borderColor: notification.read ? 'transparent' : 'primary.main',
                bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
              }}
            >
              <ListItemIcon>
                {getIconByType(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      il y a {notification.time}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        )}
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" fullWidth>
            Voir toutes les notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default Notifications;