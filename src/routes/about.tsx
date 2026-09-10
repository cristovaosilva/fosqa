import { createFileRoute, Link } from "@tanstack/react-router";
import heroLight from "@/assets/hero-light.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Fosqa — Where Light Follows Art" },
      {
        name: "description",
        content:
          "Fosqa is a publication and a catalogue: sculptural lighting objects made with artists, photographed only in the twenty minutes after sunset.",
      },
      { property: "og:title", content: "About Fosqa — Where Light Follows Art" },
      {
        property: "og:description",
        content: "A publication and a catalogue of sculptural lighting objects.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-shadow px-6 pb-24 pt-40 text-cloud sm:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="eyebrow text-fosqa-gray">About</p>
          <h1 className="display mt-8 max-w-5xl text-[13vw] leading-[0.85] sm:text-[8vw]">
            Where light follows art
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-fosqa-gray">
            Fosqa is two things at once: a magazine about light, and a catalogue of the objects that
            make it. We publish the story first, and the object second — because an object without
            its reasoning is just a lamp.
          </p>
        </div>
      </section>

      <section className="grain lowkey relative h-[60vh] bg-black">
        <img
          src={heroLight}
          alt="A sculptural pendant lamp glowing in a dark concrete room"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </section>

      <section className="px-6 py-28 sm:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-[1fr_1.4fr]">
          <h2 className="editorial text-4xl sm:text-5xl">Three commitments</h2>
          <div className="space-y-12">
            {[
              {
                n: "01",
                t: "One source, one decision",
                d: "Every object we publish is designed to be the only light in the room. We do not make fill light.",
              },
              {
                n: "02",
                t: "The maker is named",
                d: "Each object carries the name of the artist, craftsman or ambassador who shaped it, and links back to the story where it first appeared.",
              },
              {
                n: "03",
                t: "Photographed after sunset",
                d: "Low-key, high-contrast, grain intact. We never retouch a shadow out of an image.",
              },
            ].map((item) => (
              <div key={item.n} className="grid gap-4 border-t border-border pt-8 sm:grid-cols-[6rem_1fr]">
                <span className="eyebrow text-muted-foreground">{item.n}</span>
                <div>
                  <h3 className="editorial text-2xl">{item.t}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-24 sm:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-8">
          <p className="display max-w-xl text-4xl sm:text-5xl">
            Start with a story. Leave with an object.
          </p>
          <div className="flex gap-4">
            <Link
              to="/journal"
              className="eyebrow border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-background"
            >
              Read the journal
            </Link>
            <Link
              to="/objects"
              className="eyebrow border border-foreground/20 px-6 py-4 transition-colors hover:border-foreground"
            >
              See the objects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
