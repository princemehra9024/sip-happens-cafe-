/**
 * All copy and media for the site lives here.
 * Images are never bundled — they are plain CDN links, resized on demand
 * by the helpers in `lib/img.ts`.
 */

const CDN = "https://images.squarespace-cdn.com/content/v1/6a15e6486d12f2496c6ef78c";
export const SITE = "https://www.florawellnesscafe.com";

export interface Photo {
  src: string;
  alt: string;
  /** CSS object-position, when the default centre crop isn't right */
  position?: string;
}

/* ------------------------------------------------------------------ */
/*  Brand                                                              */
/* ------------------------------------------------------------------ */
export const BRAND = {
  name: "Snap Café",
  tagline: ["SIP HAPPENS!", "COFFEE • CONVERSATION • GOOD VIBES"],
  logo: `${CDN}/3fbf0ea5-c27a-42c7-be9e-eb0c701f03b5/Flora+Cafe+Logo.png`,
  submark: `${CDN}/1985ddf7-fede-4269-90d9-17f7c844f2d9/flora+cafe+Submark+A+-+Red+2.png`,
  announcement: "SIP HAPPENS! · COFFEE • CONVERSATION • GOOD VIBES",
} as const;

/* ------------------------------------------------------------------ */
/*  Frames (one scroll = one of these)                                 */
/* ------------------------------------------------------------------ */
export const FRAMES = [
  { id: "home", label: "Snap Café", blurb: "More than just your downtown café" },
  { id: "menu", label: "Menu", blurb: "Coffee, matcha & fall specials" },
  { id: "fridays", label: "Snap Fridays", blurb: "Fresh blooms, every Friday" },
  { id: "events", label: "Mat & Matcha", blurb: "Upcoming wellness event" },
  { id: "shop", label: "Café Goods", blurb: "Artisanal coffee & curated essentials" },
  { id: "journal", label: "The Daily Pour", blurb: "Stories from café life" },
  { id: "contact", label: "Visit", blurb: "Hours, location & newsletter" },
] as const;

export type FrameId = (typeof FRAMES)[number]["id"];
export const FRAME_IDS: readonly string[] = FRAMES.map((f) => f.id);
export const DARK_FRAMES: readonly string[] = ["contact"];

export interface NavItem {
  label: string;
  frame?: FrameId;
  href?: string;
}

export const NAV: NavItem[] = [
  { label: "Menu", frame: "menu" },
  { label: "About", frame: "home" },
  { label: "Events", frame: "events" },
  { label: "Shop", frame: "shop" },
  { label: "Blog", frame: "journal" },
];

/* ------------------------------------------------------------------ */
/*  01 — Home                                                          */
/* ------------------------------------------------------------------ */
export const HERO_SLIDES: Photo[] = [
  {
    src: `${CDN}/f61725a0-5d15-4595-908d-8ede35ecfa72/iced-latte-matcha-pour-flora-cafe-cups.jpg`,
    alt: "Two iced drinks in Flora Café cups — a caramel latte and a matcha being poured",
  },
  {
    src: `${CDN}/f0ea165d-3875-4cb2-b536-53ac5895e857/flora-cafe-galletto-vine-covered-patio.jpg`,
    alt: "Guests at tables on the vine-covered patio of Galletto Ristorante, home of Flora Café",
  },
  {
    src: `${CDN}/2417a466-1cce-44d7-b018-a8682c3d55d6/flora-cafe-cups-crosswalk-downtown-bw.jpg`,
    alt: "Flora Café cups carried across a downtown crosswalk, in black and white",
  },
  {
    src: `${CDN}/f9a77081-a059-4324-ae27-062b525d51c7/flora-cafe-pop-up-bar-modesto.jpg`,
    alt: "The Flora Café pop-up bar in Modesto",
  },
];

export const INTRO = {
  title: "More than just your\ndowntown café",
  body: "Flora Café is committed to reimagining your daily ritual through thoughtfully sourced ingredients, mindful preparation, and a welcoming space that inspires balance, connection and well-being.",
  cta: { label: "Discover Flora", href: `${SITE}/about` },
};

