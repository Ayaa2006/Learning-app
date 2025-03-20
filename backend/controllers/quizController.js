const Quiz = require("../models/Quiz");

// ➤ Ajouter un QCM à un cours (Prof uniquement)
exports.createQuiz = async (req, res) => {
  try {
    const { course, questions } = req.body;

    if (!course || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Données invalides" });
    }

    const newQuiz = new Quiz({ course, questions });
    await newQuiz.save();

    res.status(201).json({ message: "QCM ajouté avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Récupérer les questions d’un cours
exports.getQuizByCourse = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: "Aucun QCM trouvé" });

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Vérifier les réponses d'un étudiant
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "QCM introuvable" });

    const { answers } = req.body; // Format attendu : { "questionId": "reponse" }
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Format des réponses invalide" });
    }

    let score = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        score++;
      }
    });

    res.json({ message: "Test terminé", score });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
