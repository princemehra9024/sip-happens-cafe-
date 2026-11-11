import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/data/content";
import { useFrame } from "@/engine/context";
import { cdn, srcSet, thumb } from "@/lib/img";
import { cn } from "@/utils/cn";

interface Props {
  photo: Photo;
  /** How wide the image is drawn, so the browser can pick the smallest file */
  sizes: string;
  className?: string;
  /** Above-the-fold: fetch immediately at high priority */
  priority?: boolean;
  /** Largest CDN width to offer */
  max?: number;
  /** Keep waiting even though the frame is near (e.g. later slides) */
  hold?: boolean;
}

/**
 * Link-only responsive image.
 *  • nothing is requested until its frame is within one step of the screen
 *  • a ~2 KB blurred preview shows first, the right-sized file fades in over it
 */
export function Img({ photo, sizes, className, priority = false, max, hold = false }: Props) {
  const { load } = useFrame();
  const go = (priority || load) && !hold;

  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const [previewGone, setPreviewGone] = useState(false);

  // Cached images can finish before React attaches onLoad
  useEffect(() => {
    const el = ref.current;
    if (go && el?.complete && el.naturalWidth > 0) setReady(true);
  }, [go]);

  // Drop the blurred layer once it has faded so it costs nothing afterwards
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setPreviewGone(true), 900);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <div className={cn("relative overflow-hidden bg-cream-deep", className)}>
      {go && !previewGone && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 scale-110 bg-cover blur-xl transition-opacity duration-700",
            ready && "opacity-0",
          )}
          style={{
            backgroundImage: `url("${thumb(photo.src)}")`,
            backgroundPosition: photo.position ?? "50% 50%",
          }}
        />
      )}
      {go && (
        <img
          ref={ref}
          src={cdn(photo.src, Math.min(1000, max ?? 1000))}
          srcSet={srcSet(photo.src, max)}
          sizes={sizes}
          alt={photo.alt}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
          onLoad={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition: photo.position }}
        />
      )}
    </div>
  );
}
