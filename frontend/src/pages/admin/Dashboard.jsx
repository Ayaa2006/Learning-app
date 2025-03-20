// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Assignment as AssignmentIcon, 
  Timeline as TimelineIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  VerifiedUser as VerifiedUserIcon,
  People as PeopleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchUserStats } from '../../services/userService';

// Composant pour les statistiques
const StatCard = ({ title, value, icon, color, change, changeType }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {changeType === 'increase' ? (
                  <ArrowUpwardIcon fontSize="small" color="success" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" color="error" />
                )}
                <Typography 
                  variant="body2" 
                  color={changeType === 'increase' ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {change}%
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Avatar 
              sx={{ 
                bgcolor: color, 
                width: 56, 
                height: 56 
              }}
            >
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    roleStats: { student: 0, instructor: 0, admin: 0 },
    recentUsers: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setLoading(true);
        const stats = await fetchUserStats();
        setUserStats(stats);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserStats();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Erreur de chargement
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord administrateur
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Statistiques des utilisateurs */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Utilisateurs" 
            value={userStats.totalUsers} 
            icon={<PersonIcon />} 
            color="primary.main" 
            change="5.3" 
            changeType="increase" 
          />
        </Grid>
        
        {/* Statistiques des étudiants */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Étudiants" 
            value={userStats.roleStats.student || 0} 
            icon={<PeopleIcon />} 
            color="success.main" 
            change="2.7" 
            changeType="increase" 
          />
        </Grid>
        
        {/* Statistiques des modules */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Modules" 
            value="8" 
            icon={<SchoolIcon />} 
            color="warning.main" 
          />
        </Grid>
        
        {/* Statistiques des certificats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Certificats délivrés" 
            value="42" 
            icon={<VerifiedUserIcon />} 
            color="info.main" 
            change="12.5" 
            changeType="increase" 
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Répartition des utilisateurs */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Répartition des utilisateurs" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'success.main', mb: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.activeUsers}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Actifs
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'warning.main', mb: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.inactiveUsers}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Inactifs
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'error.main', mb: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.suspendedUsers}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Suspendus
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'info.main', mb: 1 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.roleStats.student || 0}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Étudiants
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'secondary.main', mb: 1 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.roleStats.instructor || 0}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Formateurs
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{userStats.roleStats.admin || 0}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Admins
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activité récente */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Activité récente" />
            <Divider />
            <List sx={{ p: 0 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Nouvel utilisateur inscrit" 
                  secondary="Jean Dupont - Il y a 5 minutes" 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Nouveau module créé" 
                  secondary="Introduction à React.js - Il y a 2 heures" 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Examen complété" 
                  secondary="Marie Martin - Module 2 - Il y a 3 heures" 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WarningIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Incident de triche détecté" 
                  secondary="Paul Bernard - Module 3 - Il y a 1 jour" 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <VerifiedUserIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Certificat délivré" 
                  secondary="Sophie Petit - Formation complète - Il y a 2 jours" 
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;