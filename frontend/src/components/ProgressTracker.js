import { useState, useEffect } from "react";
import axios from "axios";

const ProgressTracker = ({ courseId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    axios.get(`/api/progress/${courseId}`).then((res) => setProgress(res.data));
  }, [courseId]);

  const downloadCertificate = () => {
    axios.get(`/api/progress/certificate/${courseId}`, { responseType: "blob" }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificat.pdf");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div>
      <h2>Progression</h2>
      {progress ? (
        <div>
          <p>Leçons complétées : {progress.completedLessons.length}</p>
          <p>Score : {progress.score}</p>
          {progress.score >= 80 && (
            <button onClick={downloadCertificate}>Télécharger Certificat</button>
          )}
        </div>
      ) : (
        <p>Aucune progression enregistrée</p>
      )}
    </div>
  );
};

export default ProgressTracker;
