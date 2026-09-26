import { Check, X } from "lucide-react";
import { useState } from "react";
import { filterGroupsFor, filterProducts, type Product } from "@/lib/skycart-data";
import { Chip } from "./primitives";

export type FilterState = Record<string, string[]>;

export function FilterPanel({
  categoryName,
  categorySlug,
  catalogue,
  state,
  onToggle,
}: {
  categoryName?: string | undefined;
  categorySlug?: string | undefined;
  catalogue: Product[];
  state: FilterState;
  onToggle: (group: string, option: string) => void;
}) {
  const groups = filterGroupsFor(categorySlug, catalogue);
  const selectedCount = Object.values(state).reduce((n, v) => n + v.length, 0);
  const [notice, setNotice] = useState("");

  function countFor(group: string, option: string) {
    const selected = state[group] ?? [];
    const next = selected.includes(option) ? state : { ...state, [group]: [...selected, option] };
    return filterProducts(catalogue, next).length;
  }

  return (
    <div>
      <p className="rounded-lg bg-primary-container px-3 py-2 text-[12px] text-primary-container-foreground">
        {categoryName
          ? `Showing ${categoryName} filters — these adapt to the category you browse.`
          : "Filters adapt to the category you browse."}
      </p>

      {selectedCount > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(state).flatMap(([group, options]) =>
            options.map((option) => (
               <Chip key={`${group}-${option}`} selected onClick={() => { setNotice(""); onToggle(group, option); }} aria-label={`Remove ${group}: ${option}`}>
                 {group}: {option}
                <X className="h-3 w-3" />
              </Chip>
            )),
          )}
        </div>
      ) : null}

      {notice && <p role="status" className="mt-3 text-[12px] text-muted-foreground">{notice}</p>}
      <div className="mt-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="eyebrow mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
               {group.options.map((option) => {
                 const selected = state[group.label]?.includes(option) ?? false;
                 const count = countFor(group.label, option);
                 return (
                   <Chip
                     key={option}
                     selected={selected}
                     aria-pressed={selected}
                     aria-disabled={count === 0 && !selected}
                     className={count === 0 && !selected ? "cursor-not-allowed border-border bg-surface-soft text-muted-foreground/60 hover:border-border hover:text-muted-foreground/60" : undefined}
                     onClick={() => {
                       if (!selected && count === 0) { setNotice("No results with this in your current selection"); return; }
                       setNotice("");
                       onToggle(group.label, option);
                     }}
                   >
                     {selected && <Check className="h-3.5 w-3.5" />}
                     {option} <span className="text-[11px] opacity-70">· {count}</span>
                   </Chip>
                 );
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
