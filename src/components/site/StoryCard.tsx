import { Link } from "@tanstack/react-router";
import { accentClass, accentTextClass, formatDate, type Story } from "@/data/content";
import { cn } from "@/lib/utils";

export function StoryCard({
  story,
  size = "md",
  dark = false,
}: {
  story: Story;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}) {
  const ratio = size === "lg" ? "aspect-16/10" : size === "sm" ? "aspect-4/3" : "aspect-3/2";

  return (
    <article className="group">
      <Link
        to="/journal/$slug"
        params={{ slug: story.slug }}
        className={cn("media-frame grain lowkey block bg-black", ratio)}
      >
        <img
          src={story.image}
          alt={story.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span
          className={cn(
            "eyebrow absolute left-4 top-4 z-2 px-2.5 py-1",
            accentClass[story.accent],
          )}
        >
          {story.category}
        </span>
      </Link>

      <div className={cn("mt-5", dark && "text-cloud")}>
        <p className={cn("eyebrow mb-2", accentTextClass[story.accent])}>{story.category}</p>
        <h3
          className={cn(
            "editorial",
            size === "lg" ? "text-4xl sm:text-6xl" : size === "sm" ? "text-2xl" : "text-4xl",
          )}
        >
          <Link to="/journal/$slug" params={{ slug: story.slug }}>
            {story.title}
          </Link>
        </h3>
        {size !== "sm" && (
          <p
            className={cn(
              "mt-3 max-w-xl text-sm leading-relaxed",
              dark ? "text-fosqa-gray" : "text-muted-foreground",
            )}
          >
            {story.standfirst}
          </p>
        )}
        <p
          className={cn(
            "eyebrow mt-4",
            dark ? "text-fosqa-gray" : "text-muted-foreground",
          )}
        >
          {story.author} · {formatDate(story.date)} · {story.readTime}
        </p>
      </div>
    </article>
  );
}
