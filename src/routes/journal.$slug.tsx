import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type ShopifyProduct } from "@/lib/shopify";
import { getStory, getArtist, stories, formatDate, accentClass } from "@/data/content";
import { FeaturedObject } from "@/components/site/FeaturedObject";
import { QuickBuy } from "@/components/site/QuickBuy";
import { StoryCard } from "@/components/site/StoryCard";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Story not found — Fosqa" }, { name: "robots", content: "noindex" }],
      };
    }
    const { story } = loaderData;
    return {
      meta: [
        { title: `${story.title} — Fosqa Journal` },
        { name: "description", content: story.standfirst },
        { property: "og:title", content: `${story.title} — Fosqa Journal` },
        { property: "og:description", content: story.standfirst },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: StoryPage,
});

function StoryPage() {
  const { story } = Route.useLoaderData();
  const [quickBuy, setQuickBuy] = useState<ShopifyProduct | null>(null);
  const { data: products = [] } = useQuery(productsQueryOptions);
  const artist = getArtist(story.artistSlug);
  const featured = products.find((p) => p.node.handle === story.featuredObject);
  const more = stories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="bg-shadow px-6 pb-20 pt-36 text-cloud sm:px-10">
          <div className="mx-auto max-w-[1100px]">
            <span className={"eyebrow px-2.5 py-1 " + accentClass[story.accent]}>
              {story.category}
            </span>
            <h1 className="display mt-8 text-[11vw] leading-[0.88] sm:text-[5.5vw]">
              {story.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fosqa-gray">
              {story.standfirst}
            </p>
            <p className="eyebrow mt-10 text-fosqa-gray">
              {story.author} · {formatDate(story.date)} · {story.readTime}
            </p>
          </div>
        </header>

        <div className="grain lowkey relative h-[70vh] bg-black">
          <img
            src={story.image}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-[68ch]">
            {story.body.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-2xl leading-relaxed"
                    : "mt-8 text-base leading-[1.85] text-foreground/80"
                }
              >
                {paragraph}
              </p>
            ))}

            {artist && (
              <div className="mt-16 border-t border-border pt-10">
                <p className="eyebrow text-muted-foreground">Featured artist</p>
                <Link
                  to="/artists/$slug"
                  params={{ slug: artist.slug }}
                  className="link-draw display mt-4 inline-block text-3xl"
                >
                  {artist.name}
                </Link>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {artist.statement}
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {featured ? (
              <FeaturedObject product={featured} onQuickBuy={setQuickBuy} />
            ) : (
              <div className="border border-foreground/15 p-6">
                <p className="eyebrow text-rothko">Featured object</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  No object attached to this story yet.
                </p>
              </div>
            )}
          </aside>
        </div>
      </article>

      <section className="border-t border-border px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="editorial text-4xl sm:text-5xl">Keep reading</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {more.map((s) => (
              <StoryCard key={s.slug} story={s} size="sm" />
            ))}
          </div>
        </div>
      </section>

      <QuickBuy product={quickBuy} open={!!quickBuy} onOpenChange={(v) => !v && setQuickBuy(null)} />
    </>
  );
}
