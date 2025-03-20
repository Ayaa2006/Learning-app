// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  AppBar, 
  Toolbar, 
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Book as BookIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';

// Style constants
const darkBg = 'rgba(17, 22, 35, 0.95)';
const primaryColor = '#ff9900'; // Orange comme accent
const lightText = '#ffffff';
const darkText = '#0a0e17';
const accentColor = '#ff9900';
  
const Home = () => {
  return (
    <Box sx={{ bgcolor: darkBg, color: lightText, minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar position="static" sx={{ bgcolor: darkBg, boxShadow: 'none', borderBottom: '1px solid rgba(16, 14, 52, 0.55)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Skill<span style={{ color: accentColor }}>Path</span>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button color="inherit" component={Link} to="/modules">Modules</Button>
            <Button color="inherit" component={Link} to="/courses">Cours</Button>
            <Button color="inherit" component={Link} to="/certifications">Certifications</Button>
          </Box>
          
          <Box sx={{ ml: 3 }}>
            <Button 
              variant="text" 
              sx={{ color: lightText, mr: 1 }} 
              component={Link} 
              to="/login"
            >
              Connexion
            </Button>
            <Button 
              variant="contained"
              sx={{ 
                bgcolor: primaryColor, 
                color: darkText,
                '&:hover': { bgcolor: '#ffb347' }
              }}
              component={Link}
              to="/register"
            >
              S'inscrire
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          py: 15, 
          backgroundImage: 'url("/images/Background.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(10, 14, 23, 0.7)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 4
              }}
            >
              Bienvenue à <span style={{ color: primaryColor }}>SkillPath</span>
            </Typography>
            <Divider 
              sx={{ 
                width: '100px', 
                height: '4px', 
                bgcolor: primaryColor,
                mx: 'auto',
                mb: 4 
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 6,
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              Formez-vous avec des modules structurés, maximisez vos compétences
              avec des stratégies d'apprentissage intelligentes, et obtenez des certifications reconnues.
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: primaryColor, 
                color: darkText,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#ffb347' }
              }}
              component={Link}
              to="/register"
            >
              Commencer maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Highlights Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            Highlights
          </Typography>
          <Divider 
            sx={{ 
              width: '100px', 
              height: '4px', 
              bgcolor: primaryColor,
              mx: 'auto',
              mb: 8
            }} 
          />

          <Grid container spacing={4}>
            {/* First highlight column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
                  Modules Structurés
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BookIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  Parcours pédagogique progressif
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  QCM d'apprentissage interactifs
                </Typography>
              </Box>
            </Grid>

            {/* Second highlight column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
                  Sécurité des Examens
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AssignmentIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  Surveillance intelligente
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedUserIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  Détection de triche avancée
                </Typography>
              </Box>
            </Grid>

            {/* Third highlight column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
                  Crédibilité
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedUserIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  Certificats vérifiables
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ color: primaryColor, mr: 2 }} />
                <Typography>
                  Conforme aux standards éducatifs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Modules */}
      <Box sx={{ py: 10, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            Modules Populaires
          </Typography>
          <Divider 
            sx={{ 
              width: '100px', 
              height: '4px', 
              bgcolor: primaryColor,
              mx: 'auto',
              mb: 8
            }} 
          />

          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item key={item} xs={12} md={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  color: lightText,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }
                }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                      Module {item}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
                      Description du module avec les principaux points abordés et les compétences que vous allez acquérir.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.6)">
                        Durée: 8 heures
                      </Typography>
                      <Button 
                        variant="outlined" 
                        component={Link} 
                        to={`/modules/${item}`}
                        sx={{ 
                          color: primaryColor, 
                          borderColor: primaryColor,
                          '&:hover': { 
                            borderColor: '#ffb347',
                            bgcolor: 'rgba(255,153,0,0.1)'
                          }
                        }}
                      >
                        En savoir plus
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: primaryColor, 
                color: darkText,
                '&:hover': { bgcolor: '#ffb347' }
              }}
              component={Link}
              to="/modules"
            >
              Voir tous les modules
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 5, bgcolor: 'rgba(0,0,0,0.3)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                SkillPath
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                La plateforme d'apprentissage en ligne qui facilite l'acquisition de compétences à travers un parcours pédagogique structuré.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Liens Rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to="/modules" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                  Modules
                </Link>
                <Link to="/courses" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                  Cours
                </Link>
                <Link to="/certifications" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                  Certifications
                </Link>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                support@elearning.com
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                +33 1 23 45 67 89
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
            &copy; {new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
