import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function QcmForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.some((opt) => !opt) || !correctAnswer) {
      return toast.error("Tous les champs sont requis !");
    }

    try {
      await axios.post("http://localhost:5000/api/qcm/add", {
        question,
        options,
        correctAnswer,
        teacherId: "ID_PROFESSEUR",
      });
      toast.success("Question ajoutée !");
    } catch (error) {
      toast.error("Erreur serveur !");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      {options.map((opt, index) => (
        <input key={index} type="text" placeholder={`Option ${index + 1}`} value={opt} onChange={(e) => {
          const newOptions = [...options];
          newOptions[index] = e.target.value;
          setOptions(newOptions);
        }} />
      ))}
      <input type="text" placeholder="Bonne réponse" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default QcmForm;
