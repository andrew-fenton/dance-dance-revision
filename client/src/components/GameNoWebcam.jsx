import { useState, useEffect, useRef } from 'react';
import Arrow from './Arrow';
import Score from './Score';
import { Howl } from 'howler';
import styles from '../styles/GameNoWebcam.module.css';
import Image from 'next/image';

function Game({ song }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const gameInterval = useRef(null);
  const soundRef = useRef(null);
  const [mapping, setMapping] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function loadMapping() {
      const mappingModule = await import(`../data/mappings/${song.id}.js`);
      setMapping(mappingModule.default);
    }
    loadMapping();
  }, [song.id]);

  useEffect(() => {
    if (mapping.length === 0) {
        return;
    }

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

  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();

    // If space bar, pause the game if unpaused and unpause if paused
    if (key === ' ') {
        setPaused((prevPaused) => !prevPaused);
        return;
    }

    // If it's paused, just ignore everything
    if (paused && key !== ' ') {
        return;
    }

    const buffer = 0.5;
    const currentMappings = mapping.filter(
      (m) => Math.abs(m.time - currentTime) < buffer && m.action === key
    );
    if (currentMappings.length > 0) {
      setScore((prevScore) => prevScore + 10);
      // Optionally remove the matched mapping to prevent multiple counts
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTime, mapping]);

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

export default Game;
