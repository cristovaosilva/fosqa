import heroLight from "@/assets/hero-light.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import object1 from "@/assets/object-1.jpg";
import object2 from "@/assets/object-2.jpg";
import object3 from "@/assets/object-3.jpg";
import object4 from "@/assets/object-4.jpg";

export type AccentKey = "matisse" | "picasso" | "rothko" | "klein";

export const accentClass: Record<AccentKey, string> = {
  matisse: "bg-matisse text-cloud",
  picasso: "bg-picasso text-shadow",
  rothko: "bg-rothko text-cloud",
  klein: "bg-klein text-cloud",
};

export const accentTextClass: Record<AccentKey, string> = {
  matisse: "text-matisse",
  picasso: "text-picasso",
  rothko: "text-rothko",
  klein: "text-klein",
};

export interface Artist {
  slug: string;
  name: string;
  role: "Designers" | "Craftsmen" | "Ambassadors";
  discipline: string;
  city: string;
  portrait: string;
  work: string;
  statement: string;
  bio: string[];
  accent: AccentKey;
  /** Shopify product handles co-created with this artist */
  objects: string[];
}

export interface Story {
  slug: string;
  title: string;
  standfirst: string;
  category: "Lighting" | "Stories" | "Artists" | "Ambassadors";
  author: string;
  artistSlug?: string;
  date: string;
  readTime: string;
  image: string;
  accent: AccentKey;
  /** Shopify handle of the object featured inside the article */
  featuredObject?: string;
  body: string[];
}

export const artists: Artist[] = [
  {
    slug: "mira-halden",
    name: "Mira Halden",
    role: "Designers",
    discipline: "Sculptural lighting",
    city: "Copenhagen",
    portrait: artist1,
    work: object1,
    statement: "Light is not a material. It is the consequence of one.",
    bio: [
      "Mira Halden works from a former printing hall in Nordvest, where the only daylight arrives through a single north-facing band of glass. She has spent nine years studying what that band of light does to alabaster.",
      "Her pieces are cut from single blocks, never laminated, so the veining decides where the glow gathers. Two lamps from the same quarry never behave the same way after dark.",
    ],
    accent: "picasso",
    objects: ["penumbra-pendant"],
  },
  {
    slug: "arno-vesel",
    name: "Arno Vesel",
    role: "Craftsmen",
    discipline: "Glass & metal",
    city: "Ljubljana",
    portrait: artist2,
    work: object2,
    statement: "I do not finish a piece. I stop when the shadow is right.",
    bio: [
      "Forty-one years at the furnace. Arno Vesel came to Fosqa through a shadow — a photograph of one, cast by a prototype he had abandoned in 1998.",
      "He works almost entirely by hand and refuses digital measurement, judging wall thickness by the sound a piece makes when tapped with a brass rod.",
    ],
    accent: "rothko",
    objects: ["eclipse-floor-light", "monolith-sconce"],
  },
  {
    slug: "isa-okonkwo",
    name: "Isa Okonkwo",
    role: "Ambassadors",
    discipline: "Ceramics & performance",
    city: "Lisbon",
    portrait: artist3,
    work: object3,
    statement: "Darkness is the frame. Everything else is the picture.",
    bio: [
      "Isa Okonkwo builds rooms before objects. Their installations begin with the removal of light and end with the return of a single source.",
      "As a Fosqa ambassador they curate the Shadow Rooms programme, an annual series of unlit exhibitions that open only at dusk.",
    ],
    accent: "klein",
    objects: ["grain-table-lamp"],
  },
];

