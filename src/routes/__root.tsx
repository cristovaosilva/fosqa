import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/useCartSync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-shadow px-4 text-cloud">
      <div className="max-w-md text-center">
        <h1 className="display text-8xl">404</h1>
        <p className="mt-4 text-sm text-fosqa-gray">
          This light has been switched off, or it never existed.
        </p>
        <Link to="/" className="link-draw eyebrow mt-8 inline-block">
          Back to the journal
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-shadow px-4 text-cloud">
      <div className="max-w-md text-center">
        <h1 className="display text-4xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-fosqa-gray">Try again, or head back to the homepage.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="eyebrow border border-white/25 px-5 py-3 hover:bg-cloud hover:text-shadow"
          >
            Try again
          </button>
          <a href="/" className="eyebrow border border-white/25 px-5 py-3 hover:bg-cloud hover:text-shadow">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fosqa — Where Light Follows Art" },
      {
        name: "description",
        content:
          "Fosqa is an editorial publication and catalogue of sculptural lighting objects made with artists, craftsmen and ambassadors.",
      },
      { name: "author", content: "Fosqa" },
      { property: "og:title", content: "Fosqa — Where Light Follows Art" },
      {
        property: "og:description",
        content: "An editorial publication and catalogue of sculptural lighting objects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter+Tight:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteChrome() {
  useCartSync();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Newsletter />
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome />
    </QueryClientProvider>
  );
}
