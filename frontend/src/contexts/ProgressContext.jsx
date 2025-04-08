// src/contexts/ProgressContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { progressService, moduleService } from '../services/api';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données de progression de l'utilisateur
  const loadUserProgress = async () => {
    try {
      setLoading(true);
      const response = await progressService.getUserProgress();
      setUserProgress(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des données de progression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Charger un module spécifique avec tous ses cours et quizzes
  const loadModule = async (moduleId) => {
    try {
      setLoading(true);
      const response = await moduleService.getModuleById(moduleId);
      setCurrentModule(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Erreur lors du chargement du module");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Commencer un module
  const startModule = async (moduleId) => {
    try {
      const response = await moduleService.startModule(moduleId);
      await loadUserProgress(); // Recharger les données de progression
      return response.data;
    } catch (err) {
      setError("Erreur lors du démarrage du module");
      console.error(err);
      return null;
    }
  };

  // Terminer un cours
  const completeCourse = async (courseId) => {
    try {
      await courseService.completeCourse(courseId);
      await loadUserProgress(); // Recharger les données de progression
      if (currentModule) {
        await loadModule(currentModule.id); // Recharger le module actuel
      }
      return true;
    } catch (err) {
      setError("Erreur lors de la complétion du cours");
      console.error(err);
      return false;
    }
  };

  // Soumettre un QCM
  const submitQuiz = async (quizId, answers) => {
    try {
      const response = await quizService.submitQuiz(quizId, answers);
      await loadUserProgress(); // Recharger les données de progression
      return response.data;
    } catch (err) {
      setError("Erreur lors de la soumission du QCM");
      console.error(err);
      return null;
    }
  };

  // Soumettre un examen final
  const submitExam = async (examId, answers) => {
    try {
      const response = await examService.submitExam(examId, answers);
      await loadUserProgress(); // Recharger les données de progression
      return response.data;
    } catch (err) {
      setError("Erreur lors de la soumission de l'examen");
      console.error(err);
      return null;
    }
  };

  // Vérifier si l'examen final est disponible
  const isExamAvailable = () => {
    if (!currentModule) return false;

    // Vérifier si tous les cours sont terminés
    const allCoursesCompleted = currentModule.courses.every(course => course.completed);
    
    // Vérifier si tous les QCMs sont terminés
    const allQuizzesCompleted = currentModule.quizzes.every(quiz => quiz.completed);
    
    return allCoursesCompleted && allQuizzesCompleted;
  };

  // Charger les données de progression lors du montage du composant
  useEffect(() => {
    loadUserProgress();
  }, []);

  const value = {
    userProgress,
    currentModule,
    loading,
    error,
    loadUserProgress,
    loadModule,
    startModule,
    completeCourse,
    submitQuiz,
    submitExam,
    isExamAvailable
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Import du service qui était manquant dans le contexte
import { courseService, quizService, examService } from '../services/api';