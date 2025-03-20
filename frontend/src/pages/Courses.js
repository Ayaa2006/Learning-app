import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Card, CardContent, CardMedia, Tabs, Tab, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import courseImage1 from "../pages/Artificial_Intelligence.png";

const courses = [
  { title: "Introduction à l'IA", category: "Intelligence Artificielle", image: courseImage1 },
  { title: "Développement Web", category: "Programmation", image: "/images/dev-web.jpg" },
  { title: "Data Science et ML", category: "Data Science", image: "/images/data-science.jpg" },
  { title: "Marketing Digital", category: "Marketing", image: "/images/marketing.jpg" },
  { title: "Leadership et Management", category: "Business", image: "/images/leadership.jpg" },
];

const categories = ["Tous", "Intelligence Artificielle", "Programmation", "Data Science", "Marketing", "Business"];

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche
  const [anchorEl, setAnchorEl] = useState(null); // État pour le menu
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredCourses = selectedCategory === "Tous"
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  const handleSearch = () => {
    if (searchTerm) {
      console.log("Recherche pour:", searchTerm);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
    

      {/* ➤ Section principale */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h3" align="center" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
          Explorez Nos Cours
        </Typography>
        
        {/* Barre de catégories */}
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} value={category} />
          ))}
        </Tabs>

        {/* Liste des cours */}
        <Grid container spacing={3}>
          {filteredCourses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345 }}>
                {/* Image du cours avec gestion d'erreur */}
                <CardMedia 
                  component="img" 
                  height="200" 
                  image={course.image} 
                  alt={course.title} 
                  onError={() => console.log(`Image not found for course: ${course.title}`)} 
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{course.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{course.category}</Typography>
                </CardContent>
                <Button variant="contained" color="primary" sx={{ m: 1 }}>
                  Voir plus ⥱
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ➤ Pied de page */}
      <Box component="footer" sx={{ backgroundColor: "#003366", color: "white", py: 3, mt: 5, textAlign: "center" }}>
        <Typography variant="body2">
          © 2025 SkillPath | Tous droits réservés.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Contact : support@elearning.com
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
