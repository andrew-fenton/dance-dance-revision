import React from 'react';
import styles from '@/styles/GameNoWebcam.module.css';

function Score({ score }) {
  return (
    <div className={styles.score}>
      <h2>Score: {score}</h2>
    </div>
  );
}

export default Score;
