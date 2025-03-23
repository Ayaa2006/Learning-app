// src/pages/ModuleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
// Suppression de l'import Signal problématique
import NetworkCell from '@mui/icons-material/NetworkCell';
import { 
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// Suppression de l'import SignalIcon problématique
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArticleIcon from '@mui/icons-material/Article';
import SendIcon from '@mui/icons-material/Send';

// Renommé en ModuleDetails pour correspondre au nom du fichier
const ModuleDetails = () => {
  const theme = useTheme();
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
        try {
          // Collection de modules avec détails complets
          const modules = [
            {
              id: 1,
              title: 'Intelligence Artificielle: Fondamentaux',
              description: 'Découvrez les concepts clés de l\'IA, des algorithmes fondamentaux aux applications modernes.',
              image: '/images/bck7.png',
              duration: '12 heures',
              lessons: 24,
              level: 'Intermédiaire',
              rating: 4.8,
              reviews: 428,
              students: 4500,
              category: 'data-science',
              instructor: {
                name: 'Dr. Sophie Durand',
                avatar: '/images/instructors/sophie.jpg',
                bio: 'Docteure en Intelligence Artificielle avec plus de 10 ans d\'expérience dans la recherche et l\'industrie. Spécialisée en deep learning et réseaux de neurones.'
              },
              featured: true,
              tags: ['Machine Learning', 'Deep Learning', 'Neural Networks'],
              lastUpdated: '2025-01-15',
              content: [
                {
                  title: 'Introduction à l\'Intelligence Artificielle',
                  type: 'article',
                  duration: '1 heure',
                  description: 'Histoire et concepts fondamentaux de l\'IA, différences entre IA faible et IA forte.'
                },
                {
                  title: 'Principes du Machine Learning',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Comprendre les différents types d\'apprentissage automatique: supervisé, non supervisé et par renforcement.'
                },
                {
                  title: 'Réseaux de Neurones et Deep Learning',
                  type: 'video',
                  duration: '4 heures',
                  description: 'Fonctionnement des réseaux de neurones, architectures populaires et techniques d\'optimisation.'
                },
                {
                  title: 'Applications pratiques de l\'IA',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Exploration de cas d\'usage réels et implémentations dans différents secteurs.'
                }
              ],
              reviews: [
                {
                  user: {
                    name: 'Alexandre Dupont',
                    avatar: '/images/avatars/avatar1.jpg'
                  }, 
                  rating: 5,
                  comment: 'Formation exceptionnelle, claire et progressive. Parfaite pour comprendre les bases de l\'IA sans se perdre dans les détails techniques.',
                  date: 'il y a 2 semaines'
                },
                {
                  user: {
                    name: 'Marie Lefèvre',
                    avatar: '/images/avatars/avatar2.jpg'
                  }, 
                  rating: 4.5,
                  comment: 'Excellente introduction à l\'IA. Les exercices pratiques sont particulièrement utiles pour consolider les concepts théoriques.',
                  date: 'il y a 1 mois'
                }
              ]
            },
            {
              id: 2,
              title: 'Développement Web Full-Stack',
              description: 'Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.',
              image: '/images/bck11.png',
              duration: '24 heures',
              lessons: 42,
              level: 'Avancé',
              rating: 4.7,
              reviews: 612,
              students: 6200,
              category: 'programming',
              instructor: {
                name: 'Thomas Martin',
                avatar: '/images/instructors/thomas.jpg',
                bio: 'Développeur senior avec 15 ans d\'expérience dans le développement web. Expert en JavaScript, React et Node.js, j\'ai travaillé sur des projets pour des startups et des entreprises Fortune 500.'
              },
              featured: true,
              tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
              lastUpdated: '2025-02-10',
              content: [
                {
                  title: 'Bases du Full-Stack Development',
                  type: 'article',
                  duration: '2 heures',
                  description: 'Comprendre l\'architecture full-stack et l\'interaction entre frontend et backend.'
                },
                {
                  title: 'React: Fondamentaux et Hooks',
                  type: 'video',
                  duration: '6 heures',
                  description: 'Construire des interfaces utilisateur modernes avec React et les nouveaux Hooks.'
                },
                {
                  title: 'Node.js et Express',
                  type: 'video',
                  duration: '5 heures',
                  description: 'Développer des serveurs robustes et des API RESTful avec Node.js et Express.'
                },
                {
                  title: 'MongoDB et Mongoose',
                  type: 'video',
                  duration: '4 heures',
                  description: 'Conception et implémentation de bases de données NoSQL avec MongoDB.'
                },
                {
                  title: 'Authentification et Sécurité',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Implémenter JWT, OAuth et d\'autres mécanismes d\'authentification sécurisés.'
                },
                {
                  title: 'Déploiement d\'Applications Full-Stack',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Techniques et meilleures pratiques pour déployer des applications sur des services cloud.'
                }
              ],
              reviews: [
                {
                  user: {
                    name: 'Julien Moreau',
                    avatar: '/images/avatars/avatar3.jpg'
                  }, 
                  rating: 5,
                  comment: 'La meilleure formation sur le développement full-stack que j\'ai suivie. Thomas est un excellent pédagogue et les projets pratiques sont très formateurs.',
                  date: 'il y a 3 semaines'
                },
                {
                  user: {
                    name: 'Émilie Laurent',
                    avatar: '/images/avatars/avatar4.jpg'
                  }, 
                  rating: 4.5,
                  comment: 'Contenu très complet et bien expliqué. J\'ai pu créer mon application web complète en suivant les étapes du cours.',
                  date: 'il y a 2 mois'
                }
              ]
            },
            {
              id: 3,
              title: 'Data Science & Visualisation',
              description: 'Apprenez à analyser et visualiser des données complexes pour en extraire des insights pertinents.',
              image: '/images/bck2.png',
              duration: '16 heures',
              lessons: 28,
              level: 'Intermédiaire',
              rating: 4.9,
              reviews: 523,
              students: 5800,
              category: 'data-science',
              instructor: {
                name: 'Emma Dubois',
                avatar: '/images/instructors/emma.jpg',
                bio: 'Data scientist avec 8 ans d\'expérience dans l\'analyse et la visualisation de données. Spécialiste en Python et outils de visualisation, j\'ai travaillé sur des projets d\'analyse pour des entreprises de divers secteurs.'
              },
              featured: true,
              tags: ['Python', 'Pandas', 'Matplotlib', 'D3.js'],
              lastUpdated: '2025-01-28',
              content: [
                {
                  title: 'Introduction à la Data Science',
                  type: 'article',
                  duration: '1 heure',
                  description: 'Fondamentaux de la data science et présentation des outils essentiels.'
                },
                {
                  title: 'Analyse de données avec Pandas',
                  type: 'video',
                  duration: '4 heures',
                  description: 'Manipulation, transformation et nettoyage de données avec la bibliothèque Pandas.'
                },
                {
                  title: 'Visualisation statique avec Matplotlib et Seaborn',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Création de graphiques informatifs et professionnels pour l\'analyse exploratoire.'
                },
                {
                  title: 'Visualisations interactives avec Plotly',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Création de tableaux de bord interactifs pour présenter vos données de manière engageante.'
                },
                {
                  title: 'Visualisations web avec D3.js',
                  type: 'video',
                  duration: '4 heures',
                  description: 'Utilisation de D3.js pour créer des visualisations de données web personnalisées et interactives.'
                }
              ],
              reviews: [
                {
                  user: {
                    name: 'Thomas Petit',
                    avatar: '/images/avatars/avatar5.jpg'
                  }, 
                  rating: 5,
                  comment: 'Excellente formation, très pratique et complète. Les exemples concrets aident vraiment à comprendre comment appliquer ces techniques dans des projets réels.',
                  date: 'il y a 1 mois'
                },
                {
                  user: {
                    name: 'Sophie Martin',
                    avatar: '/images/avatars/avatar6.jpg'
                  }, 
                  rating: 5,
                  comment: 'La partie sur D3.js est particulièrement bien expliquée. J\'ai pu créer des visualisations impressionnantes pour mon portfolio.',
                  date: 'il y a 2 mois'
                }
              ]
            },
            {
              id: 4,
              title: 'Fondamentaux de la Programmation Python',
              description: 'Une introduction complète à Python, l\'un des langages de programmation les plus polyvalents et populaires.',
              image: '/images/bck9.png',
              duration: '10 heures',
              lessons: 18,
              level: 'Débutant',
              rating: 4.6,
              reviews: 789,
              students: 12500,
              category: 'programming',
              instructor: {
                name: 'Lucas Bernard',
                avatar: '/images/instructors/lucas.jpg',
                bio: 'Développeur Python et formateur avec 10 ans d\'expérience. Passionné par l\'enseignement de la programmation aux débutants, j\'ai aidé des milliers d\'étudiants à maîtriser Python.'
              },
              featured: false,
              tags: ['Python', 'Algorithmique', 'Structures de données'],
              lastUpdated: '2025-02-05',
              content: [
                {
                  title: 'Introduction à Python et configuration',
                  type: 'video',
                  duration: '1 heure',
                  description: 'Installation de Python, environnements virtuels et premiers pas avec le langage.'
                },
                {
                  title: 'Types de données et variables',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Comprendre les types fondamentaux en Python: nombres, chaînes, listes, dictionnaires.'
                },
                {
                  title: 'Structures de contrôle',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Maîtriser les conditions, boucles et l\'indentation en Python.'
                },
                {
                  title: 'Fonctions et modularité',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Créer et utiliser des fonctions, importer des modules, organiser son code.'
                },
                {
                  title: 'Structures de données avancées',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Utilisation avancée des listes, dictionnaires, tuples et ensembles.'
                }
              ],
              reviews: [
                {
                  user: {
                    name: 'Claire Dubois',
                    avatar: '/images/avatars/avatar7.jpg'
                  }, 
                  rating: 5,
                  comment: 'Parfait pour les débutants! Lucas explique les concepts complexes de manière simple et accessible.',
                  date: 'il y a 2 semaines'
                },
                {
                  user: {
                    name: 'Antoine Lefèvre',
                    avatar: '/images/avatars/avatar8.jpg'
                  }, 
                  rating: 4.5,
                  comment: 'Excellent cours pour débuter avec Python. Les exercices sont bien pensés et progressifs.',
                  date: 'il y a 1 mois'
                }
              ]
            },
            {
              id: 5,
              title: 'Marketing Digital Stratégique',
              description: 'Développez une stratégie marketing digitale efficace pour augmenter votre visibilité en ligne et générer des leads.',
              image: '/images/bck8.png',
              duration: '14 heures',
              lessons: 22,
              level: 'Intermédiaire',
              rating: 4.5,
              reviews: 356,
              students: 4200,
              category: 'business',
              instructor: {
                name: 'Julie Moreau',
                avatar: '/images/instructors/julie.jpg',
                bio: 'Consultante en marketing digital avec 12 ans d\'expérience. J\'ai travaillé avec des startups et des multinationales pour développer et optimiser leurs stratégies digitales.'
              },
              featured: false,
              tags: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
              lastUpdated: '2025-01-20',
              content: [
                {
                  title: 'Fondamentaux du marketing digital',
                  type: 'article',
                  duration: '1 heure',
                  description: 'Vue d\'ensemble des canaux et stratégies du marketing digital moderne.'
                },
                {
                  title: 'SEO: Optimisation pour les moteurs de recherche',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Techniques d\'optimisation on-page et off-page pour améliorer votre classement dans les résultats de recherche.'
                },
                {
                  title: 'Content Marketing',
                  type: 'video',
                  duration: '3 heures',
                  description: 'Création de contenus qui attirent et convertissent votre audience cible.'
                },
                {
                  title: 'Marketing sur les réseaux sociaux',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Stratégies pour les principales plateformes sociales: Facebook, Instagram, LinkedIn, Twitter.'
                },
                {
                  title: 'Email Marketing',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Création de campagnes d\'emails efficaces pour nurturing et conversion.'
                },
                {
                  title: 'Analytics et mesure de performance',
                  type: 'video',
                  duration: '2 heures',
                  description: 'Utilisation de Google Analytics et autres outils pour mesurer l\'efficacité de vos actions marketing.'
                }
              ],
              reviews: [
                {
                  user: {
                    name: 'Martin Dubois',
                    avatar: '/images/avatars/avatar9.jpg'
                  }, 
                  rating: 4.5,
                  comment: 'Formation très complète avec des conseils pratiques directement applicables. J\'ai pu améliorer considérablement la visibilité en ligne de mon entreprise.',
                  date: 'il y a 3 semaines'
                },
                {
                  user: {
                    name: 'Laura Blanc',
                    avatar: '/images/avatars/avatar10.jpg'
                  }, 
                  rating: 4,
                  comment: 'Bon cours avec beaucoup d\'informations utiles. J\'aurais aimé plus d\'études de cas, mais le contenu est solide.',
                  date: 'il y a 2 mois'
                }
              ]
            },
            {
                id: 7,
                title: 'Machine Learning Avancé',
                description: 'Exploration approfondie des algorithmes de machine learning et de leur mise en œuvre pratique.',
                image: '/images/bck22.png',
                duration: '20 heures',
                lessons: 36,
                level: 'Avancé',
                rating: 4.9,
                reviews: 287,
                students: 2900,
                category: 'data-science',
                instructor: {
                  name: 'Dr. Antoine Mercier',
                  avatar: '/images/instructors/antoine.jpg',
                  bio: 'Chercheur en intelligence artificielle et machine learning avec 12 ans d\'expérience. J\'ai travaillé sur des projets de recherche avancés et publié plusieurs articles dans des revues scientifiques prestigieuses.'
                },
                featured: false,
                tags: ['Scikit-learn', 'TensorFlow', 'Model Optimization', 'Feature Engineering'],
                lastUpdated: '2025-01-08',
                content: [
                  {
                    title: 'Algorithmes avancés de classification',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Étude des algorithmes SVM, Random Forest, et XGBoost pour la classification.'
                  },
                  {
                    title: 'Feature Engineering pour le Machine Learning',
                    type: 'video',
                    duration: '4 heures',
                    description: 'Techniques de création et de sélection de caractéristiques pour améliorer les performances des modèles.'
                  },
                  {
                    title: 'Neural Networks avec TensorFlow et Keras',
                    type: 'video',
                    duration: '5 heures',
                    description: 'Création et optimisation de réseaux de neurones profonds avec TensorFlow 2.x.'
                  },
                  {
                    title: 'Optimisation et réglage d\'hyperparamètres',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Méthodes systématiques pour optimiser les performances des modèles ML.'
                  },
                  {
                    title: 'Apprentissage par renforcement',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Introduction à l\'apprentissage par renforcement et algorithmes Q-learning.'
                  },
                  {
                    title: 'Projet de Machine Learning de bout en bout',
                    type: 'article',
                    duration: '2 heures',
                    description: 'Application des connaissances acquises à un projet réel de ML.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Pierre Moreau',
                      avatar: '/images/avatars/avatar11.jpg'
                    }, 
                    rating: 5,
                    comment: 'Formation d\'une qualité exceptionnelle. Les concepts avancés sont expliqués de manière claire et accessible. Les exercices pratiques sont très pertinents.',
                    date: 'il y a 3 semaines'
                  },
                  {
                    user: {
                      name: 'Léa Dubois',
                      avatar: '/images/avatars/avatar12.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Excellent cours qui m\'a permis de progresser significativement en machine learning. L\'accent mis sur l\'optimisation des modèles est particulièrement utile.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 8,
                title: 'Leadership et Management d\'Équipe',
                description: 'Développez vos compétences en leadership pour gérer efficacement des équipes et stimuler l\'innovation.',
                image: '/images/bck6.png',
                duration: '12 heures',
                lessons: 20,
                level: 'Intermédiaire',
                rating: 4.6,
                reviews: 324,
                students: 4800,
                category: 'business',
                instructor: {
                  name: 'Philippe Laurent',
                  avatar: '/images/instructors/philippe.jpg',
                  bio: 'Coach en leadership et ancien directeur exécutif avec plus de 20 ans d\'expérience en management d\'équipes. J\'ai accompagné des centaines de managers dans le développement de leurs compétences de leadership.'
                },
                featured: false,
                tags: ['Gestion d\'équipe', 'Communication', 'Résolution de conflits'],
                lastUpdated: '2025-02-18',
                content: [
                  {
                    title: 'Fondamentaux du leadership moderne',
                    type: 'article',
                    duration: '1 heure',
                    description: 'Comprendre les différents styles de leadership et quand les appliquer.'
                  },
                  {
                    title: 'Communication efficace en tant que leader',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Techniques de communication pour motiver et engager votre équipe.'
                  },
                  {
                    title: 'Gestion des conflits et résolution de problèmes',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Méthodes pour identifier, prévenir et résoudre les conflits au sein d\'une équipe.'
                  },
                  {
                    title: 'Coaching et développement de l\'équipe',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Techniques de coaching pour développer les compétences et la performance de votre équipe.'
                  },
                  {
                    title: 'Leadership en période de changement',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Accompagner efficacement son équipe à travers les périodes de transformation.'
                  },
                  {
                    title: 'Intelligence émotionnelle pour leaders',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Développer votre intelligence émotionnelle pour mieux diriger et influencer.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Caroline Martin',
                      avatar: '/images/avatars/avatar13.jpg'
                    }, 
                    rating: 5,
                    comment: 'Formation pragmatique avec des conseils directement applicables. J\'ai pu améliorer immédiatement ma façon de gérer mon équipe.',
                    date: 'il y a 1 mois'
                  },
                  {
                    user: {
                      name: 'François Leclerc',
                      avatar: '/images/avatars/avatar14.jpg'
                    }, 
                    rating: 4,
                    comment: 'Bon cours avec des concepts utiles. J\'aurais apprécié encore plus d\'études de cas, mais le contenu est solide et bien présenté.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 9,
                title: 'Sécurité Informatique: Ethical Hacking',
                description: 'Apprenez à identifier et exploiter les vulnérabilités de sécurité pour mieux protéger les systèmes informatiques.',
                image: '/images/bck17.png',
                duration: '16 heures',
                lessons: 26,
                level: 'Avancé',
                rating: 4.8,
                reviews: 312,
                students: 3200,
                category: 'programming',
                instructor: {
                  name: 'Mathieu Girard',
                  avatar: '/images/instructors/mathieu.jpg',
                  bio: 'Expert en cybersécurité certifié CEH et CISSP avec 15 ans d\'expérience. J\'ai travaillé comme consultant en sécurité pour des banques et des organisations gouvernementales avant de me consacrer à l\'enseignement.'
                },
                featured: false,
                tags: ['Cybersécurité', 'Penetration Testing', 'Network Security'],
                lastUpdated: '2025-01-25',
                content: [
                  {
                    title: 'Introduction à l\'Ethical Hacking',
                    type: 'article',
                    duration: '1 heure',
                    description: 'Comprendre le rôle et les responsabilités d\'un hacker éthique.'
                  },
                  {
                    title: 'Reconnaissance et collecte d\'informations',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Techniques pour identifier les cibles et collecter des informations en utilisant des méthodes passives et actives.'
                  },
                  {
                    title: 'Scanning de réseaux',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Utilisation d\'outils comme Nmap pour scanner et cartographier les réseaux.'
                  },
                  {
                    title: 'Exploitation de vulnérabilités',
                    type: 'video',
                    duration: '4 heures',
                    description: 'Identification et exploitation de failles de sécurité courantes dans les systèmes et applications.'
                  },
                  {
                    title: 'Sécurité des applications web',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Test d\'intrusion sur les applications web et protection contre les attaques courantes (OWASP Top 10).'
                  },
                  {
                    title: 'Post-exploitation et rapports',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Techniques post-exploitation et création de rapports de sécurité professionnels.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Alexandre Dubois',
                      avatar: '/images/avatars/avatar15.jpg'
                    }, 
                    rating: 5,
                    comment: 'Cours complet et extrêmement pratique. L\'environnement de lab est particulièrement bien conçu pour pratiquer les techniques en toute sécurité.',
                    date: 'il y a 2 semaines'
                  },
                  {
                    user: {
                      name: 'Marie Lefevre',
                      avatar: '/images/avatars/avatar16.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Formation très instructive qui va bien au-delà de la théorie. Les démonstrations pratiques sont impressionnantes et éducatives.',
                    date: 'il y a 1 mois'
                  }
                ]
              },
              {
                id: 10,
                title: 'Développement d\'Applications Mobiles avec React Native',
                description: 'Créez des applications mobiles natives pour iOS et Android avec un seul code base en utilisant React Native.',
                image: '/images/bck15.png',
                duration: '18 heures',
                lessons: 30,
                level: 'Intermédiaire',
                rating: 4.7,
                reviews: 285,
                students: 3600,
                category: 'programming',
                instructor: {
                  name: 'Amélie Petit',
                  avatar: '/images/instructors/amelie.jpg',
                  bio: 'Développeuse mobile depuis 8 ans, spécialisée en React Native. J\'ai créé plus de 20 applications mobiles pour diverses entreprises et startups, certaines comptant plus d\'un million d\'utilisateurs.'
                },
                featured: false,
                tags: ['React Native', 'JavaScript', 'Mobile Development'],
                lastUpdated: '2025-02-12',
                content: [
                  {
                    title: 'Introduction à React Native',
                    type: 'article',
                    duration: '1 heure',
                    description: 'Comprendre l\'architecture et les avantages de React Native pour le développement mobile.'
                  },
                  {
                    title: 'Configuration de l\'environnement',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Installation et configuration de l\'environnement de développement React Native.'
                  },
                  {
                    title: 'Composants fondamentaux',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Maîtriser les composants de base et leur utilisation dans les applications React Native.'
                  },
                  {
                    title: 'Navigation et routing',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Implémentation de la navigation entre les écrans avec React Navigation.'
                  },
                  {
                    title: 'Gestion d\'état avec Redux',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Utilisation de Redux pour gérer l\'état global de votre application.'
                  },
                  {
                    title: 'API natives et intégrations',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Accès aux fonctionnalités natives des appareils comme la caméra, la géolocalisation, etc.'
                  },
                  {
                    title: 'Déploiement sur les stores',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Préparation et soumission des applications sur l\'App Store et Google Play.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Thomas Laurent',
                      avatar: '/images/avatars/avatar17.jpg'
                    }, 
                    rating: 5,
                    comment: 'Excellent cours qui m\'a permis de développer ma première application mobile en quelques semaines. Les explications sont claires et les projets pratiques très formateurs.',
                    date: 'il y a 3 semaines'
                  },
                  {
                    user: {
                      name: 'Julie Martin',
                      avatar: '/images/avatars/avatar18.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Formation très complète qui couvre tous les aspects essentiels du développement avec React Native. Le chapitre sur Redux est particulièrement bien expliqué.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 11,
                title: 'Introduction à l\'Astrophysique',
                description: 'Explorez les fondements de l\'astrophysique, des lois fondamentales aux dernières découvertes sur notre univers.',
                image:'/images/bck21.png',
                duration: '14 heures',
                lessons: 24,
                level: 'Débutant',
                rating: 4.9,
                reviews: 198,
                students: 2200,
                category: 'science',
                instructor: {
                  name: 'Dr. Jean Leclerc',
                  avatar: '/images/instructors/jean.jpg',
                  bio: 'Astrophysicien et professeur d\'université avec 25 ans d\'expérience en recherche et enseignement. Auteur de plusieurs ouvrages de vulgarisation scientifique sur l\'astrophysique et la cosmologie.'
                },
                featured: false,
                tags: ['Astronomie', 'Physique', 'Cosmologie'],
                lastUpdated: '2025-01-30',
                content: [
                  {
                    title: 'Bases de l\'astronomie moderne',
                    type: 'article',
                    duration: '2 heures',
                    description: 'Histoire de l\'astronomie et principes fondamentaux de l\'observation céleste.'
                  },
                  {
                    title: 'Physique stellaire',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Formation, évolution et fin de vie des étoiles : comprendre les processus physiques à l\'œuvre.'
                  },
                  {
                    title: 'Galaxies et structures cosmiques',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Classification des galaxies, amas galactiques et super-amas dans l\'univers observable.'
                  },
                  {
                    title: 'Relativité et trous noirs',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Introduction à la relativité générale et à la physique des trous noirs.'
                  },
                  {
                    title: 'Cosmologie moderne',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Big Bang, inflation cosmique et expansion de l\'univers.'
                  },
                  {
                    title: 'Exoplanètes et recherche de vie',
                    type: 'video',
                    duration: '1 heure',
                    description: 'Méthodes de détection des exoplanètes et perspectives sur la recherche de vie extraterrestre.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Sophie Bertrand',
                      avatar: '/images/avatars/avatar19.jpg'
                    }, 
                    rating: 5,
                    comment: 'Cours fascinant qui rend accessibles des concepts complexes. Les visualisations et animations sont particulièrement utiles pour comprendre les phénomènes astrophysiques.',
                    date: 'il y a 2 semaines'
                  },
                  {
                    user: {
                      name: 'Nicolas Martin',
                      avatar: '/images/avatars/avatar20.jpg'
                    }, 
                    rating: 5,
                    comment: 'Une introduction parfaite à l\'astrophysique pour les non-spécialistes. Dr. Leclerc a un talent exceptionnel pour expliquer des concepts difficiles de manière claire et captivante.',
                    date: 'il y a 1 mois'
                  }
                ]
              },
              {
                id: 12,
                title: 'Statistiques et Probabilités Appliquées',
                description: 'Maîtrisez les concepts fondamentaux de statistiques et de probabilités avec des applications pratiques.',
                image: '/images/bck20.png',
                duration: '15 heures',
                lessons: 28,
                level: 'Intermédiaire',
                rating: 4.6,
                reviews: 246,
                students: 3100,
                category: 'math',
                instructor: {
                  name: 'Dr. Sarah Cohen',
                  avatar: '/images/instructors/sarah.jpg',
                  bio: 'Docteure en statistiques avec 15 ans d\'expérience en enseignement et consultation. J\'ai travaillé comme statisticienne pour des projets de recherche médicale et économique avant de me consacrer à l\'enseignement.'
                },
                featured: false,
                tags: ['Statistiques', 'Probabilités', 'Data Analysis'],
                lastUpdated: '2025-02-08',
                content: [
                  {
                    title: 'Fondamentaux des probabilités',
                    type: 'article',
                    duration: '2 heures',
                    description: 'Comprendre les concepts de base des probabilités et des variables aléatoires.'
                  },
                  {
                    title: 'Distributions de probabilités',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Étude des distributions discrètes et continues les plus importantes.'
                  },
                  {
                    title: 'Statistiques descriptives',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Méthodes et outils pour résumer et visualiser efficacement les données.'
                  },
                  {
                    title: 'Inférence statistique',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Estimation de paramètres et tests d\'hypothèses.'
                  },
                  {
                    title: 'Régression linéaire',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Théorie et application de la régression linéaire simple et multiple.'
                  },
                  {
                    title: 'Analyse bayésienne',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Introduction aux méthodes bayésiennes en statistiques.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Paul Durand',
                      avatar: '/images/avatars/avatar21.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Excellent cours qui rend les statistiques compréhensibles et applicables. Les exemples pratiques sont très pertinents et aident à saisir les concepts.',
                    date: 'il y a 3 semaines'
                  },
                  {
                    user: {
                      name: 'Emma Petit',
                      avatar: '/images/avatars/avatar22.jpg'
                    }, 
                    rating: 4,
                    comment: 'Formation solide avec une bonne progression dans la complexité. J\'aurais aimé plus d\'exercices pratiques avec des datasets réels.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 13,
                title: 'Intelligence Émotionnelle au Travail',
                description: 'Développez votre intelligence émotionnelle pour améliorer vos relations professionnelles et votre efficacité.',
                image: '/images/bck4.png',
                duration: '8 heures',
                lessons: 16,
                level: 'Débutant',
                rating: 4.8,
                reviews: 320,
                students: 5600,
                category: 'personal-dev',
                instructor: {
                  name: 'Sophie Renaud',
                  avatar: '/images/instructors/sophie-r.jpg',
                  bio: 'Coach certifiée en développement personnel et intelligence émotionnelle avec 12 ans d\'expérience. J\'ai accompagné des centaines de professionnels dans leur développement personnel et travaillé comme consultante pour des entreprises du Fortune 500.'
                },
                featured: false,
                tags: ['Soft Skills', 'Communication', 'Gestion du stress'],
                lastUpdated: '2025-01-22',
                content: [
                  {
                    title: 'Comprendre l\'intelligence émotionnelle',
                    type: 'article',
                    duration: '1 heure',
                    description: 'Définition et importance de l\'intelligence émotionnelle dans le contexte professionnel.'
                  },
                  {
                    title: 'Conscience de soi émotionnelle',
                    type: 'video',
                    duration: '1.5 heures',
                    description: 'Techniques pour identifier et comprendre vos propres émotions et leur impact.'
                  },
                  {
                    title: 'Gestion des émotions',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Stratégies pratiques pour réguler vos réactions émotionnelles et gérer le stress.'
                  },
                  {
                    title: 'Empathie et conscience sociale',
                    type: 'video',
                    duration: '1.5 heures',
                    description: 'Développer votre capacité à comprendre les émotions des autres et à y répondre efficacement.'
                  },
                  {
                    title: 'Communication émotionnellement intelligente',
                    type: 'video',
                    duration: '1 heure',
                    description: 'Techniques de communication qui intègrent l\'intelligence émotionnelle pour plus d\'impact.'
                  },
                  {
                    title: 'Intelligence émotionnelle en situation de conflit',
                    type: 'video',
                    duration: '1 heure',
                    description: 'Application de l\'intelligence émotionnelle pour résoudre efficacement les conflits au travail.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Laurent Dubois',
                      avatar: '/images/avatars/avatar23.jpg'
                    }, 
                    rating: 5,
                    comment: 'Formation qui a véritablement transformé ma façon d\'interagir avec mes collègues. Les exercices pratiques m\'ont permis de progresser rapidement.',
                    date: 'il y a 2 semaines'
                  },
                  {
                    user: {
                      name: 'Claire Martin',
                      avatar: '/images/avatars/avatar24.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Cours très instructif avec des conseils concrets que j\'ai pu appliquer immédiatement dans mon travail quotidien. L\'approche est pratique et accessible.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 14,
                title: 'Animation et Motion Design',
                description: 'Apprenez à créer des animations captivantes et du motion design pour vos projets digitaux.',
                image: '/images/bck19.png',
                duration: '16 heures',
                lessons: 28,
                level: 'Intermédiaire',
                rating: 4.7,
                reviews: 189,
                students: 2800,
                category: 'design',
                instructor: {
                  name: 'Nicolas Duval',
                  avatar: '/images/instructors/nicolas.jpg',
                  bio: 'Motion designer avec 10 ans d\'expérience dans l\'industrie. J\'ai travaillé sur des projets pour des marques internationales et des agences de publicité, et mes animations ont été diffusées sur les principales chaînes de télévision et plateformes numériques.'
                },
                featured: false,
                tags: ['After Effects', 'Motion Graphics', 'Animation Principles'],
                lastUpdated: '2025-02-14',
                content: [
                  {
                    title: 'Principes fondamentaux de l\'animation',
                    type: 'article',
                    duration: '2 heures',
                    description: 'Comprendre les 12 principes de l\'animation et leur application en motion design.'
                  },
                  {
                    title: 'Introduction à After Effects',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Maîtriser l\'interface et les fonctionnalités de base d\'Adobe After Effects.'
                  },
                  {
                    title: 'Animation de texte et typographie cinétique',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Techniques d\'animation de texte créatives et impactantes.'
                  },
                  {
                    title: 'Motion graphics et infographies animées',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Création d\'infographies animées pour présenter des données de manière engageante.'
                  },
                  {
                    title: 'Character animation',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Animation de personnages et mascottes pour vos projets.'
                  },
                  {
                    title: 'Effets visuels et compositing',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Intégration d\'effets visuels et techniques de compositing avancées.'
                  },
                  {
                    title: 'Export et optimisation pour différentes plateformes',
                    type: 'video',
                    duration: '1 heure',
                    description: 'Paramètres d\'exportation optimaux pour le web, les réseaux sociaux et la diffusion.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Marc Lambert',
                      avatar: '/images/avatars/avatar25.jpg'
                    }, 
                    rating: 5,
                    comment: 'Formation incroyablement complète et bien structurée. J\'ai pu créer des animations professionnelles dès la fin du cours.',
                    date: 'il y a 3 semaines'
                  },
                  {
                    user: {
                      name: 'Julie Petit',
                      avatar: '/images/avatars/avatar26.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Nicolas est un excellent formateur qui partage généreusement ses connaissances et astuces de professionnel. Les projets pratiques sont très formateurs.',
                    date: 'il y a 1 mois'
                  }
                ]
              },
              {
                id: 15,
                title: 'Cloud Computing avec AWS',
                description: 'Maîtrisez les services cloud d\'Amazon Web Services pour déployer et gérer des applications à grande échelle.',
                image: '/images/bck16.png',
                duration: '20 heures',
                lessons: 34,
                level: 'Avancé',
                rating: 4.8,
                reviews: 276,
                students: 3400,
                category: 'programming',
                instructor: {
                  name: 'David Moreau',
                  avatar: '/images/instructors/david.jpg',
                  bio: 'Architecte cloud certifié AWS avec 14 ans d\'expérience. J\'ai accompagné des entreprises de toutes tailles dans leur migration vers le cloud et optimisé des infrastructures cloud pour des applications à fort trafic.'
                },
                featured: false,
                tags: ['AWS', 'Cloud Architecture', 'DevOps'],
                lastUpdated: '2025-01-18',
                content: [
                  {
                    title: 'Introduction au Cloud Computing',
                    type: 'article',
                    duration: '1 heure',
                    description: 'Comprendre les concepts fondamentaux du cloud computing et les services AWS.'
                  },
                  {
                    title: 'Services de calcul AWS (EC2, Lambda)',
                    type: 'video',
                    duration: '4 heures',
                    description: 'Déploiement et gestion des instances EC2 et fonctions serverless Lambda.'
                  },
                  {
                    title: 'Stockage dans le cloud (S3, EBS, EFS)',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Utilisation des différentes solutions de stockage AWS pour différents cas d\'usage.'
                  },
                  {
                    title: 'Bases de données AWS (RDS, DynamoDB)',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Déploiement et gestion de bases de données relationnelles et NoSQL sur AWS.'
                  },
                  {
                    title: 'Réseau et sécurité dans AWS',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Configuration de VPC, groupes de sécurité et bonnes pratiques de sécurité.'
                  },
                  {
                    title: 'Infrastructure as Code avec CloudFormation',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Automatisation du déploiement d\'infrastructure avec CloudFormation et Terraform.'
                  },
                  {
                    title: 'Surveillance et observabilité (CloudWatch, X-Ray)',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Mise en place de systèmes de surveillance et de traçage pour vos applications AWS.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Thomas Bernard',
                      avatar: '/images/avatars/avatar27.jpg'
                    }, 
                    rating: 5,
                    comment: 'Formation exceptionnelle qui couvre tous les aspects essentiels d\'AWS. Les exemples pratiques et les études de cas sont particulièrement utiles.',
                    date: 'il y a 3 semaines'
                  },
                  {
                    user: {
                      name: 'Aurélie Durand',
                      avatar: '/images/avatars/avatar28.jpg'
                    }, 
                    rating: 4.5,
                    comment: 'Excellent cours qui m\'a permis de comprendre et d\'implémenter une architecture complète sur AWS. Les modules sur la sécurité et l\'Infrastructure as Code sont particulièrement bien traités.',
                    date: 'il y a 2 mois'
                  }
                ]
              },
              {
                id: 16,
                title: 'Introduction à la Blockchain',
                description: 'Découvrez les principes fondamentaux de la technologie blockchain et ses applications au-delà des cryptomonnaies.',
                image:'/images/bck18.png',
                duration: '12 heures',
                lessons: 22,
                level: 'Débutant',
                rating: 4.6,
                reviews: 210,
                students: 2900,
                category: 'programming',
                instructor: {
                  name: 'Marc Rousseau',
                  avatar: '/images/instructors/marc.jpg',
                  bio: 'Expert en technologies blockchain et cryptographie avec 8 ans d\'expérience. Ancien développeur pour des projets blockchain majeurs, j\'ai également conseillé des entreprises et des startups sur l\'intégration de solutions basées sur la blockchain.'
                },
                featured: false,
                tags: ['Blockchain', 'Cryptography', 'Smart Contracts'],
                lastUpdated: '2025-02-20',
                content: [
                  {
                    title: 'Comprendre la blockchain: concepts fondamentaux',
                    type: 'article',
                    duration: '2 heures',
                    description: 'Introduction aux concepts clés de la blockchain: blocs, transactions, hachage et consensus.'
                  },
                  {
                    title: 'Cryptographie et sécurité',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Principes cryptographiques sous-jacents à la blockchain: clés publiques/privées, signatures numériques et fonctions de hachage.'
                  },
                  {
                    title: 'Bitcoin: la première blockchain',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Étude du fonctionnement de Bitcoin, son protocole de consensus et son écosystème.'
                  },
                  {
                    title: 'Ethereum et smart contracts',
                    type: 'video',
                    duration: '3 heures',
                    description: 'Découverte d\'Ethereum, de sa machine virtuelle et des bases du développement de contrats intelligents.'
                  },
                  {
                    title: 'Développement de DApps (applications décentralisées)',
                    type: 'video',
                    duration: '2 heures',
                    description: 'Principes de conception et développement d\'applications décentralisées.'
                  },
                  {
                    title: 'Applications de la blockchain hors cryptomonnaies',
                    type: 'video',
                    duration: '1 heure',
                    description: 'Exploration des cas d\'usage de la blockchain dans différents secteurs: chaîne d\'approvisionnement, santé, finance, etc.'
                  }
                ],
                reviews: [
                  {
                    user: {
                      name: 'Julien Lefevre',
                      avatar: '/images/avatars/avatar29.jpg'
                    }, 
                    rating: 5,
                    comment: 'Cours très clair qui démystifie la blockchain et explique les concepts techniques complexes de manière accessible. Recommandé pour tous ceux qui veulent comprendre cette technologie au-delà du buzz médiatique.',
                    date: 'il y a 1 mois'
                  },
                  {
                    user: {
                      name: 'Hélène Martin',
                      avatar: '/images/avatars/avatar30.jpg'
                    }, 
                    rating: 4,
                    comment: 'Bonne introduction à la blockchain avec un bon équilibre entre théorie et pratique. J\'aurais apprécié plus de détails sur les aspects économiques et les limitations actuelles de la technologie.',
                    date: 'il y a 2 mois'
                  }
                ]
              }
            // Vous pouvez continuer à ajouter les détails pour les autres modules de la même manière
            // Module 6, 7, 8, etc.
          ];
          
          // Trouver le module correspondant à l'ID de l'URL
          const foundModule = modules.find(m => m.id === parseInt(moduleId, 10)) || modules[0];
          
          // Simuler un délai de chargement
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (foundModule) {
            setModule(foundModule);
          } else {
            throw new Error('Module non trouvé');
          }
        } catch (err) {
          console.error(err);  
          setError(err.message);
        }
        
        setLoading(false);
      };
      
      fetchModule();
    }, [moduleId]);
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre le commentaire ici
    setComment('');
    alert('Votre commentaire a été soumis !');
  };
  
  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '12px', mb: 4 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />  
            <Skeleton variant="text" width={200} height={30} />
          </Box>
          
          <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px', mb: 2 }} />
              <Skeleton variant="text" width="90%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={30} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px' }} />  
            </Grid>  
          </Grid>
        </Container>
      </Box>  
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" paragraph>Oups ! Un problème est survenu</Typography>  
          <Typography sx={{ mb: 4 }}>
            {error}. Veuillez réessayer ultérieurement.
          </Typography>
          <Button
            component={RouterLink}
            to="/modules"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { bgcolor: theme.palette.primary.dark }  
            }}
          >
            Retour aux modules
          </Button>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/modules" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4 }}
        >
          Retour aux modules  
        </Button>
        
        {module && (
          <>
            <Box 
              sx={{
                position: 'relative', 
                borderRadius: '12px',
                overflow: 'hidden',
                mb: 4,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'  
                }
              }}
            >
              <Box
                component="img"
                src={module.image}
                alt={module.title}
                sx={{ 
                  width: '100%', 
                  height: '400px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(80%)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',  
                  bottom: 0,
                  left: 0,
                  p: 4,
                  color: 'white',
                  zIndex: 1
                }}
              >
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {module.title}
                </Typography>
                <Typography variant="h6">
                  {module.description}  
                </Typography>
              </Box>
            </Box>
        
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={module.instructor.avatar} alt={module.instructor.name} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }}>{module.instructor.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Instructeur</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, color: theme.palette.text.secondary }}>
                    <Chip icon={<AccessTimeIcon />} label={module.duration} variant="outlined" />
                    <Chip icon={<NetworkCell />} label={module.level} variant="outlined" />
                    {module.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" size="small" />
                    ))}  
                  </Box>
                  
                  <Typography paragraph sx={{ mb: 4 }}>{module.instructor.bio}</Typography>
                  
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Contenu du module</Typography>
                  
                  {module.content.map((item, index) => (
                    <Accordion key={index} elevation={0} square>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.type === 'video' ? <OndemandVideoIcon sx={{ mr: 2 }} /> : <ArticleIcon sx={{ mr: 2 }} />}
                          <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>  
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>{item.description}</Typography>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={item.duration} 
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}  
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px' }} elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Détails du module</Typography>
                    <Chip label={module.category} color="primary" size="small" />
                  </Box>
                  
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                          <NetworkCell />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Niveau" secondary={module.level} />
                    </ListItem>
                    
                    <ListItem>  
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Durée" secondary={module.duration} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                          <NetworkCell />  
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Évaluation
                            <Box sx={{ ml: 1, display: 'flex' }}>
                              <Rating value={module.rating} readOnly precision={0.5} sx={{ color: 'warning.main' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({module.rating})  
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={`${module.students} étudiant(s) inscrit(s)`}
                      />
                    </ListItem>
                  </List>
                  
                  <Button fullWidth variant="contained" size="large" sx={{ mt: 2, borderRadius: '8px' }}  component={RouterLink}
                                  to="/login">
                    S'inscrire au module
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 8 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Avis des étudiants</Typography>
              
              {module.reviews.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                  {module.reviews.map((review, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={review.user.avatar} alt={review.user.name} sx={{ mr: 2 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 'bold' }}>{review.user.name}</Typography> 
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} readOnly sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">{review.date}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography paragraph>{review.comment}</Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>  
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary">Aucun avis pour le moment.</Typography>  
              )}
              
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Laissez un commentaire</Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend" sx={{ mb: 1 }}>Votre note</Typography>
                  <Rating
                    value={4.5}
                    precision={0.5}
                    sx={{ color: 'warning.main' }}
                    onChange={(event, newValue) => {
                      // Mettre à jour la note ici
                    }}
                  />
                </Box>
                
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Votre commentaire"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  type="submit"
                  variant="contained" 
                  endIcon={<SendIcon />}
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Envoyer  
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ModuleDetails;