import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { objectMeta, getArtist } from "@/data/content";

export function QuickBuy({
  product,
  open,
  onOpenChange,
}: {
  product: ShopifyProduct | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const [variantIndex, setVariantIndex] = useState(0);

  if (!product) return null;

  const node = product.node;
  const meta = objectMeta[node.handle];
  const artist = getArtist(meta?.artistSlug);
  const variants = node.variants.edges.map((e) => e.node);
  const variant = variants[Math.min(variantIndex, variants.length - 1)];
  const image = node.images.edges[0]?.node.url ?? meta?.image;

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
    onOpenChange(false);
    toast.success(`${node.title} added to your bag`, { position: "top-center" });
    setCartOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl gap-0 overflow-hidden border-0 bg-shadow p-0 text-cloud sm:rounded-none"
      >
        <div className="grid sm:grid-cols-2">
          <div className="grain lowkey aspect-4/5 bg-black">
            {image && (
              <img
                src={image}
                alt={node.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-between p-8">
            <div>
              {artist && <p className="eyebrow text-fosqa-gray">{artist.name}</p>}
              <DialogTitle className="display mt-3 text-4xl text-cloud">{node.title}</DialogTitle>
              <DialogDescription className="mt-4 line-clamp-5 text-sm leading-relaxed text-fosqa-gray">
                {node.description || "A Fosqa object."}
              </DialogDescription>

              {variants.length > 1 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantIndex(i)}
                      className={
                        "border px-3 py-2 text-xs transition-colors " +
                        (i === variantIndex
                          ? "border-cloud bg-cloud text-shadow"
                          : "border-white/20 text-fosqa-gray hover:border-cloud/60")
                      }
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <p className="display text-2xl tabular-nums">
                {variant && formatMoney(variant.price.amount, variant.price.currencyCode)}
              </p>
              <button
                onClick={handleAdd}
                disabled={isLoading || !variant?.availableForSale}
                className="group flex w-full items-center justify-between bg-cloud px-5 py-4 text-shadow transition-colors hover:bg-picasso disabled:opacity-50"
              >
                <span className="eyebrow">
                  {variant?.availableForSale ? "Add to bag" : "Sold out"}
                </span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
              </button>
              <Link
                to="/objects/$handle"
                params={{ handle: node.handle }}
                onClick={() => onOpenChange(false)}
                className="link-draw eyebrow block w-fit text-fosqa-gray hover:text-cloud"
              >
                Full object page
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
