import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import styles from "../styles/GameNoWebcam.module.css";
import GameCanvas from "./GameCanvas";
import Score from "./Score";
import Link from "next/link";

function GameNoWebcam({ song, score, setScore, currentMovement, gameStarted }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [mapping, setMapping] = useState([]);
  const [paused, setPaused] = useState(false);
  const [activeArrows, setActiveArrows] = useState({
    left: false,
    up: false,
    down: false,
    right: false,
  });
  const [inputs, setInputs] = useState([]); // For debugging

  const [gameEnded, setGameEnded] = useState(false); // Ending screen logic

  const gameInterval = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    setActiveArrows({
      left: currentMovement[0],
      right: currentMovement[1],
      up: currentMovement[2],
      down: currentMovement[3],
    });
  }, [currentMovement]);

  // Load the mapping data for the selected song
  useEffect(() => {
    async function loadMapping() {
      const mappingModule = await import(`../data/mappings/${song.id}.js`);
      const initialMapping = mappingModule.default.map((item) => ({
        ...item,
        hit: false,
      }));
      setMapping(initialMapping);
    }
    loadMapping();
  }, [song.id]);

  // Start the sound and update currentTime
  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const sound = new Howl({
      src: [song.file],
      html5: true,
      onend: () => {
        console.log("Song ended, showing ending screen.");
        setGameEnded(true);
      },
    });

    soundRef.current = sound;
    sound.play();

    if (gameStarted && !gameEnded) {
      gameInterval.current = setInterval(() => {
        if (!paused) {
          setCurrentTime(sound.seek());
        }
      }, 50);
    }

    return () => {
      clearInterval(gameInterval.current);
      sound.stop();
    };
  }, [song, gameStarted, gameEnded]);

  // Handle key presses
  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();

    if (key === " ") {
      // Spacebar toggles pause
      setPaused((prevPaused) => !prevPaused);
      return;
    }

    if (paused || !gameStarted || gameEnded) {
      // Ignore other key presses when paused, not started, or ended
      return;
    }

    // Map keys to actions
    let action = "";
    if (key === "ARROWLEFT" || key === "A") action = "left";
    else if (key === "ARROWUP" || key === "W") action = "up";
    else if (key === "ARROWDOWN" || key === "S") action = "down";
    else if (key === "ARROWRIGHT" || key === "D") action = "right";
    else return; // Ignore other keys

    // Activate the corresponding arrow image
    setActiveArrows((prevArrows) => ({
      ...prevArrows,
      [action]: true,
    }));

    // Deactivate the arrow after a short delay
    setTimeout(() => {
      setActiveArrows((prevArrows) => ({
        ...prevArrows,
        [action]: false,
      }));
    }, 200);

    // Check for matching mapping
    const buffer = 0.5; // Adjust as needed
    const matchedIndex = mapping.findIndex(
      (m) =>
        Math.abs(m.time - currentTime) < buffer &&
        m.action.toLowerCase() === action &&
        !m.hit
    );

    if (matchedIndex !== -1) {
      setScore((prevScore) => prevScore + 10);
      // Mark this mapping as hit
      setMapping((prevMapping) => {
        const newMapping = [...prevMapping];
        newMapping[matchedIndex].hit = true;
        return newMapping;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentTime, mapping, paused, gameStarted, gameEnded]);

  if (!mapping.length) {
    return <div>Loading...</div>;
  }

  // Render the ending screen if the game has ended
  if (gameEnded) {
    return (
      <div className={`${styles.endingScreen} ${gameEnded ? styles.visible : ''}`}>
      <h1>Great job!</h1>
      <p>Your Score: {score}</p>

      <Link className={styles.backLink} href="/select">Back to Song Select</Link>
      <img className={styles.endingGif} src="/assets/mascotWobble.gif" alt="Ending gif" />
    </div>
    );
  }

  return (
    <>
      <div className={styles.gameContainer}>
        <div className={styles.arrowOutlines}>
          <img
            src={
              activeArrows.left
                ? "/arrows/active-left.png"
                : "/arrows/outline-left.png"
            }
            alt="Left Outline"
          />
          <img
            src={
              activeArrows.up
                ? "/arrows/active-up.png"
                : "/arrows/outline-up.png"
            }
            alt="Up Outline"
          />
          <img
            src={
              activeArrows.down
                ? "/arrows/active-down.png"
                : "/arrows/outline-down.png"
            }
            alt="Down Outline"
          />
          <img
            src={
              activeArrows.right
                ? "/arrows/active-right.png"
                : "/arrows/outline-right.png"
            }
            alt="Right Outline"
          />
        </div>
        <Score score={score} />
        <GameCanvas
          song={song}
          mapping={mapping}
          currentTime={currentTime}
          currentMovement={currentMovement}
          setScore={setScore}
        />
      </div>
      <div>
        {paused && <div className={styles.pauseOverlay}>Paused</div>}
      </div>
    </>
  );
}

export default GameNoWebcam;