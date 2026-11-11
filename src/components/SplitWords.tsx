import { cn } from "@/utils/cn";

/**
 * Headline whose words rise out of their own masks (reveal preset "words").
 * Use "\n" for intentional line breaks. Screen readers get the plain sentence.
 */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden data-reveal="words" className={cn("block", className)}>
        {text.split("\n").map((line, i) => (
          <span key={i} className="block">
            {line.split(" ").map((word, j) => (
              // padding leaves room for italic overhang + descenders inside the mask
              <span
                key={j}
                className="w -my-[0.16em] inline-block overflow-hidden py-[0.16em] pr-[0.27em] align-bottom"
              >
                <span className="inline-block will-change-transform">{word}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
