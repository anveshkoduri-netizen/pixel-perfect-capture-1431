import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { ResultsView } from "@/components/skycart/ResultsView";
import { EmptyState, PillButton } from "@/components/skycart/primitives";
import { categoryBySlug, products } from "@/lib/skycart-data";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category unavailable — SKYCART" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const description = `Shop ${category.name.toLowerCase()} on SKYCART — ${category.blurb}, with specifications, stock and delivery dates upfront.`;
    return {
      meta: [
        { title: `${category.name} — SKYCART` },
        { name: "description", content: description },
        { property: "og:title", content: `${category.name} — SKYCART` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const navigate = useNavigate();
  const results = products.filter((p) => p.category === category.slug);

  return (
    <ResultsView
      results={results}
      categoryName={category.name}
      categorySlug={category.slug}
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Categories", to: "/categories" }, { label: category.name }]}
      heading={category.name}
      subheading={`${category.blurb} · filters below are specific to ${category.name.toLowerCase()}`}
      emptyState={
        <EmptyState
          icon={PackageSearch}
          title={`Nothing in ${category.name} matches these filters`}
          description="Try removing a specification filter, or search the wider catalogue."
        >
          <PillButton onClick={() => navigate({ to: "/search", search: { q: category.name } })}>
            Search {category.name}
          </PillButton>
          <PillButton variant="secondary" onClick={() => navigate({ to: "/categories" })}>
            All categories
          </PillButton>
        </EmptyState>
      }
    />
  );
}
