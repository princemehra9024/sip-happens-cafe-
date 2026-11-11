import type { MouseEventHandler, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const tap = { scale: 0.94 };

/** The site's small red "label" call-to-action, as a link */
export function LabelLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const external = /^https?:/.test(href);
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileTap={tap}
      className={cn("label-btn t-btn", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}

/** …and as a button */
export function LabelButton({
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={tap}
      className={cn("label-btn t-btn", className)}
    >
      {children}
    </motion.button>
  );
}
