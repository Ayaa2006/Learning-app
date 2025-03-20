import ProgressTracker from "../components/ProgressTracker";

const CoursePage = ({ courseId }) => {
  return (
    <div>
      <h1>Détails du cours</h1>
      <ProgressTracker courseId={courseId} />
    </div>
  );
};

export default CoursePage;
