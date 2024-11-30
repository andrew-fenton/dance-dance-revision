import { useState, useEffect, useRef } from 'react';
import Arrow from './Arrow';
import Score from './Score';
import { Howl } from 'howler';
import styles from '../styles/GameNoWebcam.module.css';
import GameCanvas from './GameCanvas';

function GameNoWebcam({ song }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [mapping, setMapping] = useState([]);
  const [paused, setPaused] = useState(false);
  // const [inputs, setInputs] = useState([]); mainly for debugging

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

  // Start the sound and update currentTime
  useEffect(() => {
    const sound = new Howl({
      src: [song.file],
      html5: true,
    });

    soundRef.current = sound;
    sound.play();

    gameInterval.current = setInterval(() => {
      if (!paused) {
        setCurrentTime(sound.seek());
      }
    }, 50);

    return () => {
      clearInterval(gameInterval.current);
      sound.stop();
    };
  }, [song]);

  // Handle key presses
  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();

    if (key === ' ') {
      // Spacebar toggles pause
      setPaused((prevPaused) => !prevPaused);
      return;
    }

    if (paused) {
      // Ignore other key presses when paused
      return;
    }

    // Map keys to actions
    let action = '';
    if (key === 'ARROWLEFT' || key === 'A') action = 'LEFT';
    else if (key === 'ARROWUP' || key === 'W') action = 'UP';
    else if (key === 'ARROWDOWN' || key === 'S') action = 'DOWN';
    else if (key === 'ARROWRIGHT' || key === 'D') action = 'RIGHT';
    else return; // Ignore other keys

    // Record the input
    // setInputs((prevInputs) => [
    //   ...prevInputs,
    //   { time: currentTime.toFixed(2), action },
    // ]);

    // Check for matching mapping
    const buffer = 0.5; // Adjust as needed
    const matchedIndex = mapping.findIndex(
      (m) =>
        Math.abs(m.time - currentTime) < buffer &&
        m.action === action &&
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
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTime, mapping, paused]);

  // Ensure mapping is loaded before rendering
  if (!mapping.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className={styles.gameContainer}>
      {/* Arrow outlines at the top */}
      <div className={styles.arrowOutlines}>
        <img src="/arrows/outline-left.png" alt="Left Outline" />
        <img src="/arrows/outline-up.png" alt="Up Outline" />
        <img src="/arrows/outline-down.png" alt="Down Outline" />
        <img src="/arrows/outline-right.png" alt="Right Outline" />
      </div>

      {/* Render arrows */}
      <div>
      <GameCanvas song={song} mapping={mapping} currentTime={currentTime} />
      {/* <div className={styles.arrowsContainer}>
        {mapping.map((m, index) => (
          <Arrow
            key={index}
            action={m.action}
            time={m.time}
            currentTime={currentTime}
          />
        ))}
      </div> */}
    </div>
  </div>


    <div>
    

      {/* Other components like Score, Inputs, etc. */}
      <Score score={score} />
      <p>Current Time: {currentTime.toFixed(2)}</p>
      {/* Display the inputs list */}
      {/* <div className={styles.inputsList}>
        <h3>Inputs:</h3>
        <ul>
          {inputs.map((input, index) => (
            <li key={index}>
              {input.time} - {input.action}
            </li>
          ))}
        </ul>
      </div> */}
      {/* Pause overlay */}
      {paused && <div className={styles.pauseOverlay}>Paused</div>}
    </div>
    </>
  );
}

export default GameNoWebcam;