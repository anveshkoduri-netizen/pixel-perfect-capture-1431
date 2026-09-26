import { Link } from "@tanstack/react-router";
import { Grid2x2, LayoutList, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { categoryBySlug, filterProducts, type Product } from "@/lib/skycart-data";
import { ProductCard } from "./ProductCard";
import { FilterPanel, type FilterState } from "./FilterPanel";
import { PillButton, plural } from "./primitives";

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

export function ResultsView({
  results,
  facetCatalogue,
  initialFilters = {},
  categoryName,
  categorySlug,
  breadcrumb,
  heading,
  subheading,
  loading,
  interpretation,
  emptyState,
}: {
  results: Product[];
  facetCatalogue?: Product[] | undefined;
  initialFilters?: FilterState | undefined;
  categoryName?: string | undefined;
  categorySlug?: string | undefined;
  breadcrumb: Array<{ label: string; to?: string | undefined }>;
  heading: string;
  subheading?: React.ReactNode;
  loading?: boolean | undefined;
  interpretation?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggle = (group: string, option: string) =>
    setFilters((prev) => {
      const current = prev[group] ?? [];
      return {
        ...prev,
        [group]: current.includes(option) ? current.filter((x) => x !== option) : [...current, option],
      };
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

  const panel = (
    <FilterPanel
      categoryName={categoryName}
      categorySlug={categorySlug}
      catalogue={catalogue}
      state={filters}
      onToggle={toggle}
    />
  );

  return (
    <div className="container-page pt-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
        {breadcrumb.map((crumb, index) => (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {index > 0 ? <span>/</span> : null}
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-primary">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-extrabold md:text-[30px]">{heading}</h1>
          {subheading ? <div className="mt-1.5 text-sm text-muted-foreground">{subheading}</div> : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-card px-4 text-[13px] font-semibold lg:hidden"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" /> Filters
          </button>
          <label className="sr-only" htmlFor="sort">
            Sort results
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-full border border-border-strong bg-card px-4 text-[13px] font-semibold"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="hidden items-center rounded-full border border-border-strong bg-card p-1 sm:flex">
            {(["grid", "list"] as const).map((value) => {
              const Icon = value === "grid" ? Grid2x2 : LayoutList;
              return (
                <button
                  key={value}
                  aria-label={`${value} view`}
                  onClick={() => setLayout(value)}
                  className={cn(
                    "grid h-8 w-9 place-items-center rounded-full transition-colors",
                    layout === value ? "bg-primary-container text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {interpretation}

       <div className="mt-5">
         <div>
          <p className="mb-3 text-[13px] text-muted-foreground">
            {loading ? "Searching the catalogue…" : plural(filtered.length, "product")}
          </p>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
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
                <button
                  onClick={() => setFilters({})}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Clear all filters
                </button>
              </div>
            )
          ) : layout === "grid" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
          <div
            className="absolute inset-0 bg-foreground/35"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden
          />
          <div role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-background">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-[20px] font-bold">Filters</h2>
              <div className="flex items-center gap-2">
                {Object.values(filters).some((values) => values.length > 0) && (
                  <PillButton variant="ghost" size="sm" onClick={() => setFilters({})}>Clear all</PillButton>
                )}
                <PillButton variant="secondary" size="sm" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} className="h-9 w-9 p-0">
                  <X className="h-4 w-4" />
                </PillButton>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{panel}</div>
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <p className="min-w-0 text-[12px] text-muted-foreground">
                <strong className="text-foreground">{plural(filtered.length, "product")}</strong>
                {categorySlug && categoryBySlug(categorySlug) ? ` · of ${categoryBySlug(categorySlug)?.count.toLocaleString("en-IN")} in ${categoryName ?? categoryBySlug(categorySlug)?.name}` : " in the catalogue"}
              </p>
              <PillButton className="shrink-0" onClick={() => setMobileFiltersOpen(false)}>Show {plural(filtered.length, "product")}</PillButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
