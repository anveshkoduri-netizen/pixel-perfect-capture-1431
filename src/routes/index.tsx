import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, FileText, Truck } from "lucide-react";
import { SearchField } from "@/components/skycart/SearchField";
import { ProductCard } from "@/components/skycart/ProductCard";
import { SectionHeader, categoryIcons } from "@/components/skycart/primitives";
import { brands, categories, products } from "@/lib/skycart-data";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SKYCART — Everything you need to get the job done" },
      {
        name: "description",
        content:
          "Discover industrial and business supplies from trusted brands, with specifications, availability and delivery information upfront.",
      },
      { property: "og:title", content: "SKYCART — Everything you need to get the job done" },
      {
        property: "og:description",
        content: "Industrial and business supplies with specifications, availability and delivery upfront.",
      },
    ],
  }),
  component: Home,
});

function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {categories.slice(0, 10).map((category) => {
        const Icon = categoryIcons[category.slug];
        return (
          <Link
            key={category.slug}
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="surface-card group p-4 transition-shadow hover:shadow-raised"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-container text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-bold leading-snug">{category.name}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{category.blurb}</p>
            <p className="mt-2 text-[12px] font-semibold text-primary">
              {category.count.toLocaleString("en-IN")} products
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function Rail({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string | undefined;
  title: string;
  items: typeof products;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12">
      <SectionHeader eyebrow={eyebrow} title={title} action="View all" to="/search" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { recentlyViewed } = useCart();
  const viewed = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="container-page pt-8">
      <section className="surface-card overflow-hidden px-5 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Industrial & business supplies</p>
          <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] md:text-[46px]">
            Everything you need to get the job done.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-muted-foreground md:text-base">
            Discover industrial and business supplies from trusted brands, with specifications, availability and
            delivery information upfront.
          </p>
          <div className="mx-auto mt-7 max-w-2xl">
            <SearchField size="lg" showExamples />
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            { icon: BadgeCheck, label: "Specification-first listings" },
            { icon: Truck, label: "Delivery dates before you buy" },
            { icon: FileText, label: "GST invoice on every order" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl bg-surface-soft px-3.5 py-3">
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-[13px] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader eyebrow="Shop by category" title="Browse the catalogue" action="All categories" to="/categories" />
        <CategoryGrid />
      </section>

      <Rail eyebrow="Just added" title="New in" items={products.filter((p) => p.tags.includes("new"))} />
      <Rail eyebrow="Ordered most often" title="Best sellers" items={products.filter((p) => p.tags.includes("bestseller"))} />
      <Rail eyebrow="Limited time" title="Deals" items={products.filter((p) => p.tags.includes("deal"))} />

      <section className="mt-12">
        <SectionHeader eyebrow="Popular brands" title="Brands professionals ask for" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand}
              to="/search"
              search={{ q: brand }}
              className="surface-card flex h-20 items-center justify-center px-3 text-center text-[13px] font-semibold transition-shadow hover:shadow-raised"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <Rail
        eyebrow="Based on your work"
        title="Recommended for you"
        items={products.filter((p) => p.tags.includes("recommended"))}
      />

      {viewed.length > 0 ? <Rail eyebrow="Pick up where you left off" title="Recently viewed" items={viewed} /> : null}

      <section className="mt-12">
        <div className="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Buying for a business?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add GST details, set delivery addresses for each site and pay on business credit.
            </p>
          </div>
          <Link
            to="/account"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/92"
          >
            Business details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
