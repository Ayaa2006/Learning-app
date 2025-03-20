import { useState, useEffect } from "react";
import axios from "axios";

const QuizPage = ({ courseId }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`/api/quiz/${courseId}`).then((res) => setQuiz(res.data));
  }, [courseId]);

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    const res = await axios.post(`/api/quiz/submit/${quiz._id}`, { answers });
    setScore(res.data.score);
  };

  return (
    <div>
      <h2>QCM</h2>
      {quiz && quiz.questions.map((q) => (
        <div key={q._id}>
          <p>{q.question}</p>
          {q.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={q._id}
                value={option}
                onChange={() => handleChange(q._id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Soumettre</button>
      {score !== null && <h3>Score : {score}/{quiz?.questions.length}</h3>}
    </div>
  );
};

export default QuizPage;
