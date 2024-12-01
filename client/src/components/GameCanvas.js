import { useEffect, useRef } from "react";

function GameCanvas({ song, mapping, currentTime }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const arrows = ["left", "up", "down", "right"];

    // Load images
    const loadImages = async () => {
      for (const arrow of arrows) {
        const img = new Image();
        img.src = `/arrows/${arrow}.png`;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        imagesRef.current[arrow] = img;
      }
    };

    loadImages().then(() => {
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate and draw arrows
        const duration = 5; // Time it takes for arrow to move from bottom to top
        mapping.forEach((m) => {
          if (m.hit) return; // Skip hit arrows

          const timeDifference = m.time - currentTime;
          if (timeDifference < -0.5 || timeDifference > duration) return;

          const position =
            ((duration - timeDifference) / duration) * (canvas.height - 100);

          const img = imagesRef.current[m.action.toLowerCase()];
          const index = arrows.indexOf(m.action.toLowerCase());
          ctx.drawImage(
            img,
            index * 60 + 20,
            position,
            50,
            50 // Adjust positions and sizes as needed
          );
        });

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [mapping, currentTime]);

  return <canvas ref={canvasRef} width={400} height={600} />;
}

export default GameCanvas;