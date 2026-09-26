import { Link } from "@tanstack/react-router";
import { Heart, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { discount, inr, type Product } from "@/lib/skycart-data";
import { Badge, PillButton, categoryIcons } from "./primitives";

export function ProductTile({ product, className }: { product: Product; className?: string }) {
  const Icon = categoryIcons[product.category];
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-lg bg-surface-soft",
        className,
      )}
    >
      <Icon className="h-1/3 w-1/3 text-primary/35" strokeWidth={1.2} />
      <span className="absolute bottom-2 left-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {product.brand.split(" ")[0]}
      </span>
    </div>
  );
}

export function PriceBlock({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn("font-display font-bold tracking-tight", size === "lg" ? "text-3xl" : "text-lg")}>
        {inr(product.price)}
      </span>
      <span className="text-[13px] text-muted-foreground line-through">{inr(product.mrp)}</span>
      <span className="text-[13px] font-semibold text-success">{discount(product)}% off</span>
      {product.unit ? <span className="text-xs text-muted-foreground">{product.unit}</span> : null}
    </div>
  );
}

export function StockLine({ product }: { product: Product }) {
  if (product.stock === "out") return <Badge tone="danger">Out of stock</Badge>;
  if (product.stock === "low") return <Badge tone="warning">Only a few left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}

export function DeliveryLine({ product }: { product: Product }) {
  return (
    <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
      <Truck className="h-3.5 w-3.5 shrink-0" />
      <span className="font-medium text-foreground">{product.delivery}</span>
      <span>·</span>
      <span>{product.freeDelivery ? "Free delivery" : "Delivery ₹99"}</span>
    </p>
  );
}

export function Rating({ product }: { product: Product }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px]">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="font-semibold">{product.rating}</span>
      <span className="text-muted-foreground">({product.reviews})</span>
    </span>
  );
}

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const { add, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);

  const addToCart = () => {
    add(product.id);
    toast.success("Added to cart", { description: `${product.brand} · ${product.name}` });
  };

  if (layout === "list") {
    return (
      <article className="surface-card group grid gap-4 p-4 sm:grid-cols-[168px_minmax(0,1fr)_auto]">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <ProductTile product={product} className="aspect-[4/3] w-full sm:h-full" />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="mt-1 block text-[15px] font-semibold leading-snug hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{product.specLine}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Rating product={product} />
            <StockLine product={product} />
          </div>
          <div className="mt-2">
            <DeliveryLine product={product} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <PriceBlock product={product} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Save to wishlist"
              onClick={() => toggleWishlist(product.id)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-primary"
            >
              <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
            </button>
            <PillButton onClick={addToCart} disabled={product.stock === "out"}>
              {product.stock === "out" ? "Notify me" : "Add to cart"}
            </PillButton>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="surface-card flex flex-col p-3 transition-shadow hover:shadow-raised">
      <div className="relative">
        <Link to="/product/$id" params={{ id: product.id }}>
          <ProductTile product={product} className="aspect-[4/3] w-full" />
        </Link>
        <button
          type="button"
          aria-label="Save to wishlist"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-border bg-card/90 text-muted-foreground backdrop-blur hover:text-primary"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="mt-3 min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 block text-sm font-semibold leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-[12px] text-muted-foreground">{product.specLine}</p>
        <div className="mt-2">
          <Rating product={product} />
        </div>
        <div className="mt-2.5">
          <PriceBlock product={product} />
        </div>
        <div className="mt-2 space-y-1.5">
          <DeliveryLine product={product} />
          <StockLine product={product} />
        </div>
      </div>
      <PillButton
        className="mt-3 w-full"
        size="sm"
        onClick={addToCart}
        disabled={product.stock === "out"}
      >
        {product.stock === "out" ? "Notify me" : "Add to cart"}
      </PillButton>
    </article>
  );
}
