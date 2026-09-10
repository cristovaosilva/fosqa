import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { artists } from "@/data/content";
import { FilterBar } from "@/components/site/FilterBar";

const ROLES = ["All", "Designers", "Craftsmen", "Ambassadors"] as const;

export const Route = createFileRoute("/artists/")({
  head: () => ({
    meta: [
      { title: "Artists & Ambassadors — Fosqa" },
      {
        name: "description",
        content:
          "The designers, craftsmen and ambassadors who shape Fosqa objects, portrayed in high-contrast black and white.",
      },
      { property: "og:title", content: "Artists & Ambassadors — Fosqa" },
      {
        property: "og:description",
        content: "The designers, craftsmen and ambassadors behind every Fosqa object.",
      },
    ],
  }),
  component: ArtistsIndex,
});

function ArtistsIndex() {
  const [role, setRole] = useState<string>("All");
  const filtered = useMemo(
    () => artists.filter((a) => role === "All" || a.role === role),
    [role],
  );

  return (
    <section className="bg-shadow px-6 pb-28 pt-40 text-cloud sm:px-10">
      <div className="mx-auto max-w-[1600px]">
        <p className="eyebrow text-fosqa-gray">Artists & Ambassadors</p>
        <h1 className="display mt-6 max-w-4xl text-[13vw] leading-[0.85] sm:text-[7vw]">
          The hands behind the glow
        </h1>
        <FilterBar options={ROLES} value={role} onChange={setRole} dark className="mt-12" />

        <div className="mt-20 grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artist) => (
            <Link
              key={artist.slug}
              to="/artists/$slug"
              params={{ slug: artist.slug }}
              className="group"
            >
              <div className="relative aspect-3/4">
                {/* Signature work revealed behind the portrait on hover */}
                <img
                  src={artist.work}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="poetic-blur absolute inset-0 h-full w-full scale-95 object-cover opacity-0 transition-all duration-[900ms] group-hover:scale-110 group-hover:opacity-70"
                />
                <div className="media-frame grain lowkey relative h-full w-full bg-black">
                  <img
                    src={artist.portrait}
                    alt={artist.name}
                    loading="lazy"
                    className="h-full w-full object-cover contrast-110 transition-opacity duration-700 group-hover:opacity-70"
                  />
                </div>
              </div>
              <p className="eyebrow mt-5 text-fosqa-gray">{artist.role}</p>
              <h2 className="display mt-2 text-3xl">{artist.name}</h2>
              <p className="mt-2 text-sm text-fosqa-gray">
                {artist.discipline} — {artist.city}
              </p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-24 text-sm text-fosqa-gray">No one listed in this group yet.</p>
        )}
      </div>
    </section>
  );
}
