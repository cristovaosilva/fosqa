import { cn } from "@/lib/utils";

export function FilterBar({
  options,
  value,
  onChange,
  dark = false,
  className,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "eyebrow border px-4 py-2.5 transition-all duration-300",
              dark
                ? active
                  ? "border-cloud bg-cloud text-shadow"
                  : "border-white/20 text-fosqa-gray hover:border-cloud/60 hover:text-cloud"
                : active
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
