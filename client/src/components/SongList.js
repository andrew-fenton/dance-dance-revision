import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/SelectScreen.module.css";
import songs from "@/data/songs";

export default function SongList({ songs, onSongSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const backgroundMusicRef = useRef(null); // Ref to manage background music

  // Play sound function
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.currentTime = 0; // Reset the sound to start
    audio
      .play()
      .then(() => console.log(`${soundPath} played successfully`))
      .catch((error) =>
        console.error(`Error playing ${soundPath}:`, error)
      );
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % songs.length;
        playSound("/songs/switch.wav"); // Play switch sound
        return newIndex;
      });
    } else if (e.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? songs.length - 1 : prevIndex - 1;
        playSound("/songs/switch.wav"); // Play switch sound
        return newIndex;
      });
    } else if (e.key === "Enter") {
      onSongSelect(songs[currentIndex]); // Set the selected song
      playSound("/songs/buttonclick.wav"); // Play the button click sound

      // Stop background music when navigating away
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    }
  };

  // Play background music on mount
  useEffect(() => {
    const backgroundMusic = new Audio("/songs/SelectTheme.mp3");
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.volume = 0.5; // Adjust volume
    backgroundMusic
      .play()
      .then(() => console.log("Background music playing"))
      .catch((error) =>
        console.error("Background music playback failed:", error)
      );

    backgroundMusicRef.current = backgroundMusic;

    // Cleanup: Stop background music on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  // Attach keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]); // Add dependency to re-attach handler if currentIndex changes

  return (
    <div className={styles.selectSongScreen}>
      <div className={styles.slider}>
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`${styles.song} ${
              index === currentIndex ? styles.activeSong : ""
            }`}
          >
            <img
              src={song.photo}
              alt={`${song.title} Cover`}
              className={styles.songImage}
            />
            {index === currentIndex && (
              <>
                <p className={styles.songName}>{song.title}</p>
                <p
                  className={styles.difficulty}
                  style={{
                    color:
                      song.difficulty === "Easy"
                        ? "#39ff14"
                        : song.difficulty === "Medium"
                        ? "#ffff33"
                        : "#ff073a",
                  }}
                >
                  {song.difficulty.charAt(0).toUpperCase() +
                    song.difficulty.slice(1)}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}