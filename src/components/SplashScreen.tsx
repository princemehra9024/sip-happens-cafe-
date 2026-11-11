import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { whenFontsReady } from "@/lib/fonts";

/**
 * Geometric leaf rosette / mandala emblem shown in the corners
 */
function CornerMandala({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Outer concentric rings */}
      <circle cx="160" cy="160" r="150" stroke="#DFD3BE" strokeWidth="2.5" opacity="0.85" />
      <circle cx="160" cy="160" r="138" stroke="#E6DC CB" strokeWidth="1.5" opacity="0.6" />
      <circle cx="160" cy="160" r="105" stroke="#DFD3BE" strokeWidth="1.8" opacity="0.75" />
      <circle cx="160" cy="160" r="70" stroke="#DFD3BE" strokeWidth="1.5" opacity="0.6" />

      {/* Geometric petal rosettes (12-petal symmetry) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 160 160)`}>
          {/* Outer pointed petal */}
          <path
            d="M160 10 C 182 60 182 110 160 150 C 138 110 138 60 160 10 Z"
            stroke="#DFD3BE"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* Inner pointed petal */}
          <path
            d="M160 55 C 174 90 174 125 160 150 C 146 125 146 90 160 55 Z"
            stroke="#DFD3BE"
            strokeWidth="1.6"
            opacity="0.7"
          />
          {/* Connecting arcs */}
          <path
            d="M160 70 Q 185 105 160 130"
            stroke="#E3D7C4"
            strokeWidth="1.4"
            opacity="0.55"
          />
        </g>
      ))}

      {/* Centre floral core */}
      <circle cx="160" cy="160" r="28" stroke="#DFD3BE" strokeWidth="2" opacity="0.85" />
      <circle cx="160" cy="160" r="10" fill="#DFD3BE" opacity="0.45" />
    </svg>
  );
}

/**
 * Animated coffee mug matching the uploaded sketch
 */
function CoffeeCup() {
  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 200 170"
        className="w-[175px] h-[150px] overflow-visible select-none pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip path for the liquid inside the glass mug */}
          <clipPath id="mug-inner-clip">
            <rect x="52" y="58" width="84" height="60" rx="18" ry="18" />
          </clipPath>
        </defs>

        {/* --- Animated Steam Wisps --- */}
        <motion.path
          d="M87 46 C 82 38 92 32 86 22 C 81 14 88 8 85 2"
          stroke="#7E6047"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0.7, opacity: 0.4, y: 3 }}
          animate={{
            pathLength: [0.6, 1, 0.7],
            opacity: [0.35, 0.85, 0.35],
            y: [-2, -8, -2],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M103 44 C 98 36 108 30 102 20 C 97 12 104 6 101 0"
          stroke="#7E6047"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0.7, opacity: 0.4, y: 3 }}
          animate={{
            pathLength: [0.6, 1, 0.7],
            opacity: [0.3, 0.8, 0.3],
            y: [0, -7, 0],
          }}
          transition={{
            duration: 3.1,
            repeat: Infinity,
            delay: 0.5,
            ease: "easeInOut",
          }}
        />

        {/* --- Cup Body Glass Fill --- */}
        <rect
          x="52"
          y="58"
          width="84"
          height="60"
          rx="18"
          ry="18"
          fill="#FAF8F3"
          stroke="none"
        />

        {/* --- Coffee Liquid (Clipped inside mug) --- */}
        <g clipPath="url(#mug-inner-clip)">
          {/* Coffee foam / lighter warm crema layer */}
          <motion.path
            d="M48 83 Q 72 76, 96 85 T 140 82 L 140 122 L 48 122 Z"
            fill="#CDB596"
            animate={{
              d: [
                "M48 83 Q 72 76, 96 85 T 140 82 L 140 122 L 48 122 Z",
                "M48 85 Q 72 89, 96 81 T 140 85 L 140 122 L 48 122 Z",
                "M48 83 Q 72 76, 96 85 T 140 82 L 140 122 L 48 122 Z",
              ],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Deep roasted coffee brown body */}
          <motion.path
            d="M48 89 Q 72 82, 96 91 T 140 88 L 140 122 L 48 122 Z"
            fill="#805638"
            animate={{
              d: [
                "M48 89 Q 72 82, 96 91 T 140 88 L 140 122 L 48 122 Z",
                "M48 91 Q 72 95, 96 87 T 140 91 L 140 122 L 48 122 Z",
                "M48 89 Q 72 82, 96 91 T 140 88 L 140 122 L 48 122 Z",
              ],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Bottom curve liquid shadow */}
          <path
            d="M52 108 C 58 116 74 118 94 118 C 114 118 130 116 136 108 L 136 122 L 52 122 Z"
            fill="#694429"
            opacity="0.35"
          />
        </g>

        {/* --- Cup Glass Outer Outline --- */}
        <rect
          x="52"
          y="58"
          width="84"
          height="60"
          rx="18"
          ry="18"
          fill="none"
          stroke="#42352B"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- Glass Shine Highlight (upper right inner edge) --- */}
        <path
          d="M120 66 L 126 66 L 126 80"
          stroke="#42352B"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="115" cy="71" r="1.3" fill="#42352B" opacity="0.8" />

        {/* --- Mug Handle --- */}
        <path
          d="M136 67 C 153 67 157 76 157 88 C 157 100 151 109 136 109"
          stroke="#42352B"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner handle curve */}
        <path
          d="M136 76 C 146 76 148 82 148 88 C 148 94 144 100 136 100"
          stroke="#42352B"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- Table / Shelf Under Cup --- */}
        {/* Main line under cup */}
        <line
          x1="32"
          y1="126"
          x2="148"
          y2="126"
          stroke="#42352B"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Short dash to the right */}
        <line
          x1="156"
          y1="126"
          x2="168"
          y2="126"
          stroke="#42352B"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>

      {/* --- Loading Label with 3 Animated Dots --- */}
      <div className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[14px] font-semibold tracking-[0.28em] text-[#42352B]">
        <span>LOADING</span>
        <div className="flex items-center gap-1 pl-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block h-[5px] w-[5px] rounded-full bg-[#7E6047]"
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.22,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Fullscreen splash screen matching the uploaded design
 */
export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let unmounted = false;

    // Minimum display time (2.1s) to allow a pleasant viewing of the animation,
    // combined with waiting for web fonts to be completely ready.
    const timer = new Promise((resolve) => window.setTimeout(resolve, 2100));
    const fonts = whenFontsReady(1500);

    Promise.all([timer, fonts]).then(() => {
      if (!unmounted) {
        setVisible(false);
      }
    });

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F6F3EB] select-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'480\' height=\'480\'%3E%3Cfilter id=\'a\' x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.012 .006\' numOctaves=\'4\' seed=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .78 0 0 0 0 .71 0 0 0 0 .61 0 0 0 .14 -.04\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23a)\'/%3E%3C/svg%3E")',
            backgroundSize: "480px 480px",
          }}
        >
          {/* Top-Left Corner Geometric Mandala */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-[380px] w-[380px] sm:-left-16 sm:-top-16 sm:h-[480px] sm:w-[480px] opacity-75">
            <CornerMandala className="h-full w-full" />
          </div>

          {/* Bottom-Right Corner Geometric Mandala */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] sm:-bottom-20 sm:-right-20 sm:h-[520px] sm:w-[520px] opacity-75">
            <CornerMandala className="h-full w-full" />
          </div>

          {/* Central Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <CoffeeCup />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

