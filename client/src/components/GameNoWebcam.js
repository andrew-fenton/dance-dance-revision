import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import styles from "../styles/GameNoWebcam.module.css";
import GameCanvas from "./GameCanvas";
import Score from "./Score";
import Link from "next/link";

function GameNoWebcam({ song, score, setScore, currentMovement}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [mapping, setMapping] = useState([]);
  const [paused, setPaused] = useState(false);
  const [activeArrows, setActiveArrows] = useState({
    left: false,
    up: false,
    down: false,
    right: false,
  });
  const [inputs, setInputs] = useState([]); // mainly for debugging

  // This is the countdown for the game starting
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  // Ending screen
  const [gameEnded, setGameEnded] = useState(false);

  const gameInterval = useRef(null);
  const soundRef = useRef(null);

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

  // Countdown before starting the game
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setGameStarted(true);
    }
  }, [countdown]);

  // Start the sound and update currentTime
  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const sound = new Howl({
      src: [song.file],
      html5: true,
      onend: () => {
        setGameEnded(true);
      }
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
  }, [song, gameStarted]);

  // Handle key presses
  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();

    if (key === " ") {
      // Spacebar toggles pause
      setPaused((prevPaused) => !prevPaused);
      return;
    }

    if (paused || !gameStarted || gameEnded) {
      // Ignore other key presses when paused or game started or game ended
      return;
    }

    // Map keys to actions
    let action = "";
    if (key === "ARROWLEFT" || key === "A") action = "left";
    else if (key === "ARROWUP" || key === "W") action = "up";
    else if (key === "ARROWDOWN" || key === "S") action = "down";
    else if (key === "ARROWRIGHT" || key === "D") action = "right";
    else return; // Ignore other keys

    // //Record the input
    setInputs((prevInputs) => [
      ...prevInputs,
      { time: currentTime.toFixed(2), action },
    ]);

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
    }, 200); // Adjust delay as needed

    // Check for matching mapping
    const buffer = 0.5; // Adjust as needed
    const matchedIndex = mapping.findIndex(
      (m) =>
        Math.abs(m.time - currentTime) < buffer &&
        m.action.toLowerCase() === action &&
        !m.hit // Ensure the mapping hasn't been matched yet
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

  // Add event listener for key presses
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentTime, mapping, paused, gameStarted]);

  // Ensure mapping is loaded before rendering
  if (!mapping.length) {
    return <div>Loading...</div>;
  }

  // Display countdown screen before starting the game
  // Display the countdown screen before the game starts
  if (!gameStarted) {
    return (
      <div className={styles.countdownContainer}>
        <h5>Starting in {countdown}</h5>
        <img className={styles.loadingGif} src="/assets/loadingMascot.gif" alt="Countdown" />
      </div>
    );
  }

  return (
    <>
      <div className={styles.gameContainer}>
        {/* Arrow outlines at the top */}
              {/* Display the inputs list */}
        
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

        {/* Render arrows */}
        <div>
          <GameCanvas
            song={song}
            mapping={mapping}
            currentTime={currentTime}
            currentMovement={currentMovement}
            setScore={setScore}
          />
        </div>
      </div>

      <div>
        {/* Other components like Score */}
        <Score score={score} />
        <div className={styles.inputsList}>
          <h3>Inputs:</h3>
          <ul>
            {inputs.map((input, index) => (
              <li key={index}>
                {input.time} - {input.action}
              </li>
            ))}
          </ul>
        </div>

        {/* Pause overlay */}
        {paused && <div className={styles.pauseOverlay}>Paused</div>}

         {/* Ending screen overlay */}
        <div className={`${styles.endingScreen} ${gameEnded ? styles.visible : ''}`}>
          <h1>Great job!</h1>
          <p>Your Score: {score}</p>

          <Link className={styles.backLink} href="/select">Back to Song Select</Link>
          <img className={styles.endingGif} src="/assets/mascotWobble.gif" alt="Ending gif" />
        </div>
      </div>
    </>
  );
}

export default GameNoWebcam;
