import { SlidersHorizontal, X } from "lucide-react";
import { defaultFilterGroups, filterGroupsByCategory, priceBands } from "@/lib/skycart-data";
import { Chip } from "./primitives";

export type FilterState = Record<string, string[]>;

export function groupsFor(categorySlug?: string) {
  const groups = categorySlug ? filterGroupsByCategory[categorySlug] : undefined;
  return [...(groups ?? defaultFilterGroups), { label: "Price", options: priceBands }];
}

export function FilterPanel({
  categoryName,
  categorySlug,
  state,
  onToggle,
  onClear,
}: {
  categoryName?: string;
  categorySlug?: string;
  state: FilterState;
  onToggle: (group: string, option: string) => void;
  onClear: () => void;
}) {
  const groups = groupsFor(categorySlug);
  const selectedCount = Object.values(state).reduce((n, v) => n + v.length, 0);

  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
        </h3>
        {selectedCount > 0 ? (
          <button onClick={onClear} className="text-[13px] font-semibold text-primary hover:underline">
            Clear all
          </button>
        ) : null}
      </div>
      <p className="mt-2 rounded-lg bg-primary-container px-3 py-2 text-[12px] text-primary-container-foreground">
        {categoryName
          ? `Showing ${categoryName} filters — these adapt to the category you browse.`
          : "Filters adapt to the category you browse."}
      </p>

      {selectedCount > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(state).flatMap(([group, options]) =>
            options.map((option) => (
              <Chip key={`${group}-${option}`} selected onClick={() => onToggle(group, option)}>
                {option}
                <X className="h-3 w-3" />
              </Chip>
            )),
          )}
        </div>
      ) : null}

      <div className="mt-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="eyebrow mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((option) => (
                <Chip
                  key={option}
                  selected={state[group.label]?.includes(option)}
                  onClick={() => onToggle(group.label, option)}
                >
                  {option}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
