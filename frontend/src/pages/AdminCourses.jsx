// src/pages/AdminCourses.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { mockCourses, mockModules } from '../data/mockData';

const AdminCourses = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    moduleId: '',
    title: '',
    duration: '',
  });
  
  const handleOpen = (course = { id: null, moduleId: '', title: '', duration: '' }) => {
    setCurrentCourse(course);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSave = () => {
    if (currentCourse.id) {
      // Mise à jour d'un cours existant
      setCourses(courses.map(course => 
        course.id === currentCourse.id ? currentCourse : course
      ));
    } else {
      // Ajout d'un nouveau cours
      const newCourse = {
        ...currentCourse,
        id: Math.max(...courses.map(c => c.id)) + 1,
        completionRate: 0,
        studentCount: 0
      };
      setCourses([...courses, newCourse]);
    }
    handleClose();
  };
  
  const handleDelete = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Gestion des Cours
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            sx={{ 
              bgcolor: '#ff9900', 
              '&:hover': { bgcolor: '#e68a00' } 
            }}
          >
            Ajouter un Cours
          </Button>
        </Box>
        
        {/* Barre de recherche */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ maxWidth: 500 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
        
        {/* Tableau des cours */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Durée</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre d'Étudiants</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Taux de Complétion</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {mockModules.find(m => m.id === course.moduleId)?.title || "Module inconnu"}
                  </TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.studentCount}</TableCell>
                  <TableCell>{`${course.completionRate}%`}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpen(course)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(course.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      
      {/* Dialogue pour ajouter/modifier un cours */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCourse.id ? "Modifier un Cours" : "Ajouter un Cours"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Titre du Cours"
                fullWidth
                value={currentCourse.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  name="moduleId"
                  value={currentCourse.moduleId}
                  onChange={handleChange}
                  label="Module"
                >
                  {mockModules.map((module) => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="duration"
                label="Durée (ex: 45 min)"
                fullWidth
                value={currentCourse.duration}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#e68a00' } }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses;