// components/Arrow.js
import styles from '../styles/Arrow.module.css';

export default function Arrow({ action, time, currentTime }) {
  const position = (time - currentTime) * 100;

  if (position < -10) return null;

  return (
    <div className={styles.arrow} style={{ top: `${position}%` }}>
      {action}
    </div>
  );
}