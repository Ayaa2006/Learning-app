// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configurer axios pour envoyer le token JWT avec chaque requête
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me')
};

// Services du panneau d'administration
export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Modules
  getModules: () => api.get('/admin/modules'),
  createModule: (moduleData) => api.post('/admin/modules', moduleData),
  updateModule: (id, moduleData) => api.put(`/admin/modules/${id}`, moduleData),
  deleteModule: (id) => api.delete(`/admin/modules/${id}`),
  
  // Cours
  getCourses: () => api.get('/admin/courses'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  
  // QCM
  getQuizzes: () => api.get('/admin/quizzes'),
  getQuiz: (id) => api.get(`/admin/quizzes/${id}`),
  createQuiz: (quizData) => api.post('/admin/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/admin/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  
  // Examens
  getExams: () => api.get('/admin/exams'),
  createExam: (examData) => api.post('/admin/exams', examData),
  updateExam: (id, examData) => api.put(`/admin/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/admin/exams/${id}`),
  
  // Détection de triche
  getCheatIncidents: () => api.get('/admin/cheat-incidents'),
  updateCheatDetectionSettings: (settings) => api.put('/admin/cheat-detection', settings),
  
  // Statistiques
  getAnalytics: () => api.get('/admin/analytics'),
  
  // Utilisateurs
  getStudents: () => api.get('/admin/students'),
  
  // Certificats
  getCertificates: () => api.get('/admin/certificates')
};


export default api;