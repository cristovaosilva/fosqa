import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/ambassadors")({
  head: () => ({
    meta: [
      { title: "Become a Fosqa Ambassador — Register" },
      {
        name: "description",
        content:
          "Register as a Fosqa ambassador. Submit your details and our studio will review your application manually.",
      },
      { property: "og:title", content: "Become a Fosqa Ambassador — Register" },
      {
        property: "og:description",
        content: "Apply to represent Fosqa objects. Every application is reviewed by the studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AmbassadorsPage,
});

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name." })
    .max(100, { message: "Name must be under 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
  phone: z
    .string()
    .trim()
    .min(6, { message: "Please enter a valid phone number." })
    .max(30, { message: "Phone must be under 30 characters." }),
});

type Fields = z.infer<typeof schema>;

const EMPTY: Fields = { full_name: "", email: "", phone: "" };

function AmbassadorsPage() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof Fields, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("ambassador_applications").insert(parsed.data);
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't send your registration. Please try again.");
      return;
    }

    setValues(EMPTY);
    setDone(true);
    toast.success("Registration received.");
  }

  return (
    <section className="bg-shadow px-6 pb-28 pt-40 text-cloud sm:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow text-fosqa-gray">Ambassadors</p>
          <h1 className="display mt-6 max-w-3xl text-[13vw] leading-[0.85] sm:text-[7vw]">
            Carry the light
          </h1>
          <p className="editorial mt-10 max-w-lg text-2xl leading-snug text-cloud/90">
            Ambassadors represent Fosqa objects in their own spaces, studios and cities.
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-fosqa-gray">
            Registration is by application. Leave your details and the studio will reach out after a
            manual review — access to ambassador pricing, quantities and downloads follows approval.
          </p>
          <div className="mt-12 flex gap-1.5">
            <span className="h-3 w-8 bg-matisse" />
            <span className="h-3 w-8 bg-picasso" />
            <span className="h-3 w-8 bg-rothko" />
            <span className="h-3 w-8 bg-klein" />
          </div>
        </div>

        <div className="border-t border-white/20 pt-10 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          {done ? (
            <div>
              <h2 className="display text-4xl">Thank you</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-fosqa-gray">
                Your registration is with the studio. We review every application by hand and will
                write to you at the email you provided.
              </p>
              <button
                onClick={() => setDone(false)}
                className="eyebrow mt-10 border border-white/25 px-6 py-3 transition-colors hover:bg-cloud hover:text-shadow"
              >
                Register someone else
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="max-w-md">
              <p className="eyebrow text-fosqa-gray">Registration</p>

              <Field
                id="full_name"
                label="Full name"
                value={values.full_name}
                onChange={set("full_name")}
                error={errors.full_name}
                autoComplete="name"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                id="phone"
                label="Phone"
                type="tel"
                value={values.phone}
                onChange={set("phone")}
                error={errors.phone}
                autoComplete="tel"
              />

              <button
                type="submit"
                disabled={submitting}
                className="eyebrow mt-12 w-full border border-cloud bg-cloud px-6 py-4 text-shadow transition-colors hover:bg-transparent hover:text-cloud disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Submit registration"}
              </button>

              <p className="mt-5 text-xs leading-relaxed text-fosqa-gray">
                We use these details only to review your application and contact you.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="mt-10">
      <label htmlFor={id} className="eyebrow block text-fosqa-gray">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className="mt-3 w-full border-b border-white/25 bg-transparent pb-3 text-lg text-cloud outline-none transition-colors placeholder:text-fosqa-gray/60 focus:border-cloud"
      />
      {error && <p className="mt-2 text-xs text-rothko">{error}</p>}
    </div>
  );
}
