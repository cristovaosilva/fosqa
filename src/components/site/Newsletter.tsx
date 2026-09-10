import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

/** Bright signup band that closes every page, magazine-style. */
export function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    toast.success("You're on the list. Look out for the next dispatch.");
    setName("");
    setEmail("");
  }

  return (
    <section className="band-picasso px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="editorial text-4xl sm:text-6xl">Sign up for the Fosqa dispatch</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed">
          Stories about light, shadow and the people shaping both — in your inbox every other week.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-10 grid gap-px border border-black/80 bg-black/80 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            aria-label="First name"
            className="band-picasso px-5 py-4 text-sm outline-none placeholder:text-black/55"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="band-picasso px-5 py-4 text-sm outline-none placeholder:text-black/55"
          />
          <button
            type="submit"
            className="eyebrow group flex items-center justify-center gap-3 bg-black px-8 py-4 text-cloud transition-colors hover:bg-klein"
          >
            Sign up
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}
