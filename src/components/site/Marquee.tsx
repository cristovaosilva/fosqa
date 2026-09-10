import { cn } from "@/lib/utils";

/** Endless editorial ticker band, Imagine5-style. */
export function Marquee({
  items,
  className,
  speed = 38,
}: {
  items: string[];
  className?: string;
  speed?: number;
}) {
  const line = [...items, ...items];
  return (
    <div className={cn("marquee border-y border-border py-5", className)}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
            {line.map((item, i) => (
              <span key={`${copy}-${i}`} className="display flex items-center gap-8 text-2xl sm:text-4xl">
                {item}
                <span className="inline-block h-2 w-2 rounded-full bg-picasso" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
