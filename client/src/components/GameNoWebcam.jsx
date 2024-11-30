import { useState, useEffect, useRef } from 'react';
import Arrow from './Arrow';
import Score from './Score';
import { Howl } from 'howler';
import styles from '../styles/GameNoWebcam.module.css';
import Image from 'next/image';

function GameNoWebcam({ song }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const gameInterval = useRef(null);
  const soundRef = useRef(null);
  const [mapping, setMapping] = useState([]);
  const [paused, setPaused] = useState(false);
  const [inputs, setInputs] = useState([]);

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

  // useEffect, starts the SOUND
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
  }, [mapping]);

  // useEffect, handle pausing and unpausing the game
  useEffect(() => {
    if (paused) {
        soundRef.current.pause();
    } else {
        if (soundRef.current) {
            soundRef.current.play();
        }
    }
  }, [paused]);

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

    // Map arrow keys to actions
    let action = '';
    if (key === 'W') action = 'UP';
    else if (key === 'S') action = 'DOWN';
    else if (key === 'A') action = 'LEFT';
    else if (key === 'D') action = 'RIGHT';
    else return; // Ignore other keys

    // Record the input
    setInputs((prevInputs) => [
      ...prevInputs,
      { time: currentTime.toFixed(2), action },
    ]);

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
      // Mark this mapping as hit -> This is currently problematic
      // setMapping((prevMapping) => {
      //   const newMapping = [...prevMapping];
      //   newMapping[matchedIndex].hit = true;
      //   return newMapping;
      // });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTime, mapping, paused]);

  return (
    <div className={styles.gameContainer}>
      <Score score={score} />
      <p>{currentTime}</p>
      <div className={styles.arrows}>
        {mapping.map((m, index) => (
          <Arrow
            key={index}
            action={m.action}
            time={m.time}
            currentTime={currentTime}
          />
        ))}
      </div>
      {/* Display the inputs list */}
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
      <img src="/assets/patrick.gif" alt="PATRICK VIBIN"></img>
      <img src="/assets/carlton.gif" alt="CARLTON VIBIN"></img>
      <img src="/assets/gwimbly.gif" alt="GWIMBLY VIBIN"></img>
      <img src="/assets/lebron-james-dancing.gif" alt="LEBRON VIBIN"></img>
      <img src="/assets/peanutsvibin.gif" alt="PEANUTS VIBIN"></img>
      <img src="/assets/skeleton-meme.gif" alt="SKELETON VIBIN"></img>
      <img src="/assets/winnie-the.gif" alt="WINNIE VIBIN"></img>
    </div>
  );
}

export default GameNoWebcam;
