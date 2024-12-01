import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GameNoWebcam from "../components/GameNoWebcam";
import WebcamVision from "../components/Webcam.js";
import songs from "../data/songs";
import styles from "@/styles/Game.module.css";

const GameNoWebcamScreen = () => {
  const router = useRouter();
  const { songId } = router.query;
  const [songData, setSongData] = useState(null);
  const [currentMovement, setCurrentMovement] = useState([false, false, false, false]);
  const [score, setScore] = useState(0);

  // Countdown logic
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Ensure songId is available (router.query may be undefined initially)
    if (songId) {
      const selectedSong = songs.find((song) => song.id === songId);
      if (selectedSong) {
        setSongData(selectedSong);
      } else {
        router.push("/song-select");
      }
    }
  }, [songId]);

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
    }
  }, [countdown]);

  if (!songData) {
    return <div>Loading...</div>;
  }

  // Show countdown before game starts
  if (!gameStarted) {
    return (
      <div className={styles.countdownContainer}>
        <h1>Starting in {countdown}</h1>
        <img className={styles.loadingGif} src="/assets/loadingMascot.gif" alt="Countdown" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <WebcamVision
          className={styles.webcam}
          setCurrentMovement={setCurrentMovement}
        />
      </div>
      <div className={styles.gameContainer}>
        <GameNoWebcam
          song={songData}
          setScore={setScore}
          score={score}
          currentMovement={currentMovement}
          gameStarted={gameStarted} // Pass the gameStarted state
        />
      </div>
    </div>
  );
};

export default GameNoWebcamScreen;