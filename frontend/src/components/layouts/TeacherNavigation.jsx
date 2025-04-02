import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TeacherNavigation = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: 'Tableau de Bord',
      path: '/teacher-dashboard'
    },
    {
      icon: <SchoolIcon />,
      text: 'Mes Cours',
      path: '/teacher/courses'
    },
    {
      icon: <QuizIcon />,
      text: 'QCM',
      path: '/teacher/quizzes'
    },
    {
      icon: <AssignmentIcon />,
      text: 'Examens',
      path: '/teacher/exams'
    },
    {
      icon: <TrendingUpIcon />,
      text: 'Statistiques',
      path: '/teacher/statistics'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <List 
      component="nav"
      sx={{ 
        width: '100%', 
        maxWidth: 360, 
        bgcolor: darkMode ? 'background.dark' : 'background.paper' 
      }}
    >
      {menuItems.map((item) => (
        <ListItem 
          key={item.path}
          button
          selected={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      
      <Divider />
      
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon color="error" />
        </ListItemIcon>
        <ListItemText primary="Déconnexion" primaryTypographyProps={{ color: 'error' }} />
      </ListItem>
    </List>
  );
};

export default TeacherNavigation;