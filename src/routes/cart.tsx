import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { inr, productById } from "@/lib/skycart-data";
import { DeliveryLine, ProductTile } from "@/components/skycart/ProductCard";
import { Badge, EmptyState, PillButton, QuantityStepper } from "@/components/skycart/primitives";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — SKYCART" },
      { name: "description", content: "Review quantities, delivery dates and GST before checkout on SKYCART." },
      { property: "og:title", content: "Your cart — SKYCART" },
      { property: "og:description", content: "Review quantities, delivery dates and GST before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, saved, totals, setQty, remove, saveForLater, moveToCart } = useCart();
  const navigate = useNavigate();
  const [priceNoticeDismissed, setPriceNoticeDismissed] = useState(false);

  if (detailed.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Items you add stay here on this device. Start from a category, or search by specification."
        >
          <PillButton onClick={() => navigate({ to: "/categories" })}>Browse categories</PillButton>
          <PillButton variant="secondary" onClick={() => navigate({ to: "/search", search: { q: "" } })}>
            Search products
          </PillButton>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page pt-6">
      <h1 className="text-[26px] font-extrabold md:text-[32px]">Your cart</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {detailed.length} product{detailed.length > 1 ? "s" : ""} across {new Set(detailed.map((l) => l.product.category)).size}{" "}
        categories
      </p>

      {!priceNoticeDismissed ? (
        <div className="surface-card mt-4 flex flex-col gap-3 border-warning/40 bg-warning/10 p-4 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
            <span>
              <span className="font-semibold">One price changed since you added it.</span> Philips 20W LED Batten is
              now {inr(649)} — the updated price is already in your total.
            </span>
          </p>
          <PillButton size="sm" variant="secondary" onClick={() => setPriceNoticeDismissed(true)}>
            Got it
          </PillButton>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_368px]">
        <div className="space-y-3">
          {detailed.map(({ product, qty }) => (
            <article key={product.id} className="surface-card grid gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
              <Link to="/product/$id" params={{ id: product.id }}>
                <ProductTile product={product} className="aspect-square w-full" />
              </Link>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </p>
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="mt-1 block text-[15px] font-semibold leading-snug hover:text-primary"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-[13px] text-muted-foreground">{product.specLine}</p>
                <div className="mt-2">
                  <DeliveryLine product={product} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <QuantityStepper qty={qty} onChange={(n) => setQty(product.id, n)} />
                  <button
                    onClick={() => saveForLater(product.id)}
                    className="text-[13px] font-semibold text-primary hover:underline"
                  >
                    Save for later
                  </button>
                  <button
                    onClick={() => remove(product.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-display text-lg font-bold">{inr(product.price * qty)}</p>
                <p className="text-[13px] text-muted-foreground line-through">{inr(product.mrp * qty)}</p>
                <Badge tone="success" className="mt-1">
                  Saving {inr((product.mrp - product.price) * qty)}
                </Badge>
              </div>
            </article>
          ))}

          {saved.length > 0 ? (
            <section className="surface-card p-4">
              <h2 className="text-base font-bold">Saved for later</h2>
              <div className="mt-3 space-y-3">
                {saved.map((id) => {
                  const product = productById(id);
                  if (!product) return null;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <ProductTile product={product} className="h-16 w-16 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-[13px] text-muted-foreground">{inr(product.price)}</p>
                      </div>
                      <PillButton size="sm" variant="secondary" onClick={() => moveToCart(id)}>
                        Move to cart
                      </PillButton>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="surface-card p-5">
            <h2 className="text-base font-bold">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{inr(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="font-semibold text-success">− {inr(totals.discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-semibold">{totals.delivery === 0 ? "Free" : inr(totals.delivery)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GST (18%)</dt>
                <dd className="font-semibold">{inr(totals.gst)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-display font-extrabold">{inr(totals.total)}</dd>
              </div>
            </dl>
            <PillButton className="mt-5 w-full" size="lg" onClick={() => navigate({ to: "/checkout" })}>
              Checkout
            </PillButton>
            <p className="mt-3 text-[12px] text-muted-foreground">
              GST invoice issued to your registered business details.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
