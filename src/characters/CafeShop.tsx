import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SVGMotionProps,
  type Variants,
} from "framer-motion";
import { useFrame } from "@/engine/context";
import { clamp, finePointer, useAttr } from "./kit";

/**
 * Café Shop Exterior Illustration.
 * A block-print / woodcut-styled vector illustration of the Snap Café storefront.
 *
 * Micro-interactions:
 *  • Chairs scoot back on hover / tap
 *  • Coffee cup puffs steam on hover / tap
 *  • Striped parasol sways gently in the breeze
 *  • Potted plant leaves lean towards the cursor
 *  • Doorway and window catch a warm golden glint on hover
 *  • "COFFEE" sign sways gently on hover
 */

const START = 0.5;
const STEP = 0.08;

const appear: Variants = {
  hidden: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: START + i * STEP, duration: 0.6, ease: "easeOut" },
  }),
};

interface CleanDoodleProps extends Omit<SVGMotionProps<SVGSVGElement>, "ref" | "children"> {
  active: boolean;
  label: string;
  svgRef?: Ref<SVGSVGElement>;
  children: ReactNode;
}

/** Clean SVG shell without the roughening crayon filter for a crisp block-print aesthetic */
function CleanDoodle({ active, label, svgRef, children, ...rest }: CleanDoodleProps) {
  return (
    <motion.svg
      ref={svgRef}
      fill="none"
      overflow="visible"
      role="img"
      aria-label={label}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      {...rest}
    >
      {children}
    </motion.svg>
  );
}

const chairSpring = { type: "spring" as const, stiffness: 260, damping: 10 };
const breezeSpring = { type: "spring" as const, stiffness: 120, damping: 8 };

/* -------------------- Bistro Chairs -------------------- */

/** Front-left bentwood bistro chair */
function LeftChair() {
  return (
    <motion.g
      whileHover={{ x: -9, rotate: -5 }}
      whileTap={{ x: -14, rotate: -8 }}
      transition={chairSpring}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 1, cursor: "pointer" }}
    >
      {/* Invisible hit box */}
      <rect x="160" y="260" width="90" height="170" fill="transparent" stroke="none" />

      {/* Back legs */}
      <path d="M 174 350 L 164 416" stroke="#25272A" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 238 350 L 246 405" stroke="#25272A" strokeWidth="4.5" strokeLinecap="round" />

      {/* Bentwood hoop backrest (outer) */}
      <path
        d="M 178 355 C 168 295 184 262 212 262 C 240 262 254 295 244 355"
        fill="none"
        stroke="#25272A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Cream inner edge highlight */}
      <path
        d="M 183 352 C 176 300 188 268 212 268 C 236 268 247 300 240 352"
        fill="none"
        stroke="#FFFDF8"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* Inner support loop */}
      <path
        d="M 191 352 C 187 312 196 288 212 288 C 228 288 236 312 232 352"
        fill="none"
        stroke="#25272A"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cross stretcher under seat */}
      <ellipse cx="210" cy="386" rx="28" ry="7" fill="none" stroke="#25272A" strokeWidth="3" />

      {/* Front legs */}
      <path d="M 188 365 L 180 424" stroke="#25272A" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 235 365 L 238 426" stroke="#25272A" strokeWidth="5.5" strokeLinecap="round" />

      {/* Seat base and cushion */}
      <ellipse cx="212" cy="360" rx="33" ry="12" fill="#25272A" />
      <ellipse cx="212" cy="358" rx="30" ry="10" fill="#526044" />
      <path
        d="M 186 358 C 188 352 236 352 238 358"
        fill="none"
        stroke="#FFFDF8"
        strokeWidth="1.5"
        opacity={0.75}
      />
    </motion.g>
  );
}

