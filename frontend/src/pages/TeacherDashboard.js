import CreateQuiz from "../components/CreateQuiz";

const TeacherDashboard = () => {
  const courseId = "ID_DU_COURS"; // Remplace avec l’ID réel du cours

  return (
    <div>
      <h1>Tableau de bord enseignant</h1>
      <CreateQuiz courseId={courseId} />
    </div>
  );
};

export default TeacherDashboard;
