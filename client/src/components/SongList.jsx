import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/SelectScreen.module.css";
import songs from "@/data/songs";
import GameNoWebcam from "@/components/GameNoWebcam";

export default function SelectSongScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isInitialRender, setIsInitialRender] = useState(true); // Track initial render

  // Ref for the background music
  const backgroundMusicRef = useRef(null);

  // Play background music on loop
  useEffect(() => {
    const backgroundMusic = new Audio("/songs/SelectTheme.mp3");
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.volume = 0.2; // Set volume (adjust as needed)
    backgroundMusic
      .play()
      .then(() => console.log("Background music playing"))
      .catch((error) =>
        console.error("Background music playback failed:", error)
      );

    // Save the music instance in the ref
    backgroundMusicRef.current = backgroundMusic;

    // Cleanup music when the component unmounts
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, []);

  // Play button click sound
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.currentTime = 0; // Reset the sound to start
    audio
      .play()
      .then(() => console.log(`${soundPath} sound played`))
      .catch((error) => console.error(`Audio playback failed for ${soundPath}:`, error));
  };

  // Handle key presses
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    } else if (e.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      setSelectedSong(songs[currentIndex]); // Set the selected song
      playSound("/songs/buttonclick.wav"); // Play sound when the song is selected

      // Stop background music before navigating
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    }
  };

  // Play switch sound whenever the index changes (excluding the initial render)
  useEffect(() => {
    if (!isInitialRender) {
      playSound("/songs/switch.wav");
    } else {
      setIsInitialRender(false); // Set initial render to false after the first render
    }
  }, [currentIndex]);

  // Attach keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // If a song is selected, show the GameNoWebcam component
  if (selectedSong) {
    return <GameNoWebcam song={selectedSong} />;
  }

  // Otherwise, display the SelectSongScreen
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