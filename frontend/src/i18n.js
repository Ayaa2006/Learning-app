// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'e-learning': 'E-Learning',
      'modules': 'Modules',
      'courses': 'Courses',
      'certifications': 'Certifications',
      'login': 'Login',
      'signup': 'Sign Up',
      'search_placeholder': 'Search for courses...',
      'welcome': 'Welcome to',
      'start_now': 'Start now',
      'highlights': 'Highlights',
      'structured_modules': 'Structured Modules',
      'progressive_learning': 'Progressive learning path',
      'interactive_quizzes': 'Interactive learning quizzes',
      'exam_security': 'Exam Security',
      'intelligent_monitoring': 'Intelligent monitoring',
      'advanced_cheat_detection': 'Advanced cheat detection',
      'credibility': 'Credibility',
      'verifiable_certificates': 'Verifiable certificates',
      'educational_standards': 'Compliant with educational standards',
      'popular_modules': 'Popular Modules',
      'module_description': 'Module description with the main topics covered and the skills you will acquire.',
      'duration': 'Duration',
      'learn_more': 'Learn more',
      'see_all_modules': 'See all modules',
      'quick_links': 'Quick Links',
      'contact': 'Contact',
      'all_rights_reserved': 'All rights reserved',
    }
  },
  fr: {
    translation: {
      'e-learning': 'E-Learning',
      'modules': 'Modules',
      'courses': 'Cours',
      'certifications': 'Certifications',
      'login': 'Connexion',
      'signup': 'S\'inscrire',
      'search_placeholder': 'Rechercher des cours...',
      'welcome': 'Bienvenue à',
      'start_now': 'Commencer maintenant',
      'highlights': 'Points forts',
      'structured_modules': 'Modules Structurés',
      'progressive_learning': 'Parcours pédagogique progressif',
      'interactive_quizzes': 'QCM d\'apprentissage interactifs',
      'exam_security': 'Sécurité des Examens',
      'intelligent_monitoring': 'Surveillance intelligente',
      'advanced_cheat_detection': 'Détection de triche avancée',
      'credibility': 'Crédibilité',
      'verifiable_certificates': 'Certificats vérifiables',
      'educational_standards': 'Conforme aux standards éducatifs',
      'popular_modules': 'Modules Populaires',
      'module_description': 'Description du module avec les principaux points abordés et les compétences que vous allez acquérir.',
      'duration': 'Durée',
      'learn_more': 'En savoir plus',
      'see_all_modules': 'Voir tous les modules',
      'quick_links': 'Liens Rapides',
      'contact': 'Contact',
      'all_rights_reserved': 'Tous droits réservés',
    }
  },
  es: {
    translation: {
      'e-learning': 'E-Learning',
      'modules': 'Módulos',
      'courses': 'Cursos',
      'certifications': 'Certificaciones',
      'login': 'Iniciar sesión',
      'signup': 'Registrarse',
      'search_placeholder': 'Buscar cursos...',
      'welcome': 'Bienvenido a',
      'start_now': 'Empezar ahora',
      'highlights': 'Destacados',
      'structured_modules': 'Módulos Estructurados',
      'progressive_learning': 'Recorrido pedagógico progresivo',
      'interactive_quizzes': 'Cuestionarios interactivos de aprendizaje',
      'exam_security': 'Seguridad de Exámenes',
      'intelligent_monitoring': 'Vigilancia inteligente',
      'advanced_cheat_detection': 'Detección avanzada de trampas',
      'credibility': 'Credibilidad',
      'verifiable_certificates': 'Certificados verificables',
      'educational_standards': 'Conforme a los estándares educativos',
      'popular_modules': 'Módulos Populares',
      'module_description': 'Descripción del módulo con los principales temas tratados y las habilidades que adquirirás.',
      'duration': 'Duración',
      'learn_more': 'Más información',
      'see_all_modules': 'Ver todos los módulos',
      'quick_links': 'Enlaces Rápidos',
      'contact': 'Contacto',
      'all_rights_reserved': 'Todos los derechos reservados',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;