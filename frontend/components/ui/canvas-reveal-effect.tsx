"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const CanvasRevealEffect = ({
  animationSpeed = 3,
  containerClassName,
  colors = [
    [59, 130, 246],
    [139, 92, 246],
  ],
  dotSize = 1.5,
}: {
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  dotSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrameId: number;
    const dots: { x: number; y: number; vx: number; vy: number; color: string }[] = [];

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    for (let i = 0; i < 100; i++) {
      const [r, g, b] = colors[Math.floor(Math.random() * colors.length)];
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        color: `rgba(${r}, ${g}, ${b}, 0.8)`,
      });
    }

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        context.beginPath();
        context.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        context.fillStyle = dot.color;
        context.fill();

        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [animationSpeed, colors, dotSize]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-lg",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
};
