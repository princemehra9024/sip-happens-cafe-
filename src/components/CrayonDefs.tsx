import { useEffect, useRef } from "react";

const SEEDS = [2, 11, 23, 37];

/**
 * Shared SVG filters, mounted once.
 *
 *  #crayon     — roughens any vector stroke into a waxy, hand-drawn line.
 *                Its noise seed is swapped a few times a second, which gives
 *                every character the "boiling line" of frame-by-frame
 *                animation — the look the original gets from 20 MB of GIFs.
 *  #ink-cream  — recolours an image's opaque pixels to the brand cream
 *                (used for the wordmark on the dark frame).
 */
export function CrayonDefs() {
  const turbulence = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      n = (n + 1) % SEEDS.length;
      turbulence.current?.setAttribute("seed", String(SEEDS[n]));
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence
            ref={turbulence}
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed={SEEDS[0]}
            result="wobble"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wobble"
            scale="3.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="shaky"
          />
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed="7" result="grit" />
          <feDisplacementMap in="shaky" in2="grit" scale="2" xChannelSelector="G" yChannelSelector="R" />
        </filter>

        <filter id="ink-cream" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#F0EDE4" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="ink-gold" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#EACB83" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="ink-charcoal" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#25272A" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="ink-olive" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#526044" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