/** Rear-center chair tucked behind table */
function RearChair() {
  return (
    <motion.g
      whileHover={{ y: -7 }}
      whileTap={{ y: -11 }}
      transition={chairSpring}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 1, cursor: "pointer" }}
    >
      <rect x="236" y="250" width="60" height="90" fill="transparent" stroke="none" />

      {/* Backrest curved top rail */}
      <path
        d="M 242 268 C 254 258 274 258 288 268"
        fill="none"
        stroke="#25272A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Vertical slats */}
      <line x1="248" y1="267" x2="251" y2="306" stroke="#25272A" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="257" y1="262" x2="259" y2="306" stroke="#25272A" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="266" y1="260" x2="267" y2="306" stroke="#25272A" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="275" y1="262" x2="275" y2="306" stroke="#25272A" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="283" y1="267" x2="282" y2="306" stroke="#25272A" strokeWidth="3.2" strokeLinecap="round" />

      {/* Rear seat edge (visible above tabletop) */}
      <ellipse cx="266" cy="308" rx="22" ry="7" fill="#526044" stroke="#25272A" strokeWidth="3" />

      {/* Lower legs */}
      <line x1="250" y1="330" x2="248" y2="370" stroke="#25272A" strokeWidth="4" strokeLinecap="round" />
      <line x1="278" y1="330" x2="276" y2="370" stroke="#25272A" strokeWidth="4" strokeLinecap="round" />
    </motion.g>
  );
}

/** Front-right bentwood bistro chair */
function RightChair() {
  return (
    <motion.g
      whileHover={{ x: 9, rotate: 5 }}
      whileTap={{ x: 14, rotate: 8 }}
      transition={chairSpring}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 1, cursor: "pointer" }}
    >
      <rect x="315" y="255" width="90" height="170" fill="transparent" stroke="none" />

      {/* Back legs */}
      <path d="M 378 346 L 392 404" stroke="#25272A" strokeWidth="4.5" strokeLinecap="round" />

      {/* Bentwood backrest hoop */}
      <path
        d="M 334 350 C 330 295 344 260 366 260 C 388 260 398 295 388 350"
        fill="none"
        stroke="#25272A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Cream inner highlight */}
      <path
        d="M 338 348 C 335 300 348 266 366 266 C 384 266 392 300 384 348"
        fill="none"
        stroke="#FFFDF8"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* Inner support loop */}
      <path
        d="M 346 348 C 344 314 352 286 365 286 C 378 286 383 314 378 348"
        fill="none"
        stroke="#25272A"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Cross stretcher under seat */}
      <ellipse cx="355" cy="380" rx="24" ry="6" fill="none" stroke="#25272A" strokeWidth="3" />

      {/* Front legs */}
      <path d="M 338 358 L 324 414" stroke="#25272A" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 372 358 L 366 418" stroke="#25272A" strokeWidth="5.5" strokeLinecap="round" />

      {/* Seat */}
      <ellipse cx="354" cy="354" rx="30" ry="11" fill="#25272A" />
      <ellipse cx="354" cy="352" rx="27" ry="9" fill="#526044" />
      <path
        d="M 332 352 C 335 347 375 347 377 352"
        fill="none"
        stroke="#FFFDF8"
        strokeWidth="1.5"
        opacity={0.75}
      />
    </motion.g>
  );
}

/* -------------------- Coffee Cup & Steam -------------------- */

