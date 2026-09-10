import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type ShopifyProduct } from "@/lib/shopify";
import { stories } from "@/data/content";
import { StoryCard } from "@/components/site/StoryCard";
import { FilterBar } from "@/components/site/FilterBar";
import { FeaturedObject } from "@/components/site/FeaturedObject";
import { QuickBuy } from "@/components/site/QuickBuy";

const CATEGORIES = ["All", "Lighting", "Stories", "Artists", "Ambassadors"] as const;

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — Fosqa" },
      {
        name: "description",
        content:
          "Essays, interviews and news about light, shadow and the makers behind every Fosqa object.",
      },
      { property: "og:title", content: "Journal — Fosqa" },
      {
        property: "og:description",
        content: "Essays, interviews and news about light, shadow and its makers.",
      },
    ],
  }),
  component: JournalIndex,
});

function JournalIndex() {
  const [category, setCategory] = useState<string>("All");
  const [quickBuy, setQuickBuy] = useState<ShopifyProduct | null>(null);
  const { data: products = [] } = useQuery(productsQueryOptions);

  const filtered = useMemo(
    () => stories.filter((s) => category === "All" || s.category === category),
    [category],
  );
  const [lead, ...rest] = filtered;

  return (
    <>
      <section className="px-6 pb-14 pt-40 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="eyebrow text-muted-foreground">Journal</p>
          <h1 className="display mt-6 text-[14vw] leading-[0.85] sm:text-[8vw]">
            Notes on light
          </h1>
          <FilterBar
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            className="mt-12"
          />
        </div>
      </section>

      <section className="px-6 pb-28 sm:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-[1fr_20rem]">
          <div>
            {lead ? (
              <>
                <StoryCard story={lead} size="lg" />
                <div className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2">
                  {rest.map((story) => (
                    <StoryCard key={story.slug} story={story} size="sm" />
                  ))}
                </div>
              </>
            ) : (
              <p className="py-24 text-sm text-muted-foreground">Nothing published here yet.</p>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow border-b border-border pb-4 text-muted-foreground">
              Curated in these stories
            </p>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No objects available yet.</p>
            ) : (
              products
                .slice(0, 2)
                .map((product) => (
                  <FeaturedObject
                    key={product.node.id}
                    product={product}
                    onQuickBuy={setQuickBuy}
                  />
                ))
            )}
          </aside>
        </div>
      </section>

      <QuickBuy product={quickBuy} open={!!quickBuy} onOpenChange={(v) => !v && setQuickBuy(null)} />
    </>
  );
}
