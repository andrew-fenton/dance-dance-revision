// components/Arrow.js
import styles from '../styles/Arrow.module.css';

export default function Arrow({ action, time, currentTime }) {
  const duration = 5; // Total time for arrow to move from bottom to top
  const timeDifference = time - currentTime;

  if (timeDifference < -0.5) return null; // Remove arrow after it passes
  if (timeDifference > duration) return null; // Not yet time to show the arrow

  // Calculate animation delay so the arrow reaches the top at the correct time
  const animationDelay = `${-1 * (timeDifference - duration)}s`;

  console.log({
    currentTime,
    timeDifference,
    animationDelay,
    action,
  });
  

  // Determine the left position based on the action
  let leftPosition = '0%';
  switch (action) {
    case 'LEFT':
      leftPosition = '0%';
      break;
    case 'UP':
      leftPosition = '25%';
      break;
    case 'DOWN':
      leftPosition = '50%';
      break;
    case 'RIGHT':
      leftPosition = '75%';
      break;
    default:
      break;
  }

  // Choose the appropriate arrow image
  const arrowImage = `/arrows/${action.toLowerCase()}.png`; // e.g., '/arrows/left.png'

  return (
    <img
      src={arrowImage}
      alt={`DANCE ARROW ${action}`}
      className={styles.arrow}
      style={{
        left: leftPosition,
        animationDelay,
      }}
    />
  );
}
