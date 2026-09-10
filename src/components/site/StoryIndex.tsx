import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { formatDate, type Story } from "@/data/content";
import { cn } from "@/lib/utils";

/** Editorial index list: rows expand and show the story image on hover. */
export function StoryIndex({ stories, dark = false }: { stories: Story[]; dark?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className={cn("border-t border-border", dark && "text-cloud")}>
      {stories.map((story) => {
        const isActive = active === story.slug;
        return (
          <li key={story.slug} className="border-b border-border">
            <Link
              to="/journal/$slug"
              params={{ slug: story.slug }}
              onMouseEnter={() => setActive(story.slug)}
              onMouseLeave={() => setActive((s) => (s === story.slug ? null : s))}
              onFocus={() => setActive(story.slug)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[1fr_auto] items-center gap-6 py-7 sm:grid-cols-[minmax(0,1fr)_10rem_2rem]"
            >
              <div className="flex items-center gap-6">
                <span
                  className={cn(
                    "index-thumb grain lowkey hidden shrink-0 bg-black sm:block",
                    isActive && "is-open",
                  )}
                >
                  <img src={story.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </span>
                <span
                  className={cn(
                    "display text-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl",
                    isActive && "sm:translate-x-1",
                  )}
                >
                  {story.title}
                </span>
              </div>
              <span className="eyebrow hidden text-muted-foreground sm:block">
                {story.category} · {formatDate(story.date)}
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
