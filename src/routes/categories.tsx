import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchField } from "@/components/skycart/SearchField";
import { categoryIcons } from "@/components/skycart/primitives";
import { categories } from "@/lib/skycart-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All categories — SKYCART" },
      {
        name: "description",
        content:
          "Browse every SKYCART category: electrical, wires and cables, lighting, plumbing, hardware, tools, safety and industrial supplies.",
      },
      { property: "og:title", content: "All categories — SKYCART" },
      { property: "og:description", content: "Browse every SKYCART supply category by specification." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="container-page pt-8">
      <h1 className="text-[26px] font-extrabold md:text-[32px]">All categories</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Each category has its own specification filters, so you can narrow by rating, size or material instead of
        scrolling.
      </p>
      <div className="mt-5 max-w-xl">
        <SearchField />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug];
          return (
            <Link
              key={category.slug}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="surface-card flex items-start gap-3.5 p-4 transition-shadow hover:shadow-raised"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-container text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{category.name}</span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">{category.blurb}</span>
                <span className="mt-1.5 block text-[12px] font-semibold text-primary">
                  {category.count.toLocaleString("en-IN")} products
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
