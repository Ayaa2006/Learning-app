// frontend/src/components/Webcam.js
import React, { useRef, useEffect } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

function Webcam() {
  const webcamRef = useRef(null);
  
  useEffect(() => {
    const runFaceMesh = async () => {
      const model = await faceLandmarksDetection.load();
      const webcam = webcamRef.current;
      const video = webcam.video;
      const predictions = await model.estimateFaces({ input: video });

      if (predictions.length > 0) {
        console.log("Face detected!");
      } else {
        console.log("No face detected.");
      }
    };

    const interval = setInterval(runFaceMesh, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={webcamRef} autoPlay muted width="640" height="480" />
    </div>
  );
}

export default Webcam;