/* ------------------------------------------------------------------ */
/*  02 — Menu                                                          */
/* ------------------------------------------------------------------ */
export interface MenuItem {
  name: string;
  price: string;
  note?: string;
  /** How full the glass on the tray gets when this is hovered (0–1) */
  pour: number;
  /** Key into FALL_PHOTOS, for the seasonal drinks */
  photo?: number;
}
export interface MenuGroup {
  title: string;
  short: string;
  items: MenuItem[];
}

export const MENU_INTRO = {
  title: "Explore Our Menu",
  body: "Thoughtfully crafted coffee, ceremonial matcha, and seasonal drinks made with intentional ingredients that love you right back.",
};

export const FALL_PHOTOS: Photo[] = [
  {
    src: `${CDN}/1789091360010-WTSN24YGXQSOLMH9U5O9/flora-cafe-fall-drinks.jpg`,
    alt: "Flora Café's line-up of fall drinks",
  },
  {
    src: `${CDN}/1789091362461-07XHV7AV6FX0PZIK2IFM/flora-cafe-pumpkin-spice-latte.jpg`,
    alt: "Pumpkin spice latte",
  },
  {
    src: `${CDN}/1789091361133-2SG1S9IGYE6PAE5RKYLJ/flora-cafe-brown-sugar-matcha.jpg`,
    alt: "Brown sugar matcha",
  },
  {
    src: `${CDN}/1789091360003-B519GLC3FUR5OVFXPB5A/flora-cafe-apple-spice-chai.jpg`,
    alt: "Apple spice chai",
  },
  {
    src: `${CDN}/1789091361362-OZZ15L3T9LF7Y0EVT01C/flora-cafe-caramel-apple-soda-pop.jpg`,
    alt: "Apple crisp Olipop dirty soda resting on a vintage car door handle",
  },
];

