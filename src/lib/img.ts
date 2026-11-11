/**
 * Image URL helpers.
 *
 * Nothing is bundled: every photo is a CDN link. The CDN resizes on demand via
 * `?format=<width>w` and negotiates WebP automatically, so we only have to ask
 * for the width we actually need.
 */

const WIDTHS = [300, 500, 750, 1000, 1500, 2500] as const;

/** A single resized URL */
export const cdn = (src: string, width: number) => {
  if (src.includes("unsplash.com")) {
    const base = src.split("?")[0];
    return `${base}?w=${width}&auto=format&fit=crop&q=82`;
  }
  if (src.includes("squarespace-cdn.com")) {
    return `${src}?format=${width}w`;
  }
  return src;
};

/** Tiny (~2 KB) version used as a blurred placeholder while the real one loads */
export const thumb = (src: string) => {
  if (src.includes("unsplash.com")) {
    const base = src.split("?")[0];
    return `${base}?w=80&auto=format&fit=crop&q=30`;
  }
  return cdn(src, 100);
};

/** Responsive candidates, optionally capped (some PNG sources get heavy fast) */
export const srcSet = (src: string, max = 2500) =>
  WIDTHS.filter((w) => w <= max)
    .map((w) => `${cdn(src, w)} ${w}w`)
    .join(", ");
