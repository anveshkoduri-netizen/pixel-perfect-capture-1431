import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Check, Heart, MapPin, PackageX, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { categoryBySlug, discount, inr, productById, products } from "@/lib/skycart-data";
import { productGallery } from "@/lib/product-images";
import {
  DeliveryLine,
  PriceBlock,
  ProductCard,
  ProductTile,
  Rating,
  StockLine,
} from "@/components/skycart/ProductCard";
import { Badge, EmptyState, PillButton, QuantityStepper, SectionHeader } from "@/components/skycart/primitives";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = productById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — SKYCART" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const description = `${product.brand} ${product.name} — ${product.specLine}. ${inr(product.price)}, ${product.delivery.toLowerCase()} delivery. Specifications, compatibility and warranty on SKYCART.`;
    return {
      meta: [
        { title: `${product.brand} ${product.name} — SKYCART` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.brand} ${product.name} — SKYCART` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

const pincodes: Record<string, boolean> = { "560103": true, "400072": true, "110020": true, "797001": false };

function ProductPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const { add, markViewed, toggleWishlist, wishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("560103");
  const [checkedPincode, setCheckedPincode] = useState<string | null>("560103");
  const wished = wishlist.includes(product.id);

  useEffect(() => {
    markViewed(product.id);
    setQty(1);
    setActiveImage(0);
  }, [product.id, markViewed]);

  const gallery = productGallery(product.id);
  const glanceStats = product.glanceStats ?? product.specs.slice(0, 4).map((x) => ({ value: x.value, label: x.label }));
  const variants = product.variant ? products.filter((x) => x.variant?.group === product.variant?.group) : [];
  const deliverable = checkedPincode ? pincodes[checkedPincode] !== false : true;
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const alsoViewed = products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4);

  const addToCart = () => {
    add(product.id, qty);
    toast.success(`${qty} added to cart`, { description: `${product.brand} · ${product.name}` });
  };

  return (
    <div className="container-page pt-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-primary">
          {categoryBySlug(product.category)?.name ?? product.category}
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      {product.stock === "out" ? (
        <div className="surface-card mt-4 flex flex-col gap-3 border-warning/40 bg-warning/10 p-4 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
            <span>
              <span className="font-semibold">This product is out of stock.</span> We can notify you when it's back,
              or show similar products available now.
            </span>
          </p>
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => navigate({ to: "/category/$slug", params: { slug: product.category } })}
          >
            Show similar available products
          </PillButton>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-5 [&_section.mt-5]:mt-0 [&>div>.mt-5]:mt-0">
        <div className="contents">
          <div className="surface-card order-[-2] p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-soft">
              {gallery[activeImage] ? (
                <img
                  src={gallery[activeImage].src}
                  alt={`${product.brand} ${product.name} — ${gallery[activeImage].label}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductTile product={product} className="h-full w-full" />
              )}
              <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                {(product.callouts ?? product.specs.slice(0, 3).map((x) => x.value)).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[11px] font-bold shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {gallery.length > 1 ? (
              <div className="mt-3 flex gap-2">
                {gallery.map((view, index) => (
                  <button
                    key={view.label}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View ${view.label}`}
                    className={cn(
                      "h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors",
                      activeImage === index ? "border-primary" : "border-transparent",
                    )}
                  >
                    <img src={view.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <section className="surface-card mt-5 p-5">
            <h2 className="text-lg font-bold">At a glance</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {glanceStats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-surface-soft p-3.5">
                  <p className="font-mono text-[26px] font-bold leading-none tracking-tight">{stat.value}</p>
                  <p className="mt-1.5 text-[12px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {product.glance.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="surface-card mt-5 p-5">
            <h2 className="text-lg font-bold">Specifications</h2>
            <dl className="mt-3 divide-y divide-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-4 py-2.5">
                  <dt className="text-[13px] text-muted-foreground">{spec.label}</dt>
                  <dd className="text-[13px] font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className="surface-card p-5">
              <h2 className="text-base font-bold">Compatibility</h2>
              <ul className="mt-3 space-y-2">
                {product.compatibility.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="surface-card p-5">
              <h2 className="text-base font-bold">What's included</h2>
              <ul className="mt-3 space-y-2">
                {product.included.map((item) => (
                  <li key={item} className="text-[13px] text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="surface-card mt-5 flex items-start gap-3 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-base font-bold">Warranty</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{product.warranty}</p>
            </div>
          </section>

          <section className="surface-card mt-5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Reviews</h2>
              <div className="flex items-center gap-2">
                <Rating product={product} />
                <Badge tone="primary">Verified buyers</Badge>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {[
                {
                  name: "Ramesh K., electrical contractor",
                  text: "Specs matched the listing exactly. Delivered to site on the promised date.",
                },
                {
                  name: "Sana P., facility manager",
                  text: "Bought in bulk for maintenance. GST invoice came through the same day.",
                },
              ].map((review) => (
                <div key={review.name} className="rounded-xl bg-surface-soft p-4">
                  <p className="text-[13px] font-semibold">{review.name}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card mt-5 p-5">
            <h2 className="text-lg font-bold">Delivery information</h2>
            <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
              <li>Dispatched from the nearest fulfilment centre after payment confirmation.</li>
              <li>Site deliveries accepted between 9 am and 7 pm; call before delivery on request.</li>
              <li>Bulk quantities are palletised and may arrive in multiple consignments.</li>
            </ul>
          </section>
        </div>

        <div className="order-[-1]">
          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1.5 text-[22px] font-extrabold leading-tight">{product.name}</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">{product.specLine}</p>
            {product.variant && variants.length > 1 ? (
              <div className="mt-4">
                <p className="text-[13px] font-semibold">
                  {product.variant.axis}: <span className="text-muted-foreground">{product.variant.label}</span>
                </p>
                <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1">
                  {variants.map((v) => {
                    const selected = v.id === product.id;
                    const out = v.stock === "out";
                    return (
                      <button
                        key={v.id}
                        disabled={out}
                        aria-pressed={selected}
                        onClick={() => navigate({ to: "/product/$id", params: { id: v.id }, replace: true, resetScroll: false })}
                        className={cn(
                          "flex shrink-0 flex-col items-start rounded-xl border px-3.5 py-2 text-left transition-colors",
                          selected ? "border-primary bg-primary-container" : "border-border bg-card",
                          out && "opacity-50",
                        )}
                      >
                        <span className={cn("text-[13px] font-bold", selected && "text-primary")}>{v.variant?.label}</span>
                        <span className="text-[12px] text-muted-foreground">{out ? "Out of stock" : inr(v.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating product={product} />
              <StockLine product={product} />
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <PriceBlock product={product} size="lg" />
              <p className="mt-1 text-[12px] text-muted-foreground">
                Inclusive of GST · you save {inr(product.mrp - product.price)} ({discount(product)}%)
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-surface-soft p-3.5">
              <DeliveryLine product={product} />
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-3.5">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    aria-label="Delivery pincode"
                    placeholder="Pincode"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <PillButton size="sm" variant="secondary" onClick={() => setCheckedPincode(pincode)}>
                  Check
                </PillButton>
              </div>
              {checkedPincode && !deliverable ? (
                <p className="mt-2.5 text-[13px] text-destructive">
                  We can't deliver this product to {checkedPincode} yet. Try 560103, or pick up from the Bengaluru
                  counter.
                </p>
              ) : checkedPincode ? (
                <p className="mt-2.5 text-[13px] text-success">
                  Delivers to {checkedPincode} · {product.delivery.toLowerCase()}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold">Quantity</span>
              <QuantityStepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
            </div>

            <PurchaseDock product={product} qty={qty} setQty={setQty} onAdd={addToCart} disabled={product.stock === "out" || !deliverable} />
            <div className="mt-4 space-y-2.5">
              <PillButton
                data-purchase-cta
                className="w-full"
                size="lg"
                onClick={addToCart}
                disabled={product.stock === "out" || !deliverable}
              >
                Add to cart
              </PillButton>
              <PillButton
                variant="secondary"
                className="w-full"
                size="lg"
                disabled={product.stock === "out" || !deliverable}
                onClick={() => {
                  add(product.id, qty);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy now
              </PillButton>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
                {wished ? "Saved to wishlist" : "Save to wishlist"}
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-[12px] text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0" />
              Free returns within 7 days on unused items in original packaging.
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeader eyebrow="Same category" title="Related products" />
        {related.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageX}
            title="No related products yet"
            description="This is the only product we stock in this specification right now."
          />
        )}
      </section>

      <section className="mt-12">
        <SectionHeader eyebrow="Often bought together" title="Others also ordered" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {alsoViewed.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PurchaseDock({
  product,
  qty,
  setQty,
  onAdd,
  disabled,
}: {
  product: { id: string; name: string; price: number };
  qty: number;
  setQty: (n: number) => void;
  onAdd: () => void;
  disabled: boolean;
}) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector("[data-purchase-cta]");
      setShow(!!el && el.getBoundingClientRect().bottom < 56);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [product.id]);
  // Swap the bottom nav out while the purchase bar is visible.
  useEffect(() => {
    if (show) document.body.dataset["dock"] = "on";
    else delete document.body.dataset["dock"];
    return () => {
      delete document.body.dataset["dock"];
    };
  }, [show]);
  if (!mounted) return null;
  return createPortal(
    <div
      data-purchase-dock
       className={cn(
         "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-border bg-card p-4 transition-transform duration-200 motion-reduce:transition-none",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!show}
       inert={!show}
    >
       <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        <div className="min-w-0 flex-1">
           <p className="truncate font-display text-base font-extrabold leading-tight">{inr(product.price * qty)}</p>
           <p className="text-[11px] text-muted-foreground">incl. GST</p>
        </div>
        <QuantityStepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
         <PillButton size="sm" className="whitespace-nowrap px-3" onClick={onAdd} disabled={disabled}>
          Add to cart
        </PillButton>
      </div>
    </div>,
    document.body,
  );
}
