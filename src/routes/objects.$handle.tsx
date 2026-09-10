import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { productQueryOptions, formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { objectMeta, getArtist, getStory, fallbackObjectImages } from "@/data/content";

export const Route = createFileRoute("/objects/$handle")({
  head: ({ params }) => {
    const title = params.handle
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Fosqa Objects` },
        {
          name: "description",
          content: `${title}: a sculptural lighting object from the Fosqa catalogue, made with the artist who designed it.`,
        },
        { property: "og:title", content: `${title} — Fosqa Objects` },
        {
          property: "og:description",
          content: "A sculptural lighting object from the Fosqa catalogue.",
        },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ObjectPage,
});

function ObjectPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQueryOptions(handle));
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const [variantIndex, setVariantIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="editorial text-4xl">This object isn't in the catalogue</h1>
        <Link to="/objects" className="link-draw eyebrow">
          Back to all objects
        </Link>
      </div>
    );
  }

  const node = product.node;
  const meta = objectMeta[handle];
  const artist = getArtist(meta?.artistSlug);
  const story = meta?.storySlug ? getStory(meta.storySlug) : undefined;
  const variants = node.variants.edges.map((e) => e.node);
  const variant = variants[Math.min(variantIndex, variants.length - 1)];
  const image = node.images.edges[0]?.node.url ?? meta?.image ?? fallbackObjectImages[0];

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success(`${node.title} added to your bag`, { position: "top-center" });
    setCartOpen(true);
  };

  return (
    <>
      <section className="grid lg:grid-cols-2">
        <div className="grain lowkey min-h-[60vh] bg-black lg:min-h-screen">
          <img src={image} alt={node.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center px-6 py-24 sm:px-14">
          {artist && (
            <Link
              to="/artists/$slug"
              params={{ slug: artist.slug }}
              className="link-draw eyebrow w-fit text-muted-foreground"
            >
              {artist.name} — {artist.city}
            </Link>
          )}
          <h1 className="display mt-6 text-[12vw] leading-[0.88] sm:text-6xl">{node.title}</h1>
          <p className="display mt-6 text-2xl tabular-nums">
            {variant && formatMoney(variant.price.amount, variant.price.currencyCode)}
          </p>
          <p className="mt-8 max-w-lg text-sm leading-[1.85] text-muted-foreground">
            {node.description || "A Fosqa object."}
          </p>

          {variants.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVariantIndex(i)}
                  className={
                    "eyebrow border px-4 py-3 transition-colors " +
                    (i === variantIndex
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground")
                  }
                >
                  {v.title}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            className="group mt-10 flex w-full max-w-md items-center justify-between bg-foreground px-6 py-5 text-background transition-colors hover:bg-rothko disabled:opacity-50"
          >
            <span className="eyebrow">
              {variant?.availableForSale ? "Add to bag" : "Sold out"}
            </span>
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            )}
          </button>

          <dl className="mt-14 space-y-4 border-t border-border pt-8 text-sm">
            {meta?.collection && (
              <div className="flex justify-between gap-6">
                <dt className="eyebrow text-muted-foreground">Collection</dt>
                <dd>{meta.collection}</dd>
              </div>
            )}
            {meta?.category && (
              <div className="flex justify-between gap-6">
                <dt className="eyebrow text-muted-foreground">Type</dt>
                <dd>{meta.category} light</dd>
              </div>
            )}
            {story && (
              <div className="flex justify-between gap-6">
                <dt className="eyebrow text-muted-foreground">First seen in</dt>
                <dd>
                  <Link
                    to="/journal/$slug"
                    params={{ slug: story.slug }}
                    className="link-draw text-right"
                  >
                    {story.title}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20 sm:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6">
          <p className="editorial text-3xl sm:text-4xl">More from the catalogue</p>
          <Link
            to="/objects"
            className="eyebrow border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-background"
          >
            All objects
          </Link>
        </div>
      </section>
    </>
  );
}
