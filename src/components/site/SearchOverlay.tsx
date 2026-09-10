import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { artists, stories } from "@/data/content";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { stories: stories.slice(0, 3), artists: artists.slice(0, 3) };
    return {
      stories: stories.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.standfirst.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      ),
      artists: artists.filter(
        (a) => a.name.toLowerCase().includes(q) || a.discipline.toLowerCase().includes(q),
      ),
    };
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-shadow/97 text-cloud backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-4xl flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-fosqa-gray">Search Fosqa</span>
          <button aria-label="Close search" onClick={onClose} className="text-fosqa-gray hover:text-cloud">
            <X className="h-5 w-5" />
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stories, artists, light…"
          className="display mt-10 w-full border-b border-white/15 bg-transparent pb-6 text-4xl text-cloud outline-none placeholder:text-white/25 sm:text-6xl"
        />
        <div className="mt-10 grid flex-1 gap-10 overflow-y-auto sm:grid-cols-2">
          <div>
            <p className="eyebrow text-fosqa-gray">Journal</p>
            <ul className="mt-5 space-y-4">
              {results.stories.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/journal/$slug"
                    params={{ slug: s.slug }}
                    onClick={onClose}
                    className="link-draw display text-xl"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              {results.stories.length === 0 && (
                <li className="text-sm text-fosqa-gray">No stories found.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-fosqa-gray">Artists</p>
            <ul className="mt-5 space-y-4">
              {results.artists.map((a) => (
                <li key={a.slug}>
                  <Link
                    to="/artists/$slug"
                    params={{ slug: a.slug }}
                    onClick={onClose}
                    className="link-draw display text-xl"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
              {results.artists.length === 0 && (
                <li className="text-sm text-fosqa-gray">No artists found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
