import { useEffect, useRef, useCallback, useMemo } from "react";

function GameCanvas({ song, mapping, currentTime, currentMovement, setScore}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const animationRef = useRef(null);

  const MOVEMENT_IDX_MAP = {
    "LEFT": 0,
    "RIGHT": 1,
    "UP": 2,
    "DOWN": 3,
  }

  const arrows = useMemo(() => ["left", "up", "down", "right"], []);

  // Preload images
  const loadImages = useCallback(async () => {
    const imagePromises = arrows.map((arrow) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imagesRef.current[arrow] = img;
          resolve(img);
        };
        img.onerror = reject;
        img.src = `/arrows/${arrow}.png`;
      });
    });

    await Promise.all(imagePromises);
  }, [arrows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imageLoadPromise = loadImages();
    const draw = () => {
      // Clear only the area that changes
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Configuration constants
      const DURATION = 5; // Time it takes for arrow to move from bottom to top
      const ARROW_WIDTH = 50;
      const ARROW_HEIGHT = 50;
      const LANE_WIDTH = 60;
      const PADDING = 20;
      const MISS_THRESHOLD = -0.5;

      // Optimize mapping iteration
      for (const m of mapping) {
        if (m.hit) continue; // Skip hit arrows

        const timeDifference = m.time - currentTime;
        
        // Early continue for arrows outside visible range
        if (timeDifference < MISS_THRESHOLD || timeDifference > DURATION) continue;

        // Calculate arrow position with smoother interpolation
        const progress = 1 - (timeDifference / DURATION);

        if (progress > 0.95 && currentMovement[MOVEMENT_IDX_MAP[m.action]]) {
          m.hit = true;
          setScore((prevScore) => prevScore + 10);
        }
      
        const position = progress * (canvas.height - 100);

        // Find image and lane index
        const arrowAction = m.action.toLowerCase();
        const img = imagesRef.current[arrowAction];
        
        // Ensure image is loaded before drawing
        if (!img) continue;

        const laneIndex = arrows.indexOf(arrowAction);
        
        // Draw arrow with optimized positioning
        ctx.drawImage(
          img,
          laneIndex * LANE_WIDTH + PADDING,
          position,
          ARROW_WIDTH,
          ARROW_HEIGHT
        );
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };

    // Ensure images are loaded before starting animation
    imageLoadPromise.then(() => {
      draw();
    });

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mapping, currentTime, loadImages]);

  return <canvas ref={canvasRef} width={400} height={600} />;
}

export default GameCanvas;
