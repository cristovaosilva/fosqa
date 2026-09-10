import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type ShopifyProduct } from "@/lib/shopify";
import { artists, stories, type Story } from "@/data/content";
import { StoryCard } from "@/components/site/StoryCard";
import { FeaturedObject } from "@/components/site/FeaturedObject";
import { QuickBuy } from "@/components/site/QuickBuy";
import { FilterBar } from "@/components/site/FilterBar";
import { Marquee } from "@/components/site/Marquee";
import { StoryIndex } from "@/components/site/StoryIndex";
import { Reveal } from "@/components/site/Reveal";
import { HeroSlider } from "@/components/site/HeroSlider";

const FILTERS = ["All", "Lighting", "Stories", "Artists", "Ambassadors"] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fosqa — Where Light Follows Art" },
      {
        name: "description",
        content:
          "An editorial publication and catalogue of sculptural lighting objects, made with artists, craftsmen and ambassadors.",
      },
      { property: "og:title", content: "Fosqa — Where Light Follows Art" },
      {
        property: "og:description",
        content: "Stories about light, and the objects that make it.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [filter, setFilter] = useState<string>("All");
  const [quickBuy, setQuickBuy] = useState<ShopifyProduct | null>(null);
  const [hero, setHero] = useState<Story>(stories[0]!);
  const { data: products = [] } = useQuery(productsQueryOptions);

  const byHandle = useMemo(
    () => Object.fromEntries(products.map((p) => [p.node.handle, p])),
    [products],
  );

  const heroSlides = useMemo(() => stories.slice(0, 3), []);
  const feed = useMemo(
    () => stories.slice(3).filter((s) => filter === "All" || s.category === filter),
    [filter],
  );

  const heroObject = hero.featuredObject ? byHandle[hero.featuredObject] : undefined;
  const inlineObject = products[1] ?? products[0];

  return (
    <>
      {/* HERO SLIDER */}
      <section className="relative bg-shadow text-cloud">
        <HeroSlider slides={heroSlides} onActiveChange={(story) => setHero(story)} />

        {heroObject && (
          <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-16 sm:px-10">
            <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="eyebrow text-fosqa-gray">Inside this story</p>
                <p className="editorial mt-6 max-w-2xl text-4xl sm:text-5xl">
                  The object at the centre of the room — available directly from the article.
                </p>
              </div>
              <FeaturedObject product={heroObject} onQuickBuy={setQuickBuy} dark />
            </div>
          </div>
        )}
      </section>

      {/* TICKER */}
      <Marquee
        items={["Where light follows art", "Objects", "Artists", "Journal", "Made slowly"]}
        className="bg-cloud text-shadow"
      />

      {/* FILTER + FEED */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-border pb-8">
            <h2 className="editorial text-5xl sm:text-7xl">Our latest stories</h2>
            <FilterBar options={FILTERS} value={filter} onChange={setFilter} />
          </div>

          {feed.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">
              Nothing in this category yet.
            </p>
          ) : (
            <div className="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-12">
              {feed.map((story, i) => {
                const pattern = i % 4;
                const span =
                  pattern === 0
                    ? "md:col-span-7"
                    : pattern === 1
                      ? "md:col-span-5 md:pt-24"
                      : pattern === 2
                        ? "md:col-span-5"
                        : "md:col-span-7 md:pt-16";
                return (
                  <Reveal key={story.slug} className={span} delay={(i % 2) * 90}>
                    <StoryCard story={story} size={pattern % 3 === 0 ? "md" : "sm"} />
                  </Reveal>
                );
              })}

              {inlineObject && (
                <div className="md:col-span-5 md:col-start-8">
                  <FeaturedObject product={inlineObject} onQuickBuy={setQuickBuy} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* INDEX */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
              <h2 className="editorial text-5xl sm:text-7xl">Index</h2>
              <Link to="/journal" className="link-draw eyebrow text-muted-foreground">
                All stories
              </Link>
            </div>
            <StoryIndex stories={stories} />
          </Reveal>
        </div>
      </section>

      {/* ARTIST COLLABORATIONS */}
      <section className="band-klein px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="editorial text-5xl sm:text-7xl">Collaborations</h2>
            <Link to="/artists" className="link-draw eyebrow text-cloud/70 hover:text-cloud">
              All artists
            </Link>
          </div>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.slug}
                to="/artists/$slug"
                params={{ slug: artist.slug }}
                className="group"
              >
                <div className="media-frame grain lowkey aspect-3/4 bg-black">
                  <img
                    src={artist.portrait}
                    alt={artist.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="eyebrow mt-5 text-picasso">{artist.role}</p>
                <h3 className="editorial mt-2 text-4xl">{artist.name}</h3>
                <p className="mt-2 text-sm text-cloud/70">{artist.discipline} — {artist.city}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuickBuy product={quickBuy} open={!!quickBuy} onOpenChange={(v) => !v && setQuickBuy(null)} />
    </>
  );
}
