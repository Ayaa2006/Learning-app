import { useState } from "react";
import axios from "axios";

const CreateQuiz = ({ courseId }) => {
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  // Mettre à jour une question ou une option
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  // Envoyer le QCM au backend
  const submitQuiz = async () => {
    try {
      await axios.post("/api/quiz/create", { course: courseId, questions });
      alert("QCM ajouté avec succès !");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du QCM", error);
    }
  };

  return (
    <div>
      <h2>Créer un QCM</h2>
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
          />
          {q.options.map((option, optIndex) => (
            <div key={optIndex}>
              <input
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
              />
            </div>
          ))}
          <select onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}>
            <option value="">Choisir la bonne réponse</option>
            {q.options.map((option, optIndex) => (
              <option key={optIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addQuestion}>Ajouter une question</button>
      <button onClick={submitQuiz}>Créer le QCM</button>
    </div>
  );
};

export default CreateQuiz;
