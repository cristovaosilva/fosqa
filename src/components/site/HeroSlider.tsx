import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, accentClass, type Story } from "@/data/content";
import { cn } from "@/lib/utils";

interface HeroSliderProps {
  slides: Story[];
  onActiveChange?: (story: Story, index: number) => void;
}

export function HeroSlider({ slides, onActiveChange }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);
  const progressStart = useRef(0);
  const duration = 6000;

  const go = useCallback(
    (next: number) => {
      const idx = (next + slides.length) % slides.length;
      setActive(idx);
      onActiveChange?.(slides[idx]!, idx);
    },
    [slides, onActiveChange],
  );

  useEffect(() => {
    onActiveChange?.(slides[0]!, 0);
  }, [slides, onActiveChange]);

  useEffect(() => {
    if (paused || slides.length <= 1) {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      setProgress(0);
      return;
    }

    progressStart.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - progressStart.current;
      const pct = Math.min((elapsed % duration) / duration, 1);
      setProgress(pct);
      if (elapsed >= duration) {
        go(active + 1);
        progressStart.current = now;
      }
      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [active, paused, slides.length, go]);

  const handlePrev = () => {
    progressStart.current = performance.now();
    go(active - 1);
  };

  const handleNext = () => {
    progressStart.current = performance.now();
    go(active + 1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="group relative bg-shadow text-cloud"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKey}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      tabIndex={0}
    >
      {/* Track */}
      <div
        className="flex h-[92vh] min-h-[600px] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((story, i) => (
          <article
            key={story.slug}
            className="relative w-full flex-shrink-0 overflow-hidden"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${story.title}`}
          >
            <div className="grain lowkey absolute inset-0 bg-black">
              <img
                src={story.image}
                alt={story.title}
                width={1920}
                height={1200}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-2 px-6 pb-16 sm:px-10">
              <div className="mx-auto max-w-[1600px]">
                <div className="rise flex flex-wrap items-center gap-3">
                  <span className={cn("eyebrow px-2.5 py-1", accentClass[story.accent])}>
                    {story.category}
                  </span>
                  <span className="eyebrow text-fosqa-gray">
                    {story.author} · {formatDate(story.date)}
                  </span>
                </div>
                <h2 className="display rise mt-8 max-w-5xl text-[14vw] leading-[0.85] sm:text-[7.5vw]">
                  {story.title}
                </h2>
                <div className="mt-10 flex flex-col items-start gap-8">
                  <p className="max-w-xl text-sm leading-relaxed text-fosqa-gray">
                    {story.standfirst}
                  </p>
                  <Link
                    to="/journal/$slug"
                    params={{ slug: story.slug }}
                    className="group/btn flex items-center gap-3 border border-white/30 px-7 py-4 transition-colors hover:bg-cloud hover:text-shadow"
                  >
                    <span className="eyebrow">Read story</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-cloud opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 group-hover:opacity-100 focus:opacity-100 sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-cloud opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 group-hover:opacity-100 focus:opacity-100 sm:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots + progress */}
          <div className="absolute inset-x-0 bottom-6 z-10 px-6 sm:px-10">
            <div className="mx-auto flex max-w-[1600px] justify-start">
              <div className="flex items-center gap-2" role="tablist" aria-label="Slide navigation">
                {slides.map((story, i) => (
                  <button
                    key={story.slug}
                    onClick={() => {
                      progressStart.current = performance.now();
                      go(i);
                    }}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border transition-all duration-300",
                      i === active
                        ? "border-cloud"
                        : "border-transparent hover:border-cloud/40",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full bg-cloud transition-opacity duration-300",
                        i === active ? "opacity-100" : "opacity-90",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top progress bar */}
          <div className="absolute top-0 left-0 z-10 h-1 bg-cloud/0">
            <div
              className="h-full bg-picasso transition-[width] duration-100 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