function SteamingCup() {
  const [puffKey, setPuffKey] = useState(0);

  const puff = () => setPuffKey((k) => k + 1);

  return (
    <motion.g
      onClick={puff}
      onHoverStart={puff}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: "pointer" }}
    >
      {/* Steam trails */}
      <g>
        <motion.path
          d="M 284 286 C 281 278 288 272 284 264 C 280 256 286 248 282 240"
          fill="none"
          stroke="#D8C8AC"
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{
            pathLength: [0.2, 1, 0.4],
            opacity: [0.45, 0.95, 0.45],
            y: [-1, -6, -1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 289 285 C 292 277 287 270 291 262"
          fill="none"
          stroke="#D8C8AC"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0.3, opacity: 0.3 }}
          animate={{
            pathLength: [0.1, 0.9, 0.2],
            opacity: [0.35, 0.9, 0.35],
            y: [0, -5, 0],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Extra puff on tap */}
        {puffKey > 0 && (
          <motion.path
            key={puffKey}
            d="M 286 284 C 278 274 294 262 284 250"
            fill="none"
            stroke="#EACB83"
            strokeWidth="2.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0, y: 2 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0], y: -16 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        )}
      </g>

      {/* Saucer */}
      <ellipse cx="286" cy="310" rx="18" ry="4" fill="#25272A" />
      <ellipse cx="286" cy="309" rx="16" ry="3" fill="#FFFDF8" />

      {/* Cup Body */}
      <path
        d="M 276 295 L 278 307 C 279 311 293 311 294 307 L 296 295 Z"
        fill="#FFFDF8"
        stroke="#25272A"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Cup Rim & Espresso */}
      <ellipse cx="286" cy="295" rx="10" ry="3.5" fill="#25272A" />
      <ellipse cx="286" cy="295" rx="8.5" ry="2.6" fill="#36402C" />
      <ellipse cx="284.5" cy="295" rx="4" ry="1.4" fill="#EACB83" opacity={0.8} />

      {/* Handle */}
      <path
        d="M 296 297 C 304 297 304 306 295 306"
        fill="none"
        stroke="#25272A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/* -------------------- Striped Umbrella -------------------- */

function Umbrella() {
  return (
    <motion.g
      whileHover={{ rotate: [-0.8, 1, -0.6, 0] }}
      transition={breezeSpring}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 1, cursor: "pointer" }}
    >
      {/* Top Finial Knob */}
      <circle cx="308" cy="67" r="5" fill="#25272A" />

      {/* Canopy Dome - 8 Alternating Striped Wedges */}
      <g>
        {/* Wedge 1 (Leftmost, Olive) */}
        <path
          d="M 308 67 C 265 85 220 115 186 135 C 200 138 215 139 224 139 C 248 114 282 86 308 67 Z"
          fill="#526044"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 2 (Cream) */}
        <path
          d="M 308 67 C 282 86 248 114 224 139 C 238 141 254 141 262 141 C 280 115 298 88 308 67 Z"
          fill="#FFFDF8"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 3 (Olive) */}
        <path
          d="M 308 67 C 298 88 280 115 262 141 C 275 142 292 142 300 142 C 304 116 307 89 308 67 Z"
          fill="#526044"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 4 (Center-Left, Cream) */}
        <path
          d="M 308 67 C 307 89 304 116 300 142 C 312 142 328 142 336 142 C 326 116 316 89 308 67 Z"
          fill="#FFFDF8"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 5 (Center-Right, Olive) */}
        <path
          d="M 308 67 C 316 89 326 116 336 142 C 348 142 364 141 372 140 C 352 116 328 88 308 67 Z"
          fill="#526044"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 6 (Cream) */}
        <path
          d="M 308 67 C 328 88 352 116 372 140 C 382 139 398 137 406 135 C 374 114 338 86 308 67 Z"
          fill="#FFFDF8"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Wedge 7 (Rightmost, Olive) */}
        <path
          d="M 308 67 C 338 86 374 114 406 135 C 414 133 424 130 426 128 C 388 105 348 82 308 67 Z"
          fill="#526044"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Underside Depth Shadow (Dark Olive) */}
      <path
        d="M 186 135 Q 308 178 426 128 L 426 138 Q 308 190 186 145 Z"
        fill="#36402C"
      />

      {/* Scalloped Valance / Overhang */}
      <path
        d="M 186 135
           C 192 149 204 153 214 147
           C 224 156 238 158 248 151
           C 258 160 274 162 284 154
           C 294 164 314 164 324 154
           C 334 163 350 162 360 152
           C 370 159 386 157 394 148
           C 402 154 416 150 426 136
           L 426 128
           Q 308 172 186 135 Z"
        fill="#526044"
        stroke="#25272A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Alternating Cream Scallop Accents */}
      <path
        d="M 214 147 C 224 156 238 158 248 151 L 246 140 C 236 140 224 139 214 147 Z"
        fill="#FFFDF8"
      />
      <path
        d="M 284 154 C 294 164 314 164 324 154 L 320 142 C 304 142 292 142 284 154 Z"
        fill="#FFFDF8"
      />
      <path
        d="M 360 152 C 370 159 386 157 394 148 L 390 138 C 378 140 366 141 360 152 Z"
        fill="#FFFDF8"
      />

      {/* Dark Umbrella Scallop Outline */}
      <path
        d="M 186 135
           C 192 149 204 153 214 147
           C 224 156 238 158 248 151
           C 258 160 274 162 284 154
           C 294 164 314 164 324 154
           C 334 163 350 162 360 152
           C 370 159 386 157 394 148
           C 402 154 416 150 426 136"
        fill="none"
        stroke="#25272A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/* -------------------- Main Component -------------------- */

