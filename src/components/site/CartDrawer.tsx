import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, Loader2, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatMoney } from "@/lib/shopify";
import { objectMeta } from "@/data/content";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "EUR";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col border-l-0 bg-shadow p-0 text-cloud sm:max-w-md"
      >
        <SheetHeader className="space-y-1 border-b border-white/10 px-7 py-7 text-left">
          <SheetTitle className="display text-3xl text-cloud">Your bag</SheetTitle>
          <SheetDescription className="eyebrow text-fosqa-gray">
            {totalItems === 0
              ? "Nothing collected yet"
              : `${totalItems} object${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-10 text-center">
            <p className="text-sm leading-relaxed text-fosqa-gray">
              Objects arrive here from stories, artist pages and the catalogue.
            </p>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
              <ul className="space-y-7">
                {items.map((item) => {
                  const meta = objectMeta[item.product.node.handle];
                  const image = item.product.node.images?.edges?.[0]?.node?.url ?? meta?.image;
                  return (
                    <li key={item.variantId} className="flex gap-5">
                      <div className="grain h-24 w-20 shrink-0 overflow-hidden bg-white/5">
                        {image ? (
                          <img
                            src={image}
                            alt={item.product.node.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <p className="display text-lg leading-tight">{item.product.node.title}</p>
                          <p className="mt-1 text-xs text-fosqa-gray">
                            {item.selectedOptions.map((o) => o.value).join(" · ") ||
                              item.variantTitle}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-white/15 px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="text-fosqa-gray transition-colors hover:text-cloud"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="text-fosqa-gray transition-colors hover:text-cloud"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">
                            {formatMoney(
                              parseFloat(item.price.amount) * item.quantity,
                              item.price.currencyCode,
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        aria-label="Remove"
                        onClick={() => removeItem(item.variantId)}
                        className="self-start text-fosqa-gray transition-colors hover:text-rothko"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shrink-0 space-y-5 border-t border-white/10 px-7 py-7">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-fosqa-gray">Total</span>
                <span className="display text-2xl tabular-nums">
                  {formatMoney(totalPrice, currency)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="group flex w-full items-center justify-between bg-cloud px-6 py-5 text-shadow transition-colors hover:bg-picasso disabled:opacity-60"
              >
                <span className="eyebrow">Checkout</span>
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
              </button>
              <p className="text-[11px] leading-relaxed text-fosqa-gray">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
