// src/pages/AdminQCM.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton, 
  TextField, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Checkbox, 
  Grid, 
  Card, 
  CardContent,
  Switch
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon 
} from '@mui/icons-material';

// Données fictives pour les QCM
const mockQCMs = [
  {
    id: 1,
    courseId: 1,
    title: "QCM: Variables et Types",
    questions: [
      {
        id: 1,
        text: "Quel type de variable est utilisé pour stocker des nombres entiers en JavaScript?",
        options: [
          { id: 1, text: "String", isCorrect: false },
          { id: 2, text: "Float", isCorrect: false },
          { id: 3, text: "Number", isCorrect: true },
          { id: 4, text: "Integer", isCorrect: false }
        ],
        type: "single"
      },
      {
        id: 2,
        text: "Quelles sont les bonnes pratiques pour nommer les variables? (plusieurs réponses possibles)",
        options: [
          { id: 1, text: "Utiliser le camelCase", isCorrect: true },
          { id: 2, text: "Commencer par un chiffre", isCorrect: false },
          { id: 3, text: "Utiliser des noms descriptifs", isCorrect: true },
          { id: 4, text: "Utiliser des caractères spéciaux comme @ ou #", isCorrect: false }
        ],
        type: "multiple"
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    title: "QCM: Structures Conditionnelles",
    questions: [
      {
        id: 1,
        text: "Quelle condition sera évaluée comme vraie?",
        options: [
          { id: 1, text: "if(0)", isCorrect: false },
          { id: 2, text: "if('')", isCorrect: false },
          { id: 3, text: "if(1)", isCorrect: true },
          { id: 4, text: "if(null)", isCorrect: false }
        ],
        type: "single"
      }
    ]
  }
];

const AdminQCM = () => {
  const [tabValue, setTabValue] = useState(0);
  const [qcms, setQCMs] = useState(mockQCMs);
  const [selectedQCM, setSelectedQCM] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSelectQCM = (qcm) => {
    setSelectedQCM(qcm);
    setCurrentQuestion(null);
    setEditMode(false);
  };
  
  const handleEditQCM = () => {
    setEditMode(true);
  };
  
  const handleSaveQCM = () => {
    if (selectedQCM) {
      setQCMs(qcms.map(q => q.id === selectedQCM.id ? selectedQCM : q));
    }
    setEditMode(false);
  };
  
  const handleSelectQuestion = (question) => {
    setCurrentQuestion(question);
  };
  
  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Gestion des QCM
        </Typography>
        
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { py: 2 },
              '& .Mui-selected': { color: '#ff9900' },
              '& .MuiTabs-indicator': { bgcolor: '#ff9900' }
            }}
          >
            <Tab label="Liste des QCM" />
            <Tab label="Création / Édition" />
            <Tab label="Statistiques" />
          </Tabs>
          
          <Box sx={{ p: 0 }}>
            {/* Onglet Liste des QCM */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{ 
                    mb: 3,
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  Nouveau QCM
                </Button>
                
                <List>
                  {qcms.map((qcm) => (
                    <React.Fragment key={qcm.id}>
                      <ListItem 
                        button 
                        onClick={() => handleSelectQCM(qcm)}
                        selected={selectedQCM && selectedQCM.id === qcm.id}
                      >
                        <ListItemText 
                          primary={qcm.title} 
                          secondary={`${qcm.questions.length} questions`} 
                        />
                        <IconButton color="primary" edge="end">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" edge="end" sx={{ ml: 1 }}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Onglet Création / Édition */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                {selectedQCM ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      {editMode ? (
                        <TextField 
                          value={selectedQCM.title} 
                          onChange={(e) => setSelectedQCM({...selectedQCM, title: e.target.value})}
                          variant="outlined"
                          fullWidth
                          sx={{ maxWidth: 500 }}
                        />
                      ) : (
                        <Typography variant="h5" component="h2">
                          {selectedQCM.title}
                        </Typography>
                      )}
                      
                      {editMode ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<SaveIcon />}
                          onClick={handleSaveQCM}
                          sx={{ 
                            bgcolor: '#4caf50', 
                            '&:hover': { bgcolor: '#388e3c' } 
                          }}
                        >
                          Enregistrer
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          startIcon={<EditIcon />}
                          onClick={handleEditQCM}
                          sx={{ 
                            bgcolor: '#ff9900', 
                            '&:hover': { bgcolor: '#e68a00' } 
                          }}
                        >
                          Modifier
                        </Button>
                      )}
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                      // Continuation de AdminQCM.jsx
                        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                          Questions
                        </Typography>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {selectedQCM.questions.map((question) => (
                              <React.Fragment key={question.id}>
                                <ListItem 
                                  button 
                                  onClick={() => handleSelectQuestion(question)}
                                  selected={currentQuestion && currentQuestion.id === question.id}
                                >
                                  <ListItemText 
                                    primary={question.text.length > 30 ? `${question.text.substring(0, 30)}...` : question.text} 
                                    secondary={`Type: ${question.type === 'single' ? 'Choix unique' : 'Choix multiple'}`} 
                                  />
                                </ListItem>
                                <Divider component="li" />
                              </React.Fragment>
                            ))}
                          </List>
                          {editMode && (
                            <Button 
                              fullWidth 
                              variant="outlined" 
                              startIcon={<AddIcon />}
                              sx={{ mt: 2 }}
                            >
                              Ajouter une question
                            </Button>
                          )}
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        {currentQuestion ? (
                          <Box>
                            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                              Détails de la question
                            </Typography>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                              {editMode ? (
                                <Box>
                                  <TextField
                                    label="Question"
                                    value={currentQuestion.text}
                                    onChange={(e) => {
                                      const updatedQuestion = {...currentQuestion, text: e.target.value};
                                      setCurrentQuestion(updatedQuestion);
                                      const updatedQuestions = selectedQCM.questions.map(q => 
                                        q.id === currentQuestion.id ? updatedQuestion : q
                                      );
                                      setSelectedQCM({...selectedQCM, questions: updatedQuestions});
                                    }}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    sx={{ mb: 3 }}
                                  />
                                  
                                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
                                      Type de question:
                                    </Typography>
                                    <RadioGroup
                                      row
                                      value={currentQuestion.type}
                                      onChange={(e) => {
                                        const updatedQuestion = {...currentQuestion, type: e.target.value};
                                        setCurrentQuestion(updatedQuestion);
                                        const updatedQuestions = selectedQCM.questions.map(q => 
                                          q.id === currentQuestion.id ? updatedQuestion : q
                                        );
                                        setSelectedQCM({...selectedQCM, questions: updatedQuestions});
                                      }}
                                    >
                                      <FormControlLabel value="single" control={<Radio />} label="Choix unique" />
                                      <FormControlLabel value="multiple" control={<Radio />} label="Choix multiple" />
                                    </RadioGroup>
                                  </FormControl>
                                  
                                  <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
                                    Options:
                                  </Typography>
                                  {currentQuestion.options.map((option, index) => (
                                    <Box key={option.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                      <TextField
                                        value={option.text}
                                        onChange={(e) => {
                                          const updatedOptions = [...currentQuestion.options];
                                          updatedOptions[index] = {...option, text: e.target.value};
                                          const updatedQuestion = {...currentQuestion, options: updatedOptions};
                                          setCurrentQuestion(updatedQuestion);
                                          const updatedQuestions = selectedQCM.questions.map(q => 
                                            q.id === currentQuestion.id ? updatedQuestion : q
                                          );
                                          setSelectedQCM({...selectedQCM, questions: updatedQuestions});
                                        }}
                                        fullWidth
                                        sx={{ mr: 2 }}
                                      />
                                      {currentQuestion.type === 'single' ? (
                                        <Radio
                                          checked={option.isCorrect}
                                          onChange={(e) => {
                                            const updatedOptions = currentQuestion.options.map(o => 
                                              ({...o, isCorrect: o.id === option.id})
                                            );
                                            const updatedQuestion = {...currentQuestion, options: updatedOptions};
                                            setCurrentQuestion(updatedQuestion);
                                            const updatedQuestions = selectedQCM.questions.map(q => 
                                              q.id === currentQuestion.id ? updatedQuestion : q
                                            );
                                            setSelectedQCM({...selectedQCM, questions: updatedQuestions});
                                          }}
                                        />
                                      ) : (
                                        <Checkbox
                                          checked={option.isCorrect}
                                          onChange={(e) => {
                                            const updatedOptions = [...currentQuestion.options];
                                            updatedOptions[index] = {...option, isCorrect: e.target.checked};
                                            const updatedQuestion = {...currentQuestion, options: updatedOptions};
                                            setCurrentQuestion(updatedQuestion);
                                            const updatedQuestions = selectedQCM.questions.map(q => 
                                              q.id === currentQuestion.id ? updatedQuestion : q
                                            );
                                            setSelectedQCM({...selectedQCM, questions: updatedQuestions});
                                          }}
                                        />
                                      )}
                                      <IconButton color="error">
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  ))}
                                  <Button 
                                    variant="outlined" 
                                    startIcon={<AddIcon />}
                                    sx={{ mt: 1 }}
                                  >
                                    Ajouter une option
                                  </Button>
                                </Box>
                              ) : (
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    {currentQuestion.text}
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Type: {currentQuestion.type === 'single' ? 'Choix unique' : 'Choix multiple'}
                                  </Typography>
                                  <Divider sx={{ my: 2 }} />
                                  <List>
                                    {currentQuestion.options.map((option) => (
                                      <ListItem key={option.id}>
                                        {option.isCorrect ? (
                                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                        ) : (
                                          <CancelIcon color="error" sx={{ mr: 1 }} />
                                        )}
                                        <ListItemText primary={option.text} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              )}
                            </Paper>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="subtitle1" color="text.secondary">
                              Sélectionnez une question pour voir les détails
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Sélectionnez un QCM dans l'onglet "Liste des QCM" pour commencer l'édition
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Onglet Statistiques */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Performance des QCM
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        {/* Ici tu pourrais ajouter un graphique avec Chart.js ou Recharts */}
                        <Typography variant="body1">
                          Graphique de performance (à implémenter)
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Questions fréquemment manquées
                      </Typography>
                      <List>
                        {[1, 2, 3].map((item) => (
                          <React.Fragment key={item}>
                            <ListItem>
                              <ListItemText 
                                primary={`Question ${item}: Comment stocker des données persistantes dans le navigateur?`} 
                                secondary={`Taux d'erreur: ${70 - item * 15}%`} 
                              />
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminQCM;