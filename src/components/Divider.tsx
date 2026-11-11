import { cn } from "@/utils/cn";

/**
 * The hand-drawn rule that separates sections on the original site,
 * redrawn as a single SVG path so it is crisp at any width and weighs nothing.
 */
export function Divider({ className, reveal = "clip-right" }: { className?: string; reveal?: string }) {
  return (
    <svg
      data-reveal={reveal}
      viewBox="0 0 1376 14"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-[14px] w-full", className)}
    >
      <path
        d="M2 7.5 C 60 4.5, 150 9.5, 236 7 S 420 3.5, 520 6.5 S 700 10.5, 790 7.5 S 960 3.8, 1050 6.2 S 1210 9.6, 1290 7 S 1350 5.2, 1374 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.5"
      />
    </svg>
  );
}
