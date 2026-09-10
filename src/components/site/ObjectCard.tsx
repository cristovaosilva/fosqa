import { Link } from "@tanstack/react-router";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { objectMeta, getArtist, getStory, fallbackObjectImages } from "@/data/content";

export function objectImage(product: ShopifyProduct, index = 0) {
  return (
    product.node.images.edges[0]?.node.url ??
    objectMeta[product.node.handle]?.image ??
    fallbackObjectImages[index % fallbackObjectImages.length]
  );
}

export function ObjectCard({
  product,
  index = 0,
  onQuickBuy,
  tall = false,
}: {
  product: ShopifyProduct;
  index?: number;
  onQuickBuy: (p: ShopifyProduct) => void;
  tall?: boolean;
}) {
  const node = product.node;
  const meta = objectMeta[node.handle];
  const artist = getArtist(meta?.artistSlug);
  const story = meta?.storySlug ? getStory(meta.storySlug) : undefined;
  const price = node.priceRange.minVariantPrice;

  return (
    <article className="group">
      <Link
        to="/objects/$handle"
        params={{ handle: node.handle }}
        className={
          "media-frame grain lowkey block bg-black " + (tall ? "aspect-2/3" : "aspect-4/5")
        }
      >
        <img
          src={objectImage(product, index)}
          alt={node.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          {artist && (
            <Link
              to="/artists/$slug"
              params={{ slug: artist.slug }}
              className="link-draw eyebrow text-muted-foreground"
            >
              {artist.name}
            </Link>
          )}
          <h3 className="display mt-2 text-2xl">
            <Link to="/objects/$handle" params={{ handle: node.handle }}>
              {node.title}
            </Link>
          </h3>
          {story && (
            <Link
              to="/journal/$slug"
              params={{ slug: story.slug }}
              className="link-draw mt-2 block text-xs text-muted-foreground"
            >
              Featured in “{story.title}”
            </Link>
          )}
        </div>
        <span className="display shrink-0 text-lg tabular-nums">
          {formatMoney(price.amount, price.currencyCode)}
        </span>
      </div>

      <button
        onClick={() => onQuickBuy(product)}
        className="eyebrow mt-4 w-full border border-foreground/20 py-3 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        Quick buy
      </button>
    </article>
  );
}
