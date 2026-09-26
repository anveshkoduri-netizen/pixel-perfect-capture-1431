import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SearchX, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SearchField } from "@/components/skycart/SearchField";
import { ProductCard } from "@/components/skycart/ProductCard";
import { ResultsView } from "@/components/skycart/ResultsView";
import { EmptyState, PillButton, SectionHeader, categoryIcons } from "@/components/skycart/primitives";
import { relaxedResults, searchProducts } from "@/lib/search";
import { categories, categoryBySlug, products } from "@/lib/skycart-data";
import type { FilterState } from "@/components/skycart/FilterPanel";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional().default("") }),
  head: () => ({
    meta: [
      { title: "Search industrial supplies — SKYCART" },
      {
        name: "description",
        content:
          "Search SKYCART by specification: 18V drill, 2.5 sq mm wire, 32A MCB, 20W LED or 25mm PVC pipe.",
      },
      { property: "og:title", content: "Search industrial supplies — SKYCART" },
      { property: "og:description", content: "Specification-aware search across every SKYCART category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(Boolean(q));
  const [offline, setOffline] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    const timer = setTimeout(() => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setOffline(true);
        setFailed(true);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  if (!q) {
    return (
      <div className="container-page pt-8">
        <h1 className="text-[26px] font-extrabold md:text-[32px]">Search SKYCART</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Type a requirement the way you'd say it — a rating, a size or a product type. SKYCART reads the
          specification and shows matching products.
        </p>
        <div className="mt-5 max-w-2xl">
          <SearchField size="lg" showExamples autoFocus />
        </div>
        <div className="mt-10">
          <p className="eyebrow mb-3">Popular categories</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.slice(0, 10).map((category) => {
              const Icon = categoryIcons[category.slug];
              return (
                <Link
                  key={category.slug}
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  className="surface-card flex items-center gap-3 p-3.5 text-sm font-semibold hover:shadow-raised"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={offline ? WifiOff : SearchX}
          title={offline ? "You're offline" : "Search didn't complete"}
          description={
            offline
              ? `We couldn't reach SKYCART to search for "${q}". Your cart and saved items are safe on this device.`
              : `Something interrupted the search for "${q}". Nothing was lost — try again.`
          }
        >
          <PillButton onClick={() => navigate({ to: "/search", search: { q } })}>Try again</PillButton>
          <PillButton variant="secondary" onClick={() => navigate({ to: "/categories" })}>
            Browse categories
          </PillButton>
        </EmptyState>
      </div>
    );
  }

  const { results, related, interpretation } = searchProducts(q);
  const relaxed = relaxedResults(interpretation);
  const relaxedQuery = interpretation.tokens.find((t) => t.kind !== "Product type")?.value;
  const category = interpretation.category ? categoryBySlug(interpretation.category) : undefined;
  const initialFilters: FilterState = {};
  for (const token of interpretation.tokens) {
    const group = token.kind;
    initialFilters[group] = [...(initialFilters[group] ?? []), token.value];
  }
  const facetCatalogue = category && interpretation.tokens.length > 0
    ? products.filter((product) => product.category === category.slug)
    : results;

  return (
    <>
      <div className="container-page pt-6">
        <div className="max-w-2xl">
          <SearchField initialQuery={q} />
        </div>
      </div>
      <ResultsView
        key={q}
        results={results}
        facetCatalogue={facetCatalogue}
        initialFilters={initialFilters}
        loading={loading}
        categoryName={category?.name}
        categorySlug={category?.slug}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Search" }, { label: q }]}
        heading={`Results for ${q}`}
        understood
        headerLink={category ? { label: `Browse all ${category.name}`, slug: category.slug } : undefined}
        emptyState={
          <EmptyState
            icon={SearchX}
            title={`No products match ${q}`}
            description="Here's what's closest. Widening the query usually finds an equivalent product."
          >
            {relaxedQuery ? (
              <PillButton
                variant="secondary"
                onClick={() => navigate({ to: "/search", search: { q: q.replace(relaxedQuery, "").trim() || q } })}
              >
                Search without "{relaxedQuery}" · {relaxed.length} results
              </PillButton>
            ) : null}
            {category ? (
              <PillButton variant="secondary" onClick={() => navigate({ to: "/category/$slug", params: { slug: category.slug } })}>
                All {category.name} · {category.count.toLocaleString("en-IN")} products
              </PillButton>
            ) : null}
            <PillButton onClick={() => navigate({ to: "/search", search: { q: q.split(" ").slice(-1).join(" ") } })}>
              Closest matches
            </PillButton>
          </EmptyState>
        }
      />
      {!loading && results.length > 0 && related.length > 0 ? (
        <section className="container-page mt-10">
          <SectionHeader eyebrow="Doesn't match every spec" title="You may also need" />
          <div className="grid grid-cols-2 gap-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
