import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { inr, productById } from "@/lib/skycart-data";
import { DeliveryLine, ProductTile } from "@/components/skycart/ProductCard";
import { EmptyState, PillButton, QuantityStepper } from "@/components/skycart/primitives";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — SKYCART" },
      { name: "description", content: "Review quantities, delivery dates and GST before checkout on SKYCART." },
      { property: "og:title", content: "Your cart — SKYCART" },
      { property: "og:description", content: "Review quantities, delivery dates and GST before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, saved, totals, count, setQty, remove, saveForLater, moveToCart } = useCart();
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
        <div className="surface-card mt-4 flex flex-col gap-3 border-warning/40 bg-warning/10 p-4">
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

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          {detailed.map(({ product, qty }) => (
            <article key={product.id} className="surface-card flex gap-3 p-3">
              <Link to="/product/$id" params={{ id: product.id }} className="h-[88px] w-[88px] shrink-0">
                <ProductTile product={product} className="h-[88px] w-[88px]" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </p>
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="mt-0.5 line-clamp-2 block text-[14px] font-semibold leading-snug"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{product.specLine}</p>
                <div className="mt-1.5">
                  <DeliveryLine product={product} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-base font-bold">{inr(product.price * qty)}</span>
                  <span className="text-[12px] text-muted-foreground line-through">{inr(product.mrp * qty)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper qty={qty} onChange={(n) => setQty(product.id, n)} />
                  <div className="flex items-center gap-3">
                    <button onClick={() => saveForLater(product.id)} className="text-[12px] font-semibold text-primary">
                      Save for later
                    </button>
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="text-muted-foreground active:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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

        <section className="surface-card p-5">
          <h2 className="text-base font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{inr(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-semibold">{totals.allFree ? "Free delivery" : inr(totals.delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-display font-extrabold">{inr(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-1.5 text-[12px] text-muted-foreground">Includes {inr(totals.gstIncluded)} GST</p>
          {totals.savings > 0 ? (
            <p className="mt-2 text-[13px] font-semibold text-success">You save {inr(totals.savings)} on MRP</p>
          ) : null}
          <p className="mt-3 text-[12px] text-muted-foreground">GST invoice issued to your registered business details.</p>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-card px-4 pb-5 pt-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-extrabold leading-tight">{inr(totals.total)}</p>
            <p className="truncate text-[12px] text-muted-foreground">
              {count} item{count === 1 ? "" : "s"} · incl. GST
            </p>
          </div>
          <PillButton size="lg" onClick={() => navigate({ to: "/checkout" })}>
            Checkout →
          </PillButton>
        </div>
      </div>
    </div>
  );
}