export const MENU: MenuGroup[] = [
  {
    title: "Coffee",
    short: "Coffee",
    items: [
      { name: "Double espresso", price: "$2.75", pour: 0.28 },
      { name: "Americano", price: "$4.25", pour: 0.5 },
      { name: "Cortado", price: "$4.00", pour: 0.45 },
      { name: "Cappuccino", price: "$5.00", pour: 0.6 },
      { name: "Latte", price: "$6.75", pour: 0.82 },
      { name: "Mocha", price: "$7.25", pour: 0.88 },
      { name: "Cold brew", price: "$6.75", pour: 0.82 },
    ],
  },
  {
    title: "Milk Options",
    short: "Milk",
    items: [
      { name: "Pistachio milk or speciality oat and almond", price: "+$0.50", pour: 0.4 },
      { name: "Oat / almond / whole", note: "no extra charge", price: "+$0", pour: 0.3 },
      { name: "Coconut Whip", price: "+$0.75", pour: 0.5 },
      { name: "Tru Whip", price: "+$0.75", pour: 0.5 },
    ],
  },
  {
    title: "Tea",
    short: "Tea",
    items: [
      { name: "Chai", price: "$7.25", pour: 0.88 },
      {
        name: "Matcha",
        note: "Nami & matcha freak ceremonial grade matcha",
        price: "$7.50",
        pour: 0.92,
      },
      {
        name: "Syrups",
        note: "Vanilla, Caramel, Lavender, Strawberry, Cinnamon Roll, Banana Bread, Pistachio",
        price: "+$0.75",
        pour: 0.36,
      },
    ],
  },
  {
    title: "Fall Specials",
    short: "Fall",
    items: [
      { name: "Pumpkin Spice Latte", price: "$8.25", pour: 1, photo: 1 },
      { name: "Brown Sugar Matcha", price: "$8.25", pour: 1, photo: 2 },
      { name: "Apple Spice Chai", price: "$8.00", pour: 0.96, photo: 3 },
      { name: "Apple Crisp Olipop Dirty Soda", price: "$7.00", pour: 0.85, photo: 4 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  03 — Flora Fridays                                                 */
/* ------------------------------------------------------------------ */
export const FRIDAYS = {
  title: "Flora Fridays",
  kicker: "Fresh blooms, fresh rituals, every Friday",
  body: "Every Friday at Flora means flower drop day — a weekly ritual filled with fresh seasonal blooms, cozy café moments, and little reminders to slow down and romanticize your routine. Stop by for your favorite drink, pick up a bouquet, and ease into the weekend with us.",
  photo: {
    src: `${CDN}/d225dcf6-2f56-42ac-a129-20faa4dfaae9/flora-flora-cafe-cups-flower-bouquet.jpg`,
    alt: "Two Flora Café to-go cups in a carrier beside a bouquet of pink and red flowers",
    position: "50% 55%",
  } as Photo,
};

/* ------------------------------------------------------------------ */
/*  04 — Mat & Matcha                                                  */
/* ------------------------------------------------------------------ */
export const EVENT = {
  kicker: "Upcoming event",
  date: "2026.09.13 Sunday",
  title: "Mat & Matcha",
  body: "Movement, matcha & meaningful connections on the patio. Mat & Matcha brings together pilates & your favorite flora matcha for the perfect wellness morning.",
  cta: { label: "View Events", href: `${SITE}/events` },
  photo: {
    src: `${CDN}/cbd59208-21af-4d3c-9161-dc504329d269/flora-cafe-mat-matcha-3.png`,
    alt: "A pilates class resting on mats across the café patio, with a hand-drawn meditating figure sketched over the photo",
    position: "50% 30%",
  } as Photo,
};

/* ------------------------------------------------------------------ */
/*  05 — Merch                                                         */
/* ------------------------------------------------------------------ */
export interface Product {
  id: string;
  title: string;
  price: number;
  was?: number;
  soldOut: boolean;
  variant?: string;
  excerpt: string;
  href: string;
  photo: Photo;
}

export const MERCH = {
  title: "Café Goods",
  cta: { label: "Shop All", href: `${SITE}/shop` },
};

export const PRODUCTS: Product[] = [
  {
    id: "house-blend-coffee",
    title: "Signature House Blend",
    price: 18,
    was: 22,
    soldOut: false,
    variant: "12 oz · Whole Bean",
    excerpt: "Ethically sourced washed beans roasted in small batches. Rich tasting notes of chocolate ganache, toasted hazelnut, and golden caramel.",
    href: `${SITE}/shop/p/house-blend-coffee`,
    photo: {
      src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
      alt: "Bag of artisanal whole bean specialty coffee",
    },
  },
  {
    id: "artisan-ceramic-mug",
    title: "Artisan Ceramic Mug",
    price: 28,
    was: 34,
    soldOut: false,
    variant: "Warm Sand Glaze · 12 oz",
    excerpt: "Wheel-thrown speckled stoneware finished with our signature matte ivory and warm sand glaze. Built with an ergonomic thumb rest.",
    href: `${SITE}/shop/p/artisan-ceramic-mug`,
    photo: {
      src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
      alt: "Handcrafted ceramic mug with warm latte",
    },
  },
  {
    id: "ceremonial-matcha-tin",
    title: "Ceremonial Uji Matcha",
    price: 32,
    was: 38,
    soldOut: false,
    variant: "30g Tin · First Harvest",
    excerpt: "Single-estate shade-grown tencha stone-ground in Uji, Kyoto. Vibrant emerald green with smooth, naturally sweet umami notes.",
    href: `${SITE}/shop/p/ceremonial-matcha-tin`,
    photo: {
      src: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a",
      alt: "Ceremonial matcha powder and traditional bowl",
    },
  },
  {
    id: "fluted-latte-glass",
    title: "Fluted Iced Latte Glasses",
    price: 24,
    soldOut: false,
    variant: "Set of 2 · 16 oz",
    excerpt: "Ribbed borosilicate glass tumblers with glass straws, designed for layered iced matchas, dirty sodas, and cold brews.",
    href: `${SITE}/shop/p/fluted-latte-glass`,
    photo: {
      src: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38",
      alt: "Ribbed glass iced coffee tumbler with glass straw",
    },
  },
  {
    id: "charcoal-travel-tumbler",
    title: "Matte Charcoal Tumbler",
    price: 36,
    soldOut: false,
    variant: "16 oz · Stainless Steel",
    excerpt: "Double-walled vacuum insulated travel tumbler in minimalist dark charcoal. Keeps your brew hot for 12 hours or iced for 24.",
    href: `${SITE}/shop/p/charcoal-travel-tumbler`,
    photo: {
      src: "https://images.unsplash.com/photo-1544816155-12df9643f363",
      alt: "Minimalist matte charcoal travel coffee tumbler",
    },
  },
  {
    id: "bamboo-matcha-whisk",
    title: "Bamboo Chasen Whisk",
    price: 22,
    soldOut: true,
    variant: "100-Prong Bamboo",
    excerpt: "Hand-carved from seasoned golden bamboo. Features 100 delicate curved tines to whip up a rich, velvety micro-foam.",
    href: `${SITE}/shop/p/bamboo-matcha-whisk`,
    photo: {
      src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3",
      alt: "Traditional bamboo matcha whisk with matcha bowl",
    },
  },
  {
    id: "cold-brew-growler",
    title: "Amber Cold Brew Growler",
    price: 26,
    was: 30,
    soldOut: false,
    variant: "32 oz · Amber Glass",
    excerpt: "UV-shielding amber glass bottle with airtight swing-top cap. Bring it into the café anytime for your weekly cold brew refill.",
    href: `${SITE}/shop/p/cold-brew-growler`,
    photo: {
      src: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5",
      alt: "Amber glass bottle for cold brew coffee",
    },
  },
  {
    id: "bourbon-vanilla-syrup",
    title: "Bourbon Vanilla Bean Syrup",
    price: 16,
    soldOut: false,
    variant: "250 ml · Small Batch",
    excerpt: "Handcrafted in-house using whole Madagascar bourbon vanilla beans and raw organic cane sugar. No artificial flavorings.",
    href: `${SITE}/shop/p/bourbon-vanilla-syrup`,
    photo: {
      src: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
      alt: "Artisanal glass bottle of handcrafted vanilla bean syrup",
    },
  },
];

export const money = (n: number) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/*  06 — The Daily Pour                                                */
/* ------------------------------------------------------------------ */
export const JOURNAL = {
  title: "The Daily Pour",
  body: "Explore behind-the-scenes stories from café life, wellness tips & tricks, seasonal drink inspirations, and thoughtful reflections from the Flora community. Consider this your cozy corner of the internet — made to inspire balance, connection, and everyday rituals that feel good.",
  cta: { label: "Go to Blog", href: `${SITE}/blog` },
};

export const POSTS = [
  {
    title: "A Gentle Reset: Finding Your Fall Rhythm",
    category: "Wellness",
    excerpt:
      "There is something about fall that makes me want to return to the little things that help me feel like myself.",
    href: `${SITE}/blog/a-gentle-reset-finding-your-fall-rhythm`,
    photo: {
      src: `${CDN}/1792462455898-JBU59LZJ0MKHZBA381GW/woman-sipping-coffee-sunlit-patio-flora-cafe.jpg`,
      alt: "A woman sipping coffee on the sunlit patio",
      position: "50% 30%",
    } as Photo,
  },
  {
    title: "Wellness in Every Sip",
    category: "Wellness",
    excerpt:
      "At Flora, every drink begins with intention. Wellness is a huge part of my life, and I want to share that with my community through…",
    href: `${SITE}/blog/wellness-in-every-sip`,
    photo: {
      src: `${CDN}/1788906494241-TSTU453FA25W58OXVCJP/flora-cafe-hand-whisked-ceremonial-grade-matcha.jpg`,
      alt: "Ceremonial grade matcha being whisked by hand",
      position: "50% 50%",
    } as Photo,
  },
];

/* ------------------------------------------------------------------ */
/*  07 — Visit / footer                                                */
/* ------------------------------------------------------------------ */
export const FOOTER = {
  newsletter: "Join our mailing list and be in the know about the latest events and creations.",
  thanks: "Thank you! °❀⋆.ೃ࿔*⋆.˚☕︎",
  signoff: "SIP HAPPENS!\nCoffee • Conversation • Good Vibes",
  contact: [
    "Outdoor Patio of Galletto Ristorante",
    "Mon-Fri 7am-3pm, Sat & Sun 7am-1pm",
    "1101 J St, Modesto, California 95354",
  ],
  email: "floracafemodesto@gmail.com",
  social: [] as { label: string; href: string }[],
  sitemap: [
    { label: "Home", frame: "home" },
    { label: "Menu", frame: "menu" },
    { label: "About", frame: "home" },
    { label: "Events", frame: "events" },
    { label: "Shop", frame: "shop" },
    { label: "Blog", frame: "journal" },
  ] as { label: string; frame: FrameId }[],
  legal: {
    copyright: "Copyright Flora Café 2026",
    privacy: { label: "Terms & Privacy", href: `${SITE}/privacy-policy` },
    credit: { label: "Hello-World", href: "https://www.hello-world.studio/" },
  },
};
