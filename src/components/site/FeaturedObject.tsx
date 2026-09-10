import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { objectMeta, getArtist } from "@/data/content";
import { objectImage } from "./ObjectCard";
import { cn } from "@/lib/utils";

export function FeaturedObject({
  product,
  onQuickBuy,
  dark = false,
  className,
}: {
  product: ShopifyProduct;
  onQuickBuy: (p: ShopifyProduct) => void;
  dark?: boolean;
  className?: string;
}) {
  const node = product.node;
  const artist = getArtist(objectMeta[node.handle]?.artistSlug);
  const price = node.priceRange.minVariantPrice;

  return (
    <aside
      className={cn(
        "group flex flex-col justify-between border p-6",
        dark ? "border-white/15 text-cloud" : "border-foreground/15",
        className,
      )}
    >
      <div>
        <p className={cn("eyebrow", dark ? "text-picasso" : "text-rothko")}>Featured object</p>
        <Link
          to="/objects/$handle"
          params={{ handle: node.handle }}
          className="media-frame grain lowkey mt-5 block aspect-square bg-black"
        >
          <img
            src={objectImage(product)}
            alt={node.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Link>
        <h4 className="display mt-5 text-2xl">{node.title}</h4>
        {artist && (
          <p className={cn("mt-1 text-xs", dark ? "text-fosqa-gray" : "text-muted-foreground")}>
            {artist.name}
          </p>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="display text-lg tabular-nums">
          {formatMoney(price.amount, price.currencyCode)}
        </span>
        <button
          onClick={() => onQuickBuy(product)}
          className={cn(
            "eyebrow flex items-center gap-2 border px-4 py-3 transition-colors",
            dark
              ? "border-white/25 hover:bg-cloud hover:text-shadow"
              : "border-foreground/25 hover:bg-foreground hover:text-background",
          )}
        >
          Quick buy
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
