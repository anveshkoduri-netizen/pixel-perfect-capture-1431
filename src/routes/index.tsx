import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, ListChecks, Truck } from "lucide-react";
import { SearchField } from "@/components/skycart/SearchField";
import { ProductCard } from "@/components/skycart/ProductCard";
import { SectionHeader, categoryIcons } from "@/components/skycart/primitives";
import { brands, categories, products, type CategorySlug } from "@/lib/skycart-data";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SKYCART — Industrial & business supplies" },
      {
        name: "description",
        content: "Shop electrical, wires, lighting, plumbing, tools, safety and industrial supplies with specs, prices and delivery upfront.",
      },
      { property: "og:title", content: "SKYCART — Industrial & business supplies" },
      {
        property: "og:description",
        content: "Search by specification and buy industrial and business supplies from trusted brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const homeCategories: CategorySlug[] = [
  "electrical",
  "wires-cables",
  "lighting",
  "power-tools",
  "hand-tools",
  "plumbing",
  "hardware",
  "safety",
];

const pick = (ids: string[]) =>
  ids.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));

const deals = pick([
  "bosch-gsb-18v-50",
  "polycab-2-5-fr-wire",
  "havells-32a-mcb",
  "philips-20w-batten",
  "supreme-25mm-pvc-pipe",
  "honeywell-nitrile-gloves",
  "makita-ga5030-grinder",
  "stanley-65pc-kit",
]);

const frequent = pick([
  "finolex-4sqmm-flex",
  "legrand-modular-switch",
  "astral-pvc-fitting-set",
  "3m-h700-helmet",
  "hilti-anchor-set",
  "taparia-spanner-set",
  "wd40-multi-use",
  "ultratech-opc-53",
]);

function CategoryStrip() {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3">
      {homeCategories.map((slug) => {
        const category = categories.find((c) => c.slug === slug);
        if (!category) return null;
        const Icon = categoryIcons[slug];
        return (
          <Link
            key={slug}
            to="/category/$slug"
            params={{ slug }}
            className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1 text-center"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-card text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <span className="line-clamp-2 w-full text-[11px] font-semibold leading-tight">{category.name}</span>
          </Link>
        );
      })}
      <Link to="/categories" className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-primary-container text-primary">
          <ArrowRight className="h-5 w-5" />
        </span>
        <span className="w-full text-[11px] font-semibold leading-tight">All {categories.length}</span>
      </Link>
    </div>
  );
}

function Carousel({ title, eyebrow, items }: { title: string; eyebrow?: string | undefined; items: typeof products }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-7">
      <SectionHeader eyebrow={eyebrow} title={title} action="View all" to="/search" />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {items.map((product) => (
          <div key={product.id} className="w-[168px] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { recentlyViewed } = useCart();
  const viewed = pick(recentlyViewed);

  return (
    <div className="container-page pt-3">
      <p className="eyebrow">Industrial & business supplies</p>
      <div className="mt-2">
        <SearchField placeholder="Search products, brands or specifications" showExamples />
      </div>

      <section className="mt-6">
        <SectionHeader title="Shop by category" action="All" to="/categories" />
        <CategoryStrip />
      </section>

      <Carousel eyebrow="Limited time" title="Deals & Offers" items={deals} />
      <Carousel eyebrow="Deliver to 560103" title="Popular in your area" items={frequent} />

      <section className="mt-7">
        <SectionHeader title="Top Brands" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {brands.map((brand) => (
            <Link
              key={brand}
              to="/search"
              search={{ q: brand }}
              className="flex h-12 shrink-0 items-center rounded-xl border border-border bg-card px-4 text-[13px] font-semibold whitespace-nowrap"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {viewed.length > 0 ? <Carousel title="Recently viewed" items={viewed} /> : null}

      <section className="mt-7">
        <SectionHeader title="Why buy on SKYCART?" />
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4">
          {[
            { icon: ListChecks, t: "Specification-aware shopping", d: "See the attributes that matter before comparing products." },
            { icon: Truck, t: "Delivery visibility", d: "Know availability and delivery dates before purchase." },
            { icon: FileText, t: "GST-ready purchasing", d: "Get GST invoice information with your order." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="w-[220px] shrink-0 rounded-xl bg-surface-soft p-3.5">
              <Icon className="h-4 w-4 text-primary" />
              <p className="mt-2 text-[13px] font-bold">{t}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
