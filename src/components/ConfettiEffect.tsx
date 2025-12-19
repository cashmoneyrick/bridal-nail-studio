import { useState, useEffect } from "react";

interface ConfettiEffectProps {
  count?: number;
}

const ConfettiEffect = ({ count = 25 }: ConfettiEffectProps) => {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
      "#FFD700",
      "#FF69B4",
      "#87CEEB",
    ];
    
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setPieces(newPieces);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