export function CafeShop({ className }: { className?: string }) {
  const { active } = useFrame();
  const svgRef = useRef<SVGSVGElement>(null);

  // Springy lean for the potted plant leaves towards cursor
  const targetLean = useMotionValue(0);
  const lean = useSpring(targetLean, { stiffness: 90, damping: 8 });
  const plantTransform = useTransform(lean, (v) => `rotate(${v.toFixed(2)} 116 364)`);
  const plantLeavesRef = useAttr<SVGGElement>(plantTransform);

  useEffect(() => {
    if (!active || !finePointer()) return;

    const onMove = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      // Normalised position relative to plant at bottom-left
      const plantScreenX = r.left + r.width * 0.23;
      const dx = (e.clientX - plantScreenX) / (r.width * 0.5);
      targetLean.set(clamp(dx * 12, -14, 14));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      targetLean.set(0);
    };
  }, [active, targetLean]);

  return (
    <CleanDoodle
      svgRef={svgRef}
      viewBox="0 0 500 440"
      active={active}
      label="Illustration of the Snap Café storefront with outdoor striped parasol, bistro chairs, round table, and lush potted plants."
      className={className}
    >
      {/* -------------------- 1. BACKDROP FOLIAGE / BUSHES -------------------- */}
      <motion.g variants={appear} custom={0}>
        {/* Bush behind parasol on the right with woodcut crop edge */}
        <path
          d="M 320 310 L 416 310 L 416 156
             C 416 156 392 144 374 160
             C 356 148 338 162 338 184
             C 322 186 312 208 320 228
             C 308 238 304 264 318 284
             C 312 298 316 308 320 310 Z"
          fill="#526044"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Delicate Stylized Cream Leaves on Bush */}
        <g fill="#FFFDF8" opacity={0.95}>
          <path d="M 374 212 C 386 202 400 206 396 220 C 388 226 376 222 374 212 Z" />
          <path d="M 388 194 C 396 184 408 188 406 198 C 400 206 390 202 388 194 Z" />
          <path d="M 364 228 C 374 220 384 224 382 234 C 376 240 366 236 364 228 Z" />
          <path d="M 390 236 C 400 228 410 234 408 244 C 402 250 392 246 390 236 Z" />
          <path d="M 380 252 C 388 244 398 248 396 258 C 390 262 382 260 380 252 Z" />
        </g>

        {/* Small bush behind center courtyard */}
        <path
          d="M 246 310 C 242 272 252 232 270 216 C 286 202 306 212 316 236 C 324 256 320 290 320 310 Z"
          fill="#3F4C34"
        />
      </motion.g>

      {/* -------------------- 2. GROUND SHADOWS -------------------- */}
      <motion.g variants={appear} custom={1} opacity={0.88}>
        {/* Large plant shadow */}
        <ellipse cx="116" cy="414" rx="28" ry="7" fill="#36402C" />
        {/* Left chair shadow */}
        <ellipse cx="206" cy="418" rx="58" ry="14" fill="#36402C" />
        {/* Table base shadow */}
        <ellipse cx="292" cy="410" rx="38" ry="10" fill="#36402C" />
        {/* Right chair shadow */}
        <ellipse cx="360" cy="404" rx="46" ry="13" fill="#36402C" />
        {/* Pavement ground line */}
        <line x1="72" y1="316" x2="420" y2="316" stroke="#25272A" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* -------------------- 3. STOREFRONT ARCHITECTURE -------------------- */}
      <motion.g variants={appear} custom={2}>
        {/* Storefront Wall Facade (Warm Ivory) */}
        <rect x="76" y="128" width="166" height="186" fill="#DDD5C5" />

        {/* Baseboard / Trim */}
        <rect x="76" y="312" width="166" height="4" fill="#25272A" />

        {/* Left building wall border */}
        <line x1="76" y1="128" x2="76" y2="316" stroke="#25272A" strokeWidth="3" />
      </motion.g>

      {/* -------------------- 4. WALL SHELF WITH MINI PLANT -------------------- */}
      <motion.g variants={appear} custom={3}>
        {/* Shelf */}
        <rect x="76" y="260" width="36" height="5" fill="#25272A" rx="1" />
        <rect x="78" y="265" width="32" height="2" fill="#D8C8AC" />

        {/* Mini Pot */}
        <path d="M 82 242 L 106 242 L 102 260 L 86 260 Z" fill="#FAF7EE" stroke="#25272A" strokeWidth="2.5" />
        <rect x="80" y="238" width="28" height="5" fill="#D8C8AC" stroke="#25272A" strokeWidth="2.5" rx="1" />

        {/* Vertical stem */}
        <line x1="94" y1="238" x2="94" y2="184" stroke="#25272A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Alternating leaves */}
        <path d="M 94 228 C 80 226 78 214 84 212 C 92 210 94 222 94 228 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 226 C 108 224 110 212 104 210 C 96 208 94 220 94 226 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 210 C 80 208 78 196 84 194 C 92 192 94 204 94 210 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 208 C 108 206 110 194 104 192 C 96 190 94 202 94 208 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 192 C 84 190 82 178 88 176 C 94 174 94 186 94 192 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 190 C 104 188 106 178 100 176 C 94 174 94 184 94 190 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
        <path d="M 94 182 C 90 172 98 172 94 182 Z" fill="#526044" stroke="#25272A" strokeWidth="1.8" />
      </motion.g>

      {/* -------------------- 5. ARCHED DOORWAY -------------------- */}
      <motion.g
        variants={appear}
        custom={4}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        style={{ cursor: "pointer" }}
      >
        {/* Outer White Wall Trim Arch */}
        <path
          d="M 112 312 L 112 186 C 112 160 130 142 152 142 C 174 142 192 160 192 186 L 192 312 Z"
          fill="#FFFDF8"
          stroke="#25272A"
          strokeWidth="3.5"
        />

        {/* Inner Dark Door */}
        <path
          d="M 118 312 L 118 188 C 118 166 133 150 152 150 C 171 150 186 166 186 188 L 186 312 Z"
          fill="#25272A"
        />

        {/* Door Glass Panes with Golden Light Reflection */}
        <path
          d="M 124 286 L 124 190 C 124 172 136 158 152 158 C 168 158 180 172 180 190 L 180 286 Z"
          fill="#1E2023"
        />

        {/* Diagonal Golden Reflections */}
        {/* Top-right pane triangle */}
        <path d="M 136 188 L 152 166 L 152 178 L 144 188 Z" fill="#EACB83" opacity={0.9} />
        {/* Bottom pane slashes */}
        <path d="M 124 265 L 150 230 L 150 242 L 124 277 Z" fill="#EACB83" opacity={0.9} />
        <path d="M 124 240 L 150 205 L 150 217 L 124 252 Z" fill="#EACB83" opacity={0.9} />

        {/* Mullions / Crossbars */}
        <line x1="124" y1="188" x2="180" y2="188" stroke="#D8C8AC" strokeWidth="2.5" />
        <line x1="152" y1="158" x2="152" y2="286" stroke="#D8C8AC" strokeWidth="2.5" />

        {/* Threshold */}
        <rect x="110" y="310" width="84" height="4" fill="#25272A" />
      </motion.g>

      {/* -------------------- 6. ARCHED WINDOW -------------------- */}
      <motion.g variants={appear} custom={5}>
        {/* Window Arch Frame */}
        <path
          d="M 202 250 L 202 192 C 202 180 210 172 218 172 C 226 172 234 180 234 192 L 234 250 Z"
          fill="#25272A"
          stroke="#25272A"
          strokeWidth="3.2"
        />
        {/* Window Pane with Golden Light */}
        <path
          d="M 205 248 L 205 194 C 205 184 211 176 218 176 C 225 176 231 184 231 194 L 231 248 Z"
          fill="#1E2023"
        />
        <path d="M 209 246 L 229 216 L 229 246 Z" fill="#EACB83" opacity={0.92} />
        <path d="M 205 230 L 229 194 L 229 204 L 205 240 Z" fill="#EACB83" opacity={0.7} />

        {/* Window Sill */}
        <rect x="198" y="250" width="40" height="6" fill="#FFFDF8" stroke="#25272A" strokeWidth="2.5" rx="1" />
        <rect x="200" y="256" width="36" height="3" fill="#D8C8AC" />
      </motion.g>

      {/* -------------------- 7. "COFFEE" SIGN BOARD -------------------- */}
      <motion.g
        variants={appear}
        custom={6}
        whileHover={{ rotate: [0, -1.8, 1.5, -0.8, 0], originX: 0.5, originY: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ cursor: "pointer" }}
      >
        {/* Top Trim & Awning Beam */}
        <path d="M 80 50 L 250 74 L 250 60 L 80 50 Z" fill="#25272A" />
        <path d="M 80 60 L 250 84 L 250 88 L 80 64 Z" fill="#EACB83" />

        {/* Main Dark Board */}
        <path d="M 78 64 L 252 88 L 248 142 L 76 124 Z" fill="#25272A" />

        {/* Gold Border Line Inside Sign */}
        <path
          d="M 82 70 L 246 93 L 243 136 L 80 120 Z"
          fill="none"
          stroke="#EACB83"
          strokeWidth="2"
        />

        {/* Bottom Gold Accent */}
        <path d="M 76 124 L 248 142 L 248 146 L 76 128 Z" fill="#EACB83" />
        {/* Bottom Support Ledge */}
        <path d="M 75 128 L 249 146 L 248 154 L 75 136 Z" fill="#25272A" />

        {/* "COFFEE" Text in Bold Cream Geometric Sans */}
        <g transform="translate(88, 114) rotate(7.8)">
          <text
            x="0"
            y="0"
            fill="#FFFDF8"
            fontSize="31"
            fontWeight="900"
            letterSpacing="4"
            style={{ fontFamily: "'Outfit', 'Cinzel', system-ui, sans-serif" }}
          >
            COFFEE
          </text>
        </g>
      </motion.g>

      {/* -------------------- 8. UMBRELLA POLE -------------------- */}
      <motion.g variants={appear} custom={7}>
        {/* Pole running from parasol into table base */}
        <line x1="308" y1="140" x2="308" y2="390" stroke="#25272A" strokeWidth="6" strokeLinecap="round" />
      </motion.g>

      {/* -------------------- 9. REAR CHAIR (Behind Table) -------------------- */}
      <motion.g variants={appear} custom={8}>
        <RearChair />
      </motion.g>

      {/* -------------------- 10. UMBRELLA CANOPY -------------------- */}
      <motion.g variants={appear} custom={9}>
        <Umbrella />
      </motion.g>

      {/* -------------------- 11. ROUND CAFE TABLE -------------------- */}
      <motion.g variants={appear} custom={10}>
        {/* Circular Table Pedestal Base */}
        <ellipse cx="292" cy="402" rx="34" ry="9" fill="#25272A" />
        <ellipse cx="292" cy="400" rx="31" ry="7" fill="#36402C" />
        <ellipse cx="292" cy="399" rx="27" ry="5.5" fill="#526044" />

        {/* Vertical Pedestal Column */}
        <path
          d="M 287 326 L 287 396 L 297 396 L 297 326 Z"
          fill="#25272A"
        />
        {/* Ring joints on pedestal */}
        <rect x="284" y="332" width="16" height="5" fill="#36402C" rx="1.5" />
        <rect x="283" y="388" width="18" height="5" fill="#36402C" rx="1.5" />

        {/* Tabletop Outer 3D Rim (Dark Charcoal) */}
        <ellipse cx="292" cy="326" rx="63" ry="16" fill="#25272A" />
        <ellipse cx="292" cy="324" rx="62" ry="15" fill="#D8C8AC" />
        {/* Tabletop Surface (Cream White) */}
        <ellipse cx="292" cy="322" rx="61" ry="14" fill="#FFFDF8" stroke="#25272A" strokeWidth="3" />

        {/* Steaming Coffee Cup */}
        <SteamingCup />
      </motion.g>

      {/* -------------------- 12. FOREGROUND BISTRO CHAIRS -------------------- */}
      <motion.g variants={appear} custom={11}>
        {/* Left Chair */}
        <LeftChair />
        {/* Right Chair */}
        <RightChair />
      </motion.g>

      {/* -------------------- 13. LARGE POTTED PLANT (Bottom Left) -------------------- */}
      <motion.g
        variants={appear}
        custom={12}
        whileHover={{ scale: 1.02 }}
        whileTap={{ rotate: [-2, 2, -1, 0] }}
        transition={{ duration: 0.6 }}
        style={{ cursor: "pointer" }}
      >
        {/* Pot Base Body (Beige/Sand) */}
        <path
          d="M 94 374 L 138 374 L 131 416 L 101 416 Z"
          fill="#E5DFD2"
          stroke="#25272A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Pot Inner Contour Shadow */}
        <path d="M 124 376 L 136 376 L 129 414 L 122 414 Z" fill="#D8C8AC" />

        {/* Pot Rim */}
        <rect
          x="90"
          y="364"
          width="52"
          height="10"
          fill="#FAF7EE"
          stroke="#25272A"
          strokeWidth="3.5"
          rx="2"
        />
        {/* Soil inside */}
        <ellipse cx="116" cy="365" rx="22" ry="4" fill="#25272A" />

        {/* Five Big Leaning Tropical Leaves */}
        <g ref={plantLeavesRef} style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}>
          {/* Leaf 1: Lower Left */}
          <path
            d="M 112 364 C 88 358 68 346 74 330 C 86 320 108 344 112 364 Z"
            fill="#526044"
            stroke="#25272A"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M 108 360 C 94 348 82 336 80 330" stroke="#FFFDF8" strokeWidth="1.6" opacity={0.7} />

          {/* Leaf 2: Mid Left */}
          <path
            d="M 114 362 C 84 332 70 294 88 282 C 108 284 120 324 116 362 Z"
            fill="#526044"
            stroke="#25272A"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M 112 355 C 98 328 86 302 90 292" stroke="#FFFDF8" strokeWidth="1.6" opacity={0.7} />

          {/* Leaf 3: Top Left */}
          <path
            d="M 116 362 C 100 308 96 258 116 254 C 134 258 132 312 118 362 Z"
            fill="#526044"
            stroke="#25272A"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M 116 354 C 112 312 110 276 116 264" stroke="#FFFDF8" strokeWidth="1.6" opacity={0.7} />

          {/* Leaf 4: Top Right */}
          <path
            d="M 118 362 C 128 310 148 268 162 274 C 168 292 148 332 120 362 Z"
            fill="#526044"
            stroke="#25272A"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M 122 354 C 134 320 148 294 156 284" stroke="#FFFDF8" strokeWidth="1.6" opacity={0.7} />

          {/* Leaf 5: Mid/Lower Right */}
          <path
            d="M 120 364 C 144 342 170 326 172 340 C 166 358 140 368 122 364 Z"
            fill="#526044"
            stroke="#25272A"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M 124 362 C 140 350 156 340 164 340" stroke="#FFFDF8" strokeWidth="1.6" opacity={0.7} />
        </g>
      </motion.g>
    </CleanDoodle>
  );
}

