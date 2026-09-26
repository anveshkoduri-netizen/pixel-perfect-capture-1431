import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { inr, productById } from "@/lib/skycart-data";
import { ProductTile } from "@/components/skycart/ProductCard";
import { Badge, EmptyState, PillButton } from "@/components/skycart/primitives";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your orders — SKYCART" },
      { name: "description", content: "Track SKYCART orders, delivery status and GST invoices for your business." },
      { property: "og:title", content: "Your orders — SKYCART" },
      { property: "og:description", content: "Track orders, delivery status and invoices." },
    ],
  }),
  component: OrdersPage,
});

const orders = [
  {
    id: "SKY-48102",
    placed: "24 Sep 2026",
    status: "Out for delivery" as const,
    eta: "Arriving today by 7 pm",
    items: [
      { id: "polycab-2-5-fr-wire", qty: 2 },
      { id: "havells-32a-mcb", qty: 6 },
    ],
  },
  {
    id: "SKY-47788",
    placed: "18 Sep 2026",
    status: "Delivered" as const,
    eta: "Delivered 20 Sep, signed by site supervisor",
    items: [
      { id: "bosch-gsb-18v-50", qty: 1 },
      { id: "3m-h700-helmet", qty: 4 },
    ],
  },
  {
    id: "SKY-47120",
    placed: "02 Sep 2026",
    status: "Delivered" as const,
    eta: "Delivered 05 Sep",
    items: [{ id: "ultratech-opc-53", qty: 40 }],
  },
];

function OrdersPage() {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState icon={Package} title="No orders yet" description="Your orders and invoices will appear here.">
          <PillButton onClick={() => navigate({ to: "/categories" })}>Start shopping</PillButton>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page pt-6">
      <h1 className="text-[26px] font-extrabold md:text-[32px]">Your orders</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Delivery status and GST invoices for every order.</p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => {
          const lines = order.items
            .map((item) => ({ product: productById(item.id), qty: item.qty }))
            .filter((line) => line.product);
          const total = lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.qty, 0);
          return (
            <article key={order.id} className="surface-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-soft px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-bold">{order.id}</p>
                  <p className="text-[12px] text-muted-foreground">Placed {order.placed}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={order.status === "Delivered" ? "success" : "primary"}>{order.status}</Badge>
                  <span className="font-display text-sm font-bold">{inr(total)}</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[13px] text-muted-foreground">{order.eta}</p>
                <div className="mt-3 space-y-3">
                  {lines.map(({ product, qty }) =>
                    product ? (
                      <div key={product.id} className="flex items-center gap-3">
                        <ProductTile product={product} className="h-14 w-14 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Link
                            to="/product/$id"
                            params={{ id: product.id }}
                            className="block truncate text-sm font-semibold hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[12px] text-muted-foreground">
                            Qty {qty} · {inr(product.price)}
                          </p>
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <PillButton size="sm" variant="secondary">
                    Download invoice
                  </PillButton>
                  <PillButton size="sm" variant="secondary">
                    Track order
                  </PillButton>
                  <PillButton size="sm" variant="ghost">
                    Need help
                  </PillButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
