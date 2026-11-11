import { useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BackToTop } from "@/characters/BackToTop";
import { SplitWords } from "@/components/SplitWords";
import { BRAND, FOOTER } from "@/data/content";
import { useEngine, useFrame } from "@/engine/context";
import { cdn } from "@/lib/img";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setStatus(EMAIL.test(email.trim()) ? "done" : "error");
  };

  return (
    <div data-reveal="up" className="mt-3 max-w-[22rem]">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.p
            key="thanks"
            role="status"
            className="t-body py-[10px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {FOOTER.thanks}
          </motion.p>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center border-b border-cream/70 transition-colors focus-within:border-cream"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              className="t-h4 min-w-0 flex-1 bg-transparent py-[10px] text-[#F0EDE4] placeholder:text-[#F0EDE4]/60 focus:outline-none"
            />
            <button type="submit" className="t-btn link-line shrink-0 text-[#EACB83] hover:text-[#F0EDE4] transition-colors font-medium">
              Submit
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p id="newsletter-error" role="alert" className="t-note mt-2">
          Please enter a valid email address.
        </p>
      )}
    </div>
  );
}

/**
 * 07 — Visit. The brick-red closing page: newsletter, where and when to find
 * the café, and the figure who carries you back to the top.
 */
export function FooterFrame() {
  const { goTo } = useEngine();
  const { load } = useFrame();
  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    goTo(id);
  };
  const small = "font-serif text-[0.86rem] leading-[1.34] tracking-[-0.01em]";

  return (
    <div className="pt-nav flex h-full min-h-[600px] flex-col">
      <div className="px-gutter grid-24 shrink-0 gap-y-7 pt-3 md:pt-[2.6vh]">
        <div className="col-span-24 md:col-span-8 lg:col-span-6">
          <p data-reveal="up" className="t-body">
            {FOOTER.newsletter}
          </p>
          <Newsletter />
        </div>

        <div data-reveal="up" className="col-span-15 md:col-span-7 md:col-start-12 lg:col-span-6 lg:col-start-16">
          <h2 className="t-tiny mb-3">Contact</h2>
          <address className={`${small} not-italic`}>
            {FOOTER.contact.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href={`mailto:${FOOTER.email}`} className="link-line break-all">
              {FOOTER.email}
            </a>
          </address>
          {FOOTER.social.length > 0 && (
            <ul className={`${small} mt-3`}>
              {FOOTER.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav
          data-reveal="up"
          aria-label="Site map"
          className="col-span-8 col-start-17 md:col-span-3 md:col-start-22 lg:col-span-2 lg:col-start-23"
        >
          <h2 className="t-tiny mb-3">Site map</h2>
          <ul className={small}>
            {FOOTER.sitemap.map((item) => (
              <li key={item.label}>
                <a href={`#${item.frame}`} onClick={jump(item.frame)} className="link-line">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* the brand's own sign-off, set large (dropped on very short phones) */}
      <div className="px-gutter flex min-h-0 flex-1 items-center py-4 max-md:[@media(max-height:719px)]:hidden">
        <p className="t-h1 text-[clamp(2.3rem,min(7.4vw,13vh),7.5rem)] leading-[0.98]">
          <SplitWords text={FOOTER.signoff} />
        </p>
      </div>

      <div className="px-gutter mt-auto flex shrink-0 items-end justify-between pb-4 pt-2 md:pb-5">
        <div data-reveal="up">
          <BackToTop className="w-[112px] md:w-[clamp(120px,10.5vw,156px)]" />
        </div>
        {load && (
          <img
            data-reveal="zoom"
            src={cdn(BRAND.submark, 300)}
            alt="Snap Café monogram"
            width={248}
            height={249}
            decoding="async"
            className="mb-2 h-[58px] w-[58px] md:h-[clamp(60px,5.2vw,78px)] md:w-[clamp(60px,5.2vw,78px)] [filter:url(#ink-gold)]"
          />
        )}
      </div>

      <div className="shrink-0 bg-[#1A1C1E] text-[#D8C8AC] border-t border-[#35383C]">
        <p className="t-tiny px-gutter py-[9px] text-center">
          {FOOTER.legal.copyright} |{" "}
          <a href={FOOTER.legal.privacy.href} target="_blank" rel="noopener noreferrer" className="link-line hover:text-[#EACB83]">
            {FOOTER.legal.privacy.label}
          </a>
          , Site by{" "}
          <a href={FOOTER.legal.credit.href} target="_blank" rel="noopener noreferrer" className="link-line hover:text-[#EACB83]">
            {FOOTER.legal.credit.label}
          </a>
        </p>
      </div>
    </div>
  );
}
