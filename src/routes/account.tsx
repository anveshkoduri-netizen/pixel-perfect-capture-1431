import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  ClipboardList,
  CreditCard,
  Eye,
  Heart,
  LifeBuoy,
  MapPin,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { inr, productById } from "@/lib/skycart-data";
import { ProductTile } from "@/components/skycart/ProductCard";
import { EmptyState, PillButton } from "@/components/skycart/primitives";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — SKYCART" },
      {
        name: "description",
        content: "Manage SKYCART orders, wishlist, saved products, addresses, payments and business details.",
      },
      { property: "og:title", content: "Your account — SKYCART" },
      { property: "og:description", content: "Orders, wishlist, addresses, payments and business details." },
    ],
  }),
  component: AccountPage,
});

type SectionKey =
  | "orders"
  | "wishlist"
  | "saved"
  | "viewed"
  | "addresses"
  | "payments"
  | "business"
  | "support"
  | "settings";

const sections: Array<{ key: SectionKey; label: string; icon: LucideIcon }> = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "saved", label: "Saved products", icon: ClipboardList },
  { key: "viewed", label: "Recently viewed", icon: Eye },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "business", label: "Business details", icon: Building2 },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "settings", label: "Settings", icon: Settings },
];

function ProductList({ ids, emptyTitle, emptyText }: { ids: string[]; emptyTitle: string; emptyText: string }) {
  const navigate = useNavigate();
  if (ids.length === 0) {
    return (
      <EmptyState icon={Heart} title={emptyTitle} description={emptyText}>
        <PillButton onClick={() => navigate({ to: "/categories" })}>Browse categories</PillButton>
      </EmptyState>
    );
  }
  return (
    <div className="space-y-3">
      {ids.map((id) => {
        const product = productById(id);
        if (!product) return null;
        return (
          <div key={id} className="surface-card flex items-center gap-3 p-3.5">
            <ProductTile product={product} className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <Link
                to="/product/$id"
                params={{ id }}
                className="block truncate text-sm font-semibold hover:text-primary"
              >
                {product.name}
              </Link>
              <p className="text-[12px] text-muted-foreground">
                {product.specLine} · {inr(product.price)}
              </p>
            </div>
            <PillButton size="sm" variant="secondary" onClick={() => navigate({ to: "/product/$id", params: { id } })}>
              View
            </PillButton>
          </div>
        );
      })}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AccountPage() {
  const { wishlist, saved, recentlyViewed } = useCart();
  const [active, setActive] = useState<SectionKey>("orders");

  return (
    <div className="container-page pt-6">
      <h1 className="text-[26px] font-extrabold md:text-[32px]">Your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sharma Electricals · GSTIN 29ABCDE1234F1Z5</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => setActive(section.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors lg:rounded-xl",
                  active === section.key
                    ? "bg-primary-container text-primary"
                    : "text-muted-foreground hover:bg-surface-soft hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>

        <div>
          {active === "orders" ? (
            <Panel title="Orders">
              <p className="text-sm text-muted-foreground">
                Your three most recent orders are on the orders page, with delivery status and invoices.
              </p>
              <PillButton className="mt-4" onClick={() => undefined}>
                <Link to="/orders">Go to orders</Link>
              </PillButton>
            </Panel>
          ) : null}

          {active === "wishlist" ? (
            <ProductList
              ids={wishlist}
              emptyTitle="Your wishlist is empty"
              emptyText="Tap the heart on any product to keep it here for later."
            />
          ) : null}

          {active === "saved" ? (
            <ProductList
              ids={saved}
              emptyTitle="No saved products"
              emptyText="Items you save from the cart move here so your order stays clean."
            />
          ) : null}

          {active === "viewed" ? (
            <ProductList
              ids={recentlyViewed}
              emptyTitle="Nothing viewed yet"
              emptyText="Products you open appear here so you can compare specifications later."
            />
          ) : null}

          {active === "addresses" ? (
            <Panel title="Addresses">
              <div className="space-y-3">
                {[
                  { label: "Site office", lines: "Plot 14, Bommasandra Industrial Area, Bengaluru 560103" },
                  { label: "Warehouse", lines: "Shed 6, Peenya 2nd Stage, Bengaluru 560058" },
                ].map((entry) => (
                  <div key={entry.label} className="rounded-xl border border-border p-4">
                    <p className="text-sm font-bold">{entry.label}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{entry.lines}</p>
                  </div>
                ))}
              </div>
              <PillButton className="mt-4" variant="secondary">
                Add new address
              </PillButton>
            </Panel>
          ) : null}

          {active === "payments" ? (
            <Panel title="Payments">
              <ul className="space-y-3 text-[13px]">
                <li className="rounded-xl border border-border p-4">
                  <p className="font-bold">Business credit</p>
                  <p className="mt-1 text-muted-foreground">₹2,00,000 available · 30-day terms</p>
                </li>
                <li className="rounded-xl border border-border p-4">
                  <p className="font-bold">UPI</p>
                  <p className="mt-1 text-muted-foreground">sharma.electricals@upi</p>
                </li>
              </ul>
            </Panel>
          ) : null}

          {active === "business" ? (
            <Panel title="Business details">
              <dl className="divide-y divide-border text-[13px]">
                {[
                  ["Business name", "Sharma Electricals"],
                  ["GSTIN", "29ABCDE1234F1Z5"],
                  ["Contact", "+91 98450 11223"],
                  ["Invoice email", "accounts@sharmaelectricals.in"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[minmax(0,160px)_minmax(0,1fr)] gap-4 py-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ) : null}

          {active === "support" ? (
            <Panel title="Support">
              <p className="text-sm text-muted-foreground">
                Order issues, returns and bulk enquiries. Weekdays 9 am – 7 pm.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <PillButton>Start a chat</PillButton>
                <PillButton variant="secondary">Raise a return</PillButton>
              </div>
            </Panel>
          ) : null}

          {active === "settings" ? (
            <Panel title="Settings">
              <ul className="divide-y divide-border text-sm">
                {["Order and delivery notifications", "Price drop alerts", "Invoice email copies"].map((label) => (
                  <li key={label} className="flex items-center justify-between gap-3 py-3">
                    <span>{label}</span>
                    <span className="text-[13px] font-semibold text-primary">On</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
