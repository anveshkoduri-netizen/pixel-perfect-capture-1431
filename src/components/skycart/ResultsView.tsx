import { Link } from "@tanstack/react-router";
import { Grid2x2, LayoutList, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/skycart-data";
import { ProductCard } from "./ProductCard";
import { FilterPanel, type FilterState } from "./FilterPanel";

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
  categoryName?: string | undefined;
  categorySlug?: string | undefined;
  breadcrumb: Array<{ label: string; to?: string | undefined }>;
  heading: string;
  subheading?: React.ReactNode;
  loading?: boolean | undefined;
  interpretation?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FilterState>({});
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

  const filtered = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v.length > 0);
    let list = results;
    for (const [group, options] of active) {
      list = list.filter((product) => {
        const haystack = `${product.brand} ${product.name} ${product.specLine} ${product.specs
          .map((s) => s.value)
          .join(" ")} ${product.stock === "in" ? "In stock" : ""} ${
          product.freeDelivery ? "Free delivery" : ""
        } ${product.delivery === "Tomorrow" ? "Delivery tomorrow" : ""}`.toLowerCase();
        if (group === "Price") {
          return options.some((band) => {
            if (band.startsWith("Under")) return product.price < 500;
            if (band.startsWith("₹500")) return product.price >= 500 && product.price <= 2000;
            if (band.startsWith("₹2,000")) return product.price > 2000 && product.price <= 10000;
            return product.price > 10000;
          });
        }
        if (group === "Rating") {
          return options.some((option) => product.rating >= parseFloat(option));
        }
        return options.some((option) => haystack.includes(option.toLowerCase()));
      });
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    return sorted;
  }, [filters, results, sort]);

  const panel = (
    <FilterPanel
      categoryName={categoryName}
      categorySlug={categorySlug}
      state={filters}
      onToggle={toggle}
      onClear={() => setFilters({})}
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
            <SlidersHorizontal className="h-4 w-4" /> Filters
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

      <div className="mt-5 grid gap-5 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">{panel}</div>
        </aside>

        <div>
          <p className="mb-3 text-[13px] text-muted-foreground">
            {loading ? "Searching the catalogue…" : `${filtered.length} products`}
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
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/35"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {panel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
