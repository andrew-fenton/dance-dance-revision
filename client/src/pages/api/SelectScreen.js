import React from "react";
import styles from "@/styles/SelectScreen.module.css";

export default function SelectSongScreen() {
  return (
    <div className={styles.selectSongScreen}>
      <h1 className={styles.title}>Dance Dance Revolution</h1>
      <div className={styles.song}>
        <img src="https://i.scdn.co/image/ab67616d0000b273ba60245b7725fdc3719027c0" alt="Song Cover" />
        <p className={styles.songName}>APT</p>
        <p className={styles.difficulty}>Hard</p>
      </div>
    </div>
  );
}
