import { Link } from "@tanstack/react-router";
import fosqaLogo from "@/assets/fosqa-logo.png.asset.json";

const LINKS = [
  { to: "/journal", label: "Journal" },
  { to: "/artists", label: "Artists" },
  { to: "/objects", label: "Objects" },
  { to: "/ambassadors", label: "Ambassadors" },
  { to: "/about", label: "About" },
] as const;

export function Footer() {
  return (
    <footer className="band-picasso px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1600px]">
        <img
          src={fosqaLogo.url}
          alt="Fosqa"
          className="h-auto w-full max-w-[1240px] brightness-0"
        />

        <div className="mt-14 grid gap-12 border-t border-black/25 pt-12 sm:grid-cols-3">
          <div>
            <p className="editorial max-w-xs text-2xl leading-snug">
              Where light follows art.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-black/70">
              A publication and a catalogue of objects, made in the twenty minutes after sunset.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow text-black/55">Explore</p>
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="link-draw w-fit text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="eyebrow text-black/55">Studio</p>
            <p className="text-sm">Lisbon · Copenhagen</p>
            <a href="mailto:hello@fosqa.com" className="link-draw w-fit text-sm">
              hello@fosqa.com
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/25 pt-6">
          <p className="eyebrow text-black/60">© {new Date().getFullYear()} Fosqa</p>
          <div className="flex gap-1.5">
            <span className="h-3 w-8 bg-matisse" />
            <span className="h-3 w-8 bg-rothko" />
            <span className="h-3 w-8 bg-klein" />
            <span className="h-3 w-8 bg-black" />
          </div>
        </div>
      </div>
    </footer>
  );
}
