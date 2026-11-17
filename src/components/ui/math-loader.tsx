import { motion } from "framer-motion";

interface StockForgeLogoProps {
  size?: number;
}

const fillTransition = {
  duration: 3,
  ease: "easeInOut" as const,
  repeat: Infinity,
  repeatDelay: 1,
};

export default function StockForgeLogo({ size = 120 }: StockForgeLogoProps) {
  const letters = "StockForge";

  return (
    <div
      className="flex items-center justify-center select-none whitespace-nowrap"
      style={{
        height: size,
        width: size * 3.4,
        fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Large animated S */}

      {/* Remaining letters */}
      <span className="inline-flex items-center">
        {letters.split("").map((letter, index) => (
          <motion.span
            key={index}
            className="font-black inline-block"
            style={{
              fontSize: size * 0.48,
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 1,
              WebkitTextStroke: "1.5px #ED1C16",
              WebkitTextFillColor: "transparent",
              backgroundImage:
                "linear-gradient(to top, #ED1C16 50%, transparent 50%)",
              backgroundSize: "100% 200%",
              backgroundPosition: "0 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
            animate={{
              backgroundPosition: ["0 100%", "0 0%", "0 100%"],
            }}
            transition={{
              ...fillTransition,
              delay: 0.15 + index * 0.12,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </div>
  );
}
