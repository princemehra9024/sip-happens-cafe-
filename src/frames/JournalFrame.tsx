import { CafeTable } from "@/characters/CafeTable";
import { Img } from "@/components/Img";
import { LabelLink } from "@/components/Label";
import { SplitWords } from "@/components/SplitWords";
import { JOURNAL, POSTS } from "@/data/content";

type Post = (typeof POSTS)[number];

function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex min-h-0 flex-col">
      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        data-reveal="clip-up"
        className="group relative block min-h-[110px] flex-1 overflow-hidden md:max-h-[max(37vw,52vh)]"
      >
        <Img
          photo={post.photo}
          sizes="(min-width: 768px) 31vw, 46vw"
          max={1500}
          className="h-full w-full transition-transform duration-[1400ms] ease-flora group-hover:scale-[1.04]"
        />
      </a>

      <div data-reveal="up" className="mt-3 flex items-start justify-between gap-3">
        <h3 className="font-serif text-[1.12rem] italic leading-[1.05] tracking-[-0.01em] md:text-[1.25rem] lg:text-[1.5rem]">
          <a href={post.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-flora">
            {post.title}
          </a>
        </h3>
        <span className="t-h4 hidden shrink-0 pt-[3px] sm:block">{post.category}</span>
      </div>
      <p data-reveal="up" className="t-body mt-2 line-clamp-3 md:line-clamp-2">
        {post.excerpt}
      </p>
      <div data-reveal="up" className="mt-2">
        <LabelLink href={post.href}>Read more</LabelLink>
      </div>
    </article>
  );
}

/**
 * 06 — The Daily Pour. The journal, with a café table for two that you can
 * fidget with: scoot the chairs, tap the cups, tease the flower.
 */
export function JournalFrame() {
  return (
    <div className="px-gutter pt-nav flex h-full min-h-[560px] flex-col pb-6 md:pb-8">
      <div className="grid-24 min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-y-5 pt-3 md:grid-rows-1 md:pt-[2.6vh]">
        <div className="relative col-span-24 flex flex-col pr-[118px] md:col-span-6 md:pr-0">
          <h2 className="t-h3">
            <SplitWords text={JOURNAL.title} />
          </h2>
          <p data-reveal="up" className="t-body mt-2 line-clamp-5 md:mt-3 md:line-clamp-none">
            {JOURNAL.body}
          </p>
          <div data-reveal="up" className="mt-3 md:mt-4">
            <LabelLink href={JOURNAL.cta.href}>{JOURNAL.cta.label}</LabelLink>
          </div>
          <div
            data-reveal="zoom"
            className="absolute right-0 top-0 w-[108px] md:static md:mt-auto md:w-[clamp(160px,17vw,270px)] md:self-center"
          >
            <CafeTable className="h-auto w-full text-flora" />
          </div>
        </div>

        <div className="col-span-24 grid min-h-0 grid-cols-2 gap-x-4 md:col-span-16 md:col-start-9 md:gap-x-[2.7vw]">
          {POSTS.map((post) => (
            <PostCard key={post.href} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
