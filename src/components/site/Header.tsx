import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { SearchOverlay } from "./SearchOverlay";
import { cn } from "@/lib/utils";
import fosqaLogo from "@/assets/fosqa-logo.png.asset.json";

const nav = [
  { to: "/journal", label: "Journal" },
  { to: "/artists", label: "Artists" },
  { to: "/objects", label: "Objects" },
  { to: "/ambassadors", label: "Ambassadors" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const darkHero =
    pathname === "/" ||
    (pathname.startsWith("/journal/") && pathname.length > 9) ||
    (pathname.startsWith("/artists/") && pathname.length > 9);
  const invert = darkHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn = cn(
    "transition-colors",
    invert ? "text-cloud/75 hover:text-cloud" : "text-foreground/70 hover:text-foreground",
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/60"
            : "bg-transparent border-b border-transparent",
          invert && "text-cloud",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1600px] items-center justify-between px-6 transition-all duration-700 sm:px-10",
            scrolled ? "h-16" : "h-24",
          )}
        >
          <Link to="/" aria-label="Fosqa — homepage" className="block">
            <img
              src={fosqaLogo.url}
              alt="Fosqa"
              className={cn(
                "h-auto w-[104px] brightness-0 transition-[filter] duration-700 sm:w-[126px]",
                invert && "invert",
              )}
            />
          </Link>

          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              aria-label="Open shopping bag"
              onClick={() => setCartOpen(true)}
              className={cn("relative", iconBtn)}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rothko px-1 text-[10px] font-medium text-cloud tabular-nums">
                  {count}
                </span>
              )}
            </button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <button
                aria-label="Menu"
                onClick={() => setMenuOpen(true)}
                className={iconBtn}
              >
                <Menu className="h-5 w-5" />
              </button>
              <SheetContent
                side="right"
                className="flex h-full w-full flex-col border-l-0 bg-shadow p-0 text-cloud sm:max-w-md"
              >
                <SheetTitle className="sr-only">Main menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate the Fosqa journal, artists, objects and about pages.
                </SheetDescription>

                <div className="flex flex-1 flex-col justify-between px-8 py-12 sm:px-12">
                  <nav aria-label="Primary">
                    <ul className="space-y-2">
                      {nav.map((item, i) => (
                        <li
                          key={item.to}
                          className="translate-x-8 opacity-0 animate-[fosqa-menu-in_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                          style={{ animationDelay: `${120 + i * 70}ms` }}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="group display block py-2 text-5xl tracking-[-0.04em] text-cloud transition-colors hover:text-picasso sm:text-6xl"
                            activeProps={{ className: "text-picasso" }}
                          >
                            <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div
                    className="translate-y-4 opacity-0 animate-[fosqa-menu-in_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    style={{ animationDelay: "480ms" }}
                  >
                    <p className="eyebrow mb-4 text-fosqa-gray">Where light follows art</p>
                    <p className="max-w-xs text-sm leading-relaxed text-fosqa-gray">
                      An editorial exploration of light, shadow and form — told through the objects and artists who shape them.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
