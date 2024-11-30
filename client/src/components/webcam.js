import React, { useEffect, useRef } from 'react';
import detectPose from '../controllers/pose_detection';
import Webcam from 'react-webcam';

function WebcamVision() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let poseLandmarker = null;
  let lastVideoTime = -1;
  const videoHeight = 720;
  const videoWidth = 1280;

  useEffect(() => {
    const initializeLandmarker = async () => {
      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task" 
          },
          runningMode: "VIDEO"
        });

      renderLoop();
    };

    initializeLandmarker();
  }, []);

  const renderLoop = async () => {
    if (webcamRef.current && webcamRef.current.video && poseLandmarker) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      if (video.currentTime !== lastVideoTime) {
        const { PoseLandmarker } = await import('@mediapipe/tasks-vision');
        
        try {
         const results = poseLandmarker.detectForVideo(video, performance.now());
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks) {
            video.height = videoHeight;
            video.width = videoWidth;
            canvas.height = videoHeight;
            canvas.width = videoWidth;
            canvasContext.fillStyle = "blue";
            const landmarksArray = results.landmarks;
            landmarksArray.forEach(landmarks => {
              landmarks.forEach(landmark => {
                const x = landmark["x"] * canvas.width;
                const y = landmark["y"] * canvas.height;

                canvasContext.beginPath();
                canvasContext.arc(x, y, 5, 0, 2 * Math.PI);
                canvasContext.fill();
              });
              console.log("[L, R, U, D]:", detectPose(landmarks));
            });
            //console.log(results.landmarks);
          } 
        } catch (e) {
          console.log(e);
        }

        lastVideoTime = video.currentTime;
      }
    }
    requestAnimationFrame(renderLoop);
  };
  
  return (
    <>
      <Webcam ref={webcamRef} mirrored={false} style={{ position: "absolute" }}/>
      <canvas ref={canvasRef} style={{ position: "absolute" }}/>
    </>
  );
}

export default WebcamVision;