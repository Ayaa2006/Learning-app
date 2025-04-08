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
// Service pour les modules de cours
export const moduleService = {
  getAllModules: () => api.get('/modules'),
  getModuleById: (moduleId) => api.get(`/modules/${moduleId}`),
  getUserModules: () => api.get('/modules/user'),
  startModule: (moduleId) => api.post(`/modules/${moduleId}/start`),
};

// Service pour les cours
export const courseService = {
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  startCourse: (courseId) => api.post(`/courses/${courseId}/start`),
  completeCourse: (courseId) => api.post(`/courses/${courseId}/complete`),
};

// Service pour les QCM
export const quizService = {
  getQuizById: (quizId) => api.get(`/quizzes/${quizId}`),
  startQuiz: (quizId) => api.post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers }),
  getQuizResult: (quizId) => api.get(`/quizzes/${quizId}/result`),
};

// Service pour les examens finaux
export const examService = {
  getExamById: (examId) => api.get(`/exams/${examId}`),
  startExam: (examId) => api.post(`/exams/${examId}/start`),
  submitExam: (examId, answers) => api.post(`/exams/${examId}/submit`, { answers }),
  getExamResult: (examId) => api.get(`/exams/${examId}/result`),
};

// Service pour la progression de l'utilisateur
export const progressService = {
  getUserProgress: () => api.get('/progress'),
  getModuleProgress: (moduleId) => api.get(`/progress/module/${moduleId}`),
};

// Service pour les certificats
export const certificateService = {
  getUserCertificates: () => api.get('/certificates'),
  getCertificateById: (certificateId) => api.get(`/certificates/${certificateId}`),
};




export default api;