export const stories: Story[] = [
  {
    slug: "where-light-follows-art",
    title: "Where light follows art",
    standfirst:
      "A manifesto in one room: what happens when the lamp stops being furniture and starts behaving like a sculpture that happens to glow.",
    category: "Stories",
    author: "Fosqa Editorial",
    date: "2026-08-28",
    readTime: "9 min",
    image: heroLight,
    accent: "picasso",
    featuredObject: "penumbra-pendant",
    body: [
      "There is a moment, roughly twenty minutes after sunset, when a room stops belonging to architecture and starts belonging to whatever is lit inside it. Fosqa was built around that twenty-minute window.",
      "We do not photograph our objects in daylight. We do not photograph them switched off. The work only exists in the relationship between a source and the surfaces it decides to touch — which is another way of saying that a Fosqa object is half made of the room you put it in.",
      "This issue follows four makers who understand that. A stonecutter in Copenhagen. A glassblower who trusts his ears over his instruments. A ceramicist who removes light before adding it. And a shadow that took twenty-eight years to be finished.",
    ],
  },
  {
    slug: "the-shadow-that-took-28-years",
    title: "The shadow that took twenty-eight years",
    standfirst:
      "Arno Vesel abandoned a prototype in 1998. A photograph of its shadow brought him back to the furnace.",
    category: "Artists",
    author: "Lena Fournier",
    artistSlug: "arno-vesel",
    date: "2026-08-12",
    readTime: "12 min",
    image: artist2,
    accent: "rothko",
    featuredObject: "eclipse-floor-light",
    body: [
      "The photograph was not of the lamp. It was of the wall behind it — a long, soft wedge of grey that Vesel says he had been chasing since his apprenticeship.",
      "He rebuilt the piece eleven times. The final version is a single column of brushed steel that throws almost nothing downward, so the light arrives at you second-hand, having already touched the ceiling.",
    ],
  },
  {
    slug: "cutting-the-glow-from-stone",
    title: "Cutting the glow out of stone",
    standfirst:
      "Mira Halden on alabaster, veining, and why two lamps from the same quarry will never agree with each other.",
    category: "Lighting",
    author: "Fosqa Editorial",
    artistSlug: "mira-halden",
    date: "2026-07-30",
    readTime: "7 min",
    image: object1,
    accent: "picasso",
    featuredObject: "penumbra-pendant",
    body: [
      "Alabaster is a translucent liar. Held to a window it looks uniform; lit from within it reveals every seam of its formation.",
      "Halden reads the block before cutting, mapping the veins that will become the brightest passages. The result is a lamp whose glow is asymmetric by geology rather than by design.",
    ],
  },
  {
    slug: "the-shadow-rooms",
    title: "The Shadow Rooms open at dusk",
    standfirst:
      "Isa Okonkwo's unlit exhibitions ask visitors to wait in the dark until their eyes agree to cooperate.",
    category: "Ambassadors",
    author: "Tomas Reis",
    artistSlug: "isa-okonkwo",
    date: "2026-07-04",
    readTime: "6 min",
    image: artist3,
    accent: "klein",
    featuredObject: "grain-table-lamp",
    body: [
      "Guests enter in complete darkness and are asked not to speak for four minutes. Only then does a single ceramic lamp come up, at roughly the brightness of a candle.",
      "Okonkwo calls it 'returning the eye to its own timing'. The programme has run in Lisbon, Athens and Rotterdam.",
    ],
  },
  {
    slug: "a-field-guide-to-low-key-light",
    title: "A field guide to low-key light",
    standfirst:
      "Five rules for lighting a room the way a photographer lights a face: one source, one direction, one decision.",
    category: "Lighting",
    author: "Fosqa Editorial",
    date: "2026-06-18",
    readTime: "5 min",
    image: object4,
    accent: "matisse",
    featuredObject: "monolith-sconce",
    body: [
      "Rule one: never light a room evenly. Evenness is the enemy of form.",
      "Rule two: put the source where you want the eye to arrive, then let everything else fall away.",
    ],
  },
  {
    slug: "news-fosqa-at-milan",
    title: "Fosqa takes a dark room to Milan",
    standfirst:
      "Our first public installation runs for nine evenings only, opening each night at the exact minute of sunset.",
    category: "Stories",
    author: "Fosqa Editorial",
    date: "2026-05-22",
    readTime: "3 min",
    image: object2,
    accent: "matisse",
    body: [
      "Nine evenings, one room, four objects. Entry is free and limited to twelve people at a time.",
      "The room contains no seating and no signage. Visitors are handed a printed card on the way out.",
    ],
  },
];

/** Editorial art direction and provenance for Shopify products, keyed by handle. */
export const objectMeta: Record<
  string,
  { image: string; artistSlug: string; storySlug: string; collection: string; category: string }
> = {
  "penumbra-pendant": {
    image: object1,
    artistSlug: "mira-halden",
    storySlug: "cutting-the-glow-from-stone",
    collection: "Penumbra",
    category: "Pendant",
  },
  "eclipse-floor-light": {
    image: object2,
    artistSlug: "arno-vesel",
    storySlug: "the-shadow-that-took-28-years",
    collection: "Eclipse",
    category: "Floor",
  },
  "grain-table-lamp": {
    image: object3,
    artistSlug: "isa-okonkwo",
    storySlug: "the-shadow-rooms",
    collection: "Grain",
    category: "Table",
  },
  "monolith-sconce": {
    image: object4,
    artistSlug: "arno-vesel",
    storySlug: "a-field-guide-to-low-key-light",
    collection: "Monolith",
    category: "Wall",
  },
};

export const fallbackObjectImages = [object1, object2, object3, object4];

export function getArtist(slug?: string) {
  return artists.find((a) => a.slug === slug);
}

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}

export function storiesForArtist(slug: string) {
  return stories.filter((s) => s.artistSlug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
