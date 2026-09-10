import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type ShopifyProduct } from "@/lib/shopify";
import { artists, objectMeta } from "@/data/content";
import { ObjectCard } from "@/components/site/ObjectCard";
import { QuickBuy } from "@/components/site/QuickBuy";
import { FilterBar } from "@/components/site/FilterBar";

export const Route = createFileRoute("/objects/")({
  head: () => ({
    meta: [
      { title: "Objects — Fosqa Catalogue" },
      {
        name: "description",
        content:
          "Sculptural lighting objects presented as gallery pieces: pendant, floor, table and wall works by Fosqa artists.",
      },
      { property: "og:title", content: "Objects — Fosqa Catalogue" },
      {
        property: "og:description",
        content: "Sculptural lighting objects presented as gallery pieces.",
      },
    ],
  }),
  component: ObjectsIndex,
});

function ObjectsIndex() {
  const [artistFilter, setArtistFilter] = useState("All artists");
  const [categoryFilter, setCategoryFilter] = useState("All light");
  const [collectionFilter, setCollectionFilter] = useState("All collections");
  const [quickBuy, setQuickBuy] = useState<ShopifyProduct | null>(null);

  const { data: products = [], isLoading } = useQuery(productsQueryOptions);

  const artistOptions = ["All artists", ...artists.map((a) => a.name)];
  const categoryOptions = [
    "All light",
    ...Array.from(new Set(Object.values(objectMeta).map((m) => m.category))),
  ];
  const collectionOptions = [
    "All collections",
    ...Array.from(new Set(Object.values(objectMeta).map((m) => m.collection))),
  ];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const meta = objectMeta[p.node.handle];
      const artistName = artists.find((a) => a.slug === meta?.artistSlug)?.name;
      if (artistFilter !== "All artists" && artistName !== artistFilter) return false;
      if (categoryFilter !== "All light" && meta?.category !== categoryFilter) return false;
      if (collectionFilter !== "All collections" && meta?.collection !== collectionFilter)
        return false;
      return true;
    });
  }, [products, artistFilter, categoryFilter, collectionFilter]);

  return (
    <>
      <section className="px-6 pb-12 pt-40 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="eyebrow text-muted-foreground">Objects</p>
          <h1 className="display mt-6 max-w-4xl text-[13vw] leading-[0.85] sm:text-[7vw]">
            A gallery, not a shelf
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Each piece is photographed as it lives: one source, one direction, deep shadow. Every
            object links back to the story that introduced it.
          </p>

          <div className="mt-14 space-y-4 border-t border-border pt-10">
            <FilterBar options={artistOptions} value={artistFilter} onChange={setArtistFilter} />
            <FilterBar
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
            <FilterBar
              options={collectionOptions}
              value={collectionFilter}
              onChange={setCollectionFilter}
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-32 sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          {isLoading ? (
            <p className="py-24 text-sm text-muted-foreground">Loading objects…</p>
          ) : filtered.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No products found</p>
          ) : (
            <div className="grid gap-x-12 gap-y-24 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <div key={product.node.id} className={i % 3 === 1 ? "lg:pt-24" : undefined}>
                  <ObjectCard
                    product={product}
                    index={i}
                    onQuickBuy={setQuickBuy}
                    tall={i % 3 === 1}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <QuickBuy product={quickBuy} open={!!quickBuy} onOpenChange={(v) => !v && setQuickBuy(null)} />
    </>
  );
}
