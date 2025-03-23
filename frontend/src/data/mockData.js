// src/data/mockData.js

export const mockUsers = [
    { id: 1, name: "Jane Doe", email: "jane.doe@universite.edu", birthDate: "1995-05-15", role: "student", lastLogin: "2025-03-15", progress: 65 },
    { id: 2, name: "John Smith", email: "john.smith@universite.edu", birthDate: "1998-11-22", role: "student", lastLogin: "2025-03-18", progress: 42 },
    { id: 3, name: "Alice Johnson", email: "alice.j@universite.edu", birthDate: "1997-07-10", role: "student", lastLogin: "2025-03-19", progress: 89 },
    { id: 4, name: "Admin User", email: "admin@elearning.com", birthDate: "1990-01-01", role: "admin", lastLogin: "2025-03-20", progress: 100 },
  ];
  
  export const mockModules = [
    { id: 1, title: "Introduction à la Programmation", description: "Fondamentaux de la programmation", courseCount: 5, enrolledStudents: 128, completionRate: 65 },
    { id: 2, title: "Design Web", description: "Principes de conception d'interfaces", courseCount: 8, enrolledStudents: 94, completionRate: 58 },
    { id: 3, title: "Business Intelligence", description: "Analyse de données d'entreprise", courseCount: 6, enrolledStudents: 76, completionRate: 42 },
    { id: 4, title: "Marketing Digital", description: "Stratégies marketing en ligne", courseCount: 7, enrolledStudents: 115, completionRate: 70 },
  ];
  
  export const mockCourses = [
    { id: 1, moduleId: 1, title: "Variables et Types de Données", duration: "45 min", completionRate: 78, studentCount: 128 },
    { id: 2, moduleId: 1, title: "Structures Conditionnelles", duration: "60 min", completionRate: 72, studentCount: 126 },
    { id: 3, moduleId: 1, title: "Boucles et Itérations", duration: "50 min", completionRate: 65, studentCount: 120 },
    { id: 4, moduleId: 2, title: "Principes de Design UI", duration: "70 min", completionRate: 62, studentCount: 94 },
    { id: 5, moduleId: 2, title: "Théorie des Couleurs", duration: "55 min", completionRate: 59, studentCount: 90 },
  ];
  
  export const mockExams = [
    { id: 1, moduleId: 1, title: "Examen Final: Programmation", totalStudents: 128, passed: 82, failed: 31, pending: 15, avgScore: 75 },
    { id: 2, moduleId: 2, title: "Examen Final: Design Web", totalStudents: 94, passed: 50, failed: 29, pending: 15, avgScore: 68 },
    { id: 3, moduleId: 3, title: "Examen Final: Business Intelligence", totalStudents: 76, passed: 31, failed: 25, pending: 20, avgScore: 62 },
  ];
  
  export const mockCertificates = [
    { id: 1, studentId: 1, studentName: "Jane Doe", moduleTitle: "Introduction à la Programmation", issueDate: "2025-02-15", verificationCode: "CERT-A1B2C3" },
    { id: 2, studentId: 3, studentName: "Alice Johnson", moduleTitle: "Introduction à la Programmation", issueDate: "2025-03-01", verificationCode: "CERT-D4E5F6" },
    { id: 3, studentId: 3, studentName: "Alice Johnson", moduleTitle: "Design Web", issueDate: "2025-03-10", verificationCode: "CERT-G7H8I9" },
  ];
  
  export const mockCheatAttempts = [
    { id: 1, studentId: 2, studentName: "John Smith", examTitle: "Examen Final: Programmation", date: "2025-03-10", type: "Absence de visage", timestamp: "14:25:30" },
    { id: 2, studentId: 2, studentName: "John Smith", examTitle: "Examen Final: Programmation", date: "2025-03-10", type: "Sortie de fenêtre", timestamp: "14:38:12" },
  ];
  
  export const mockStatistics = {
    totalStudents: 298,
    activeStudents: 245,
    completedModules: 327,
    issuedCertificates: 89,
    cheatAttempts: 28,
    averageScore: 72,
    monthlyProgress: [
      { month: "Jan", students: 220, completions: 42 },
      { month: "Feb", students: 250, completions: 55 },
      { month: "Mar", students: 298, completions: 63 }
    ]
  };

  