import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { searchExamples, suggestionsFor } from "@/lib/search";

export function SearchField({
  size = "md",
  initialQuery = "",
  showExamples = false,
  autoFocus = false,
  className,
}: {
  size?: "md" | "lg";
  initialQuery?: string;
  showExamples?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const suggestions = suggestionsFor(query);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setOpen(false);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <div className={cn("relative w-full", className)} ref={wrapRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className={cn(
          "flex items-center gap-2 rounded-full border bg-card transition-[border-color,box-shadow]",
          open ? "border-primary shadow-[0_0_0_3px_var(--primary-container)]" : "border-border-strong",
          size === "lg" ? "h-14 pl-5 pr-2" : "h-11 pl-4 pr-1.5",
        )}
      >
        <Search className={cn("shrink-0 text-muted-foreground", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
        <input
          value={query}
          autoFocus={autoFocus}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="What are you looking for?"
          aria-label="Search SKYCART"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            size === "lg" ? "text-base" : "text-sm",
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface-soft"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          className={cn(
            "shrink-0 rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/92",
            size === "lg" ? "h-11 px-6 text-[15px]" : "h-8 px-4 text-[13px]",
          )}
        >
          Search
        </button>
      </form>

      {open && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-raised">
          <p className="eyebrow px-4 pt-3">Suggestions</p>
          <ul className="py-1.5">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    submit(s);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-surface-soft"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showExamples ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-muted-foreground">Try</span>
          {searchExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => submit(example)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
