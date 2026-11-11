import { Yogi } from "@/characters/Yogi";
import { Divider } from "@/components/Divider";
import { Img } from "@/components/Img";
import { LabelLink } from "@/components/Label";
import { SplitWords } from "@/components/SplitWords";
import { EVENT } from "@/data/content";

/**
 * 04 — Mat & Matcha. Photo on the left, the event on the right, and a yogi
 * trying to keep a coffee level while you move the cursor.
 */
export function EventFrame() {
  return (
    <div className="px-gutter pt-nav flex h-full min-h-[540px] flex-col pb-5 md:pb-7">
      <div className="grid-24 min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-y-4 pt-1 md:grid-rows-1">
        <div data-reveal="clip-right" className="relative col-span-24 min-h-[180px] overflow-hidden md:col-span-12">
          <div data-media className="absolute inset-0">
            {/* PNG source: capped at 500w, anything larger is 1–2 MB */}
            <Img photo={EVENT.photo} max={500} sizes="(min-width: 768px) 34vw, 60vw" className="h-full w-full" />
          </div>
        </div>

        <div className="col-span-24 flex flex-col md:col-span-10 md:col-start-14">
          <p data-reveal="left" className="t-h4">
            {EVENT.kicker}
            <br />
            {EVENT.date}
          </p>
          <h2 className="t-h1 mt-3 md:mt-[7.5vh]">
            <SplitWords text={EVENT.title} />
          </h2>
          <p data-reveal="left" className="t-body mt-2 max-w-[25rem] md:mt-3">
            {EVENT.body}
          </p>

          <div className="mt-3 flex items-end justify-between gap-4 md:flex-1 md:flex-col md:items-stretch">
            <div data-reveal="left">
              <LabelLink href={EVENT.cta.href}>{EVENT.cta.label}</LabelLink>
            </div>
            <div data-reveal="zoom" className="shrink-0 md:mt-auto md:self-end">
              <Yogi className="h-auto w-[150px] text-flora md:w-[clamp(200px,27vw,410px)]" />
            </div>
          </div>
        </div>
      </div>

      <Divider className="mt-4 hidden shrink-0 md:block" />
    </div>
  );
}
