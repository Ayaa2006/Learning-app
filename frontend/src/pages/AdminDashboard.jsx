// src/pages/AdminDashboard.jsx
import React from 'react';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, Card, CardContent } from '@mui/material';
import { Person as PersonIcon, School as SchoolIcon, Assignment as AssignmentIcon, VerifiedUser as VerifiedUserIcon, Warning as WarningIcon } from '@mui/icons-material';
import AdminLayout from '../components/layouts/AdminLayout';
import { mockStatistics, mockUsers, mockModules, mockCheatAttempts } from '../data/mockData';

const AdminDashboard = ({ toggleDarkMode, darkMode }) => {
  return (
    <AdminLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            Tableau de Bord Administrateur
          </Typography>
          
          {/* Statistiques générales */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 48, color: '#ff9900', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.totalStudents}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Étudiants Total
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.activeStudents}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Étudiants Actifs
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.completedModules}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Modules Complétés
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <VerifiedUserIcon sx={{ fontSize: 48, color: '#673ab7', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.issuedCertificates}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Certificats Émis
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <WarningIcon sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.cheatAttempts}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tentatives de Triche
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 48, color: '#009688', mb: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {mockStatistics.averageScore}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Score Moyen
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Deux colonnes de contenus */}
          <Grid container spacing={4}>
            {/* Colonne de gauche */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Dernières connexions
                </Typography>
                <List>
                  {mockUsers.slice(0, 5).map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItem>
                        <ListItemText 
                          primary={user.name} 
                          secondary={`${user.email} • ${user.lastLogin}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Modules Populaires
                </Typography>
                <List>
                  {mockModules.slice(0, 3).map((module) => (
                    <React.Fragment key={module.id}>
                      <ListItem>
                        <ListItemText 
                          primary={module.title} 
                          secondary={`${module.enrolledStudents} étudiants • ${module.completionRate}% taux de complétion`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            {/* Colonne de droite */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Incidents récents de triche
                </Typography>
                {mockCheatAttempts.length > 0 ? (
                  <List>
                    {mockCheatAttempts.map((attempt) => (
                      <React.Fragment key={attempt.id}>
                        <ListItem>
                          <ListItemText 
                            primary={`${attempt.studentName} - ${attempt.type}`} 
                            secondary={`${attempt.examTitle} • ${attempt.date} à ${attempt.timestamp}`}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Aucun incident récent
                  </Typography>
                )}
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Progression Mensuelle
                </Typography>
                <Box sx={{ height: 300, p: 2 }}>
                  {/* Ici tu pourrais ajouter un graphique avec Chart.js ou Recharts */}
                  {mockStatistics.monthlyProgress.map((data, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" component="div">
                          {data.month} 2025
                        </Typography>
                        <Typography variant="body2">
                          {data.students} étudiants • {data.completions} modules complétés
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;