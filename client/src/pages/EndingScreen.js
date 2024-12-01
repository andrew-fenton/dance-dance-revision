import React from "react";
import styles from "../styles/EndingScreen.module.css";
import Score from "@/components/Score";

export default function EndingScreen({ score, onRestart }) {
  return (
    <div className={styles.endingScreen}>
      <h1 className={styles.gameName}>Dance Dance Revolution</h1>
      <h2>Game Over</h2>
      <Score score={score} />
      <button className={styles.restartButton} onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}