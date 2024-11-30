// components/SongList.js
import React, { useState, useEffect } from "react";
import styles from "@/styles/SelectScreen.module.css";
import songs from "@/data/songs";

export default function SongList({ songs, onSongSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Play sound function
  const playSound = () => {
    const audio = new Audio("/songs/buttonclick.wav"); // Ensure the file path is correct
    audio.currentTime = 0; // Reset the sound to start
    audio
      .play()
      .then(() => console.log("Sound played successfully"))
      .catch((error) => console.error("Audio playback failed:", error));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    } else if (e.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      onSongSelect(songs[currentIndex]); // Set the selected song
      playSound(); // Play the sound
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className={styles.selectSongScreen}>
      <h1 className={styles.title}>Pick your song with Enter</h1>
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
    // <ul className={styles.songList}>
    //   {songs.map((song) => (
    //     <li key={song.id} className={styles.songItem}>
    //       <button onClick={() => {
    //         onSongSelect(song)
    //         console.log(song);
    //         }}>
    //         {song.title} - {song.artist}
    //       </button>
    //     </li>
    //   ))}
    // </ul>
    
  );
}