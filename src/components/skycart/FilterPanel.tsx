import { filterGroupsFor, filterProducts, type Product } from "@/lib/skycart-data";
import { Chip } from "./primitives";

export type FilterState = Record<string, string[]>;

/** Standard faceted count: all active filters except those in this group, plus this option. */
export function facetCount(catalogue: Product[], state: FilterState, group: string, option: string) {
  return filterProducts(catalogue, { ...state, [group]: [option] }).length;
}

export function FilterPanel({
  categorySlug,
  catalogue,
  state,
  onToggle,
}: {
  categorySlug?: string | undefined;
  catalogue: Product[];
  state: FilterState;
  onToggle: (group: string, option: string) => void;
}) {
  const groups = filterGroupsFor(categorySlug, catalogue);
  const applied = Object.entries(state).flatMap(([group, options]) => options.map((option) => ({ group, option })));

  return (
    <div>
      {applied.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {applied.map(({ group, option }) => (
            <Chip key={`${group}-${option}`} selected removable onClick={() => onToggle(group, option)} aria-label={`Remove ${option}`}>
              {option}
            </Chip>
          ))}
        </div>
      ) : null}

      <div className="mt-5 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="eyebrow mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const selected = state[group.label]?.includes(option) ?? false;
                const count = facetCount(catalogue, state, group.label, option);
                return (
                  <Chip
                    key={option}
                    selected={selected}
                    unavailable={count === 0}
                    count={count}
                    onClick={() => onToggle(group.label, option)}
                  >
                    {option}
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
