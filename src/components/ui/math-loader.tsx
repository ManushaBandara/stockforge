import { motion } from "framer-motion";

interface StockForgeLogoProps {
  size?: number;
}

export default function StockForgeLogo({ size = 160 }: StockForgeLogoProps) {
  const brandPink = "#F84C78";

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          position: "absolute",
          width: "150vw",
          height: "150vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandPink} 0%, rgba(0,0,0,0) 60%)`,
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <motion.div
        animate={{
          x: ["-100vw", "100vw"],
        }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          marginBottom: "40px",
        }}
      >
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ overflow: "visible" }}
        >
          <defs>
            <mask id="logoMask">
              <rect x="0" y="0" width="500" height="500" fill="white" />
            </mask>
          </defs>

          <g mask="url(#logoMask)">
            <motion.circle
              cx="250"
              cy="250"
              r="250"
              fill={brandPink}
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M 268 178 C 215 178 180 210 175 250 C 170 285 150 295 165 320 C 185 345 225 342 250 342 C 315 342 345 295 345 250 C 345 205 320 178 268 178 Z"
              fill="#FFFFFF"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <motion.path
              d="M 185 325 C 205 335 230 335 245 328"
              stroke={brandPink}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <motion.path
              d="M 278 175 C 295 145 315 115 325 105"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <motion.path
              d="M 315 135 C 335 110 370 105 400 120 C 425 132 425 165 400 190 C 380 208 345 210 320 185 C 310 175 310 155 315 135 Z"
              fill="#FFFFFF"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <rect
              x="0"
              y="0"
              width="500"
              height="500"
              fill="url(#logoShimmer)"
              style={{ mixBlendMode: "overlay" }}
            />
          </g>
        </motion.svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        style={{
          width: size * 1.2,
          height: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "999px",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 10,
            delay: 1,
            ease: [0.25, 1, 0.5, 1],
          }}
          style={{
            height: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: "999px",
            position: "relative",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "50%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
              mixBlendMode: "overlay",
            }}
          /> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
