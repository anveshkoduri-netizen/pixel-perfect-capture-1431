import { Link } from "@tanstack/react-router";
import { ArrowUpDown, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { filterProducts, type Product } from "@/lib/skycart-data";
import { ProductCard } from "./ProductCard";
import { FilterPanel, type FilterState } from "./FilterPanel";
import { Chip, PillButton, plural } from "./primitives";

export type SortKey = "relevance" | "price-asc" | "price-desc" | "rating" | "discount";

const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "relevance", label: "Relevance" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Customer rating" },
  { key: "discount", label: "Discount" },
];

export function ResultCardSkeleton() {
  return (
    <div className="surface-card p-3">
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-surface-soft" />
      <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-surface-soft" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-surface-soft" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-surface-soft" />
      <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-surface-soft" />
    </div>
  );
}

function Sheet({ title, subtitle, onClose, actions, footer, children }: {
  title: string;
  subtitle?: string | undefined;
  onClose: () => void;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
      <div className="absolute inset-0 bg-foreground/35" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label={title} className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-card">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="min-w-0 truncate text-[20px] font-bold">
            {title}
            {subtitle ? <span className="font-semibold text-muted-foreground"> · {subtitle}</span> : null}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            {actions}
            <button type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full">
              <X className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer}
      </div>
    </div>
  );
}

const typePlural = (t: string) => (/s$/.test(t) ? t : `${t}s`);

export function ResultsView({
  results,
  facetCatalogue,
  initialFilters = {},
  categoryName,
  categorySlug,
  heading,
  headerLink,
  understood,
  loading,
  emptyState,
}: {
  results: Product[];
  facetCatalogue?: Product[] | undefined;
  initialFilters?: FilterState | undefined;
  categoryName?: string | undefined;
  categorySlug?: string | undefined;
  breadcrumb?: Array<{ label: string; to?: string | undefined }> | undefined;
  heading: string;
  subheading?: React.ReactNode;
  headerLink?: { label: string; slug: string } | undefined;
  /** Search results label the applied row "We understood". */
  understood?: boolean | undefined;
  loading?: boolean | undefined;
  interpretation?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [sheet, setSheet] = useState<"filters" | "sort" | null>(null);

  const toggle = (group: string, option: string) =>
    setFilters((prev) => {
      const current = prev[group] ?? [];
      const next = current.includes(option) ? current.filter((x) => x !== option) : [...current, option];
      const copy = { ...prev };
      if (next.length) copy[group] = next;
      else delete copy[group];
      return copy;
    });

  const catalogue = facetCatalogue ?? results;
  const filtered = useMemo(() => {
    const sorted = [...filterProducts(catalogue, filters)];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    return sorted;
  }, [filters, catalogue, sort]);

  const applied = Object.entries(filters).flatMap(([group, options]) => options.map((option) => ({ group, option })));
  const types = filters["Product type"] ?? [];
  const where = [categoryName, types.length === 1 && types[0] ? typePlural(types[0]) : undefined].filter(Boolean).join(" › ");
  const sortLabel = sortOptions.find((o) => o.key === sort)?.label ?? "Relevance";
  const toolbarButton = "inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-card px-4 text-[13px] font-semibold";

  return (
    <div className="container-page pt-6">
      <h1 className="font-display text-[28px] font-extrabold leading-tight">{heading}</h1>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="min-w-0 text-[13px] text-muted-foreground">
          {loading ? "Searching the catalogue…" : `${plural(filtered.length, "product")}${where ? ` in ${where}` : ""}`}
        </p>
        {headerLink ? (
          <Link to="/category/$slug" params={{ slug: headerLink.slug }} className="shrink-0 text-[14px] font-semibold text-primary">
            {headerLink.label}
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" onClick={() => setSheet("filters")} className={toolbarButton}>
          <SlidersHorizontal className="h-[18px] w-[18px]" /> Filters
          {applied.length > 0 ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {applied.length}
            </span>
          ) : null}
        </button>
        <button type="button" onClick={() => setSheet("sort")} className={toolbarButton}>
          <ArrowUpDown className="h-[18px] w-[18px]" /> Sort: {sortLabel}
        </button>
      </div>

      {applied.length > 0 ? (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {understood ? (
            <span className="flex shrink-0 items-center gap-1 text-[12px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> We understood
            </span>
          ) : null}
          {applied.map(({ group, option }) => (
            <Chip key={`${group}-${option}`} selected removable onClick={() => toggle(group, option)} aria-label={`Remove ${option}`}>
              {option}
            </Chip>
          ))}
        </div>
      ) : null}

       <div className="mt-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ResultCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            emptyState ?? (
              <div className="surface-card p-8 text-center">
                <h3 className="text-lg font-bold">No products match these filters</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Remove a filter to widen the results, or clear them all.
                </p>
                <PillButton className="mt-4" onClick={() => setFilters({})}>Clear all filters</PillButton>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
      </div>

      {sheet === "filters" ? (
        <Sheet
          title="Filters"
          subtitle={categoryName}
          onClose={() => setSheet(null)}
          actions={applied.length > 0 ? (
            <button type="button" onClick={() => setFilters({})} className="px-2 text-[14px] font-semibold text-primary">Clear all</button>
          ) : null}
          footer={
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <p className="text-[13px] font-semibold">{plural(filtered.length, "product")}</p>
              <PillButton className="shrink-0" onClick={() => setSheet(null)}>Show {plural(filtered.length, "product")}</PillButton>
            </div>
          }
        >
          <FilterPanel categorySlug={categorySlug} catalogue={catalogue} state={filters} onToggle={toggle} />
        </Sheet>
      ) : null}

      {sheet === "sort" ? (
        <Sheet title="Sort" onClose={() => setSheet(null)}>
          <div className="flex flex-wrap gap-2 pb-4">
            {sortOptions.map((option) => (
              <Chip key={option.key} selected={sort === option.key} onClick={() => { setSort(option.key); setSheet(null); }}>
                {option.label}
              </Chip>
            ))}
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}
