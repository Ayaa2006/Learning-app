import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  CssBaseline,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';

// Import the existing components
import StudentDashboard from './StudentDashboard';
import Certificate from './Certificate';
import Progress from './Progress';

// Sidebar navigation component
const Sidebar = ({ open, handleDrawerClose }) => {
  const location = useLocation();
  const studentData = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "/images/avatar.jpg"
  };

  const menuItems = [
    { 
      text: 'Tableau de bord', 
      icon: <DashboardIcon />, 
      path: '/' 
    },
    { 
      text: 'Progression', 
      icon: <SchoolIcon />, 
      path: '/progress' 
    },
    { 
      text: 'Certificats', 
      icon: <EmojiEventsIcon />, 
      path: '/certificates' 
    }
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#f5f7fb'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3,
        bgcolor: 'white',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
      }}>
        <Avatar 
          src={studentData.avatar} 
          alt={studentData.name}
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {studentData.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {studentData.email}
        </Typography>
      </Box>

      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={Link} 
            to={item.path}
            sx={{
              bgcolor: location.pathname === item.path 
                ? 'rgba(25, 118, 210, 0.08)' 
                : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <List>
        <ListItem 
          sx={{
            '&:hover': {
              bgcolor: 'rgba(244, 67, 54, 0.04)'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText 
            primary="Déconnexion" 
            primaryTypographyProps={{ color: 'error' }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

// Main Dashboard Layout
const UserDashboard = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            width: `calc(100% - ${open ? 240 : 0}px)`, 
            ml: `${open ? 240 : 0}px`,
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              SkillPath
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Sidebar open={open} handleDrawerClose={() => setOpen(false)} />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: `calc(100% - ${open ? 240 : 0}px)`,
            mt: 8,
            bgcolor: '#f5f7fb',
            minHeight: '100vh'
          }}
        >
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/certificates" element={<Certificate />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default UserDashboard;