import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type ShopifyProduct } from "@/lib/shopify";
import { getArtist, storiesForArtist } from "@/data/content";
import { ObjectCard } from "@/components/site/ObjectCard";
import { QuickBuy } from "@/components/site/QuickBuy";
import { StoryCard } from "@/components/site/StoryCard";

export const Route = createFileRoute("/artists/$slug")({
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Artist not found — Fosqa" }, { name: "robots", content: "noindex" }],
      };
    }
    const { artist } = loaderData;
    return {
      meta: [
        { title: `${artist.name} — Fosqa Artists` },
        { name: "description", content: `${artist.name}, ${artist.discipline} in ${artist.city}. ${artist.statement}` },
        { property: "og:title", content: `${artist.name} — Fosqa Artists` },
        { property: "og:description", content: artist.statement },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: ArtistPage,
});

function ArtistPage() {
  const { artist } = Route.useLoaderData();
  const [quickBuy, setQuickBuy] = useState<ShopifyProduct | null>(null);
  const { data: products = [] } = useQuery(productsQueryOptions);

  const works = products.filter((p) => artist.objects.includes(p.node.handle));
  const related = storiesForArtist(artist.slug);

  return (
    <>
      <section className="relative min-h-[92vh] bg-shadow text-cloud">
        <div className="absolute inset-0">
          <img
            src={artist.work}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-35 blur-2xl"
          />
        </div>
        <div className="relative z-2 mx-auto grid max-w-[1600px] gap-14 px-6 pb-24 pt-40 sm:px-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grain lowkey aspect-3/4 bg-black">
            <img
              src={artist.portrait}
              alt={artist.name}
              className="h-full w-full object-cover contrast-110"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="eyebrow text-fosqa-gray">
              {artist.role} · {artist.city}
            </p>
            <h1 className="display mt-6 text-[13vw] leading-[0.85] sm:text-[6vw]">{artist.name}</h1>
            <p className="display mt-10 max-w-xl text-2xl leading-tight text-picasso sm:text-3xl">
              “{artist.statement}”
            </p>
            <div className="mt-10 max-w-xl space-y-5">
              {artist.bio.map((p, i) => (
                <p key={i} className="text-sm leading-[1.85] text-fosqa-gray">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="editorial text-4xl sm:text-6xl">Artworks & co-creations</h2>
          {works.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              No objects found for this artist yet.
            </p>
          ) : (
            <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((product, i) => (
                <ObjectCard
                  key={product.node.id}
                  product={product}
                  index={i}
                  onQuickBuy={setQuickBuy}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-[1600px]">
            <h2 className="editorial text-4xl sm:text-6xl">Related editorial</h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {related.map((story) => (
                <StoryCard key={story.slug} story={story} size="sm" />
              ))}
            </div>
          </div>
        </section>
      )}

      <QuickBuy product={quickBuy} open={!!quickBuy} onOpenChange={(v) => !v && setQuickBuy(null)} />
    </>
  );
}
