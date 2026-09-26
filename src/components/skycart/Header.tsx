import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Grid2x2, Home, MapPin, Package, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex shrink-0 items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[15px] font-bold text-primary-foreground">
        S
      </span>
      <span className="font-display text-[19px] font-extrabold tracking-tight">SKYCART</span>
    </Link>
  );
}

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Logo />
        <div className="flex min-w-0 items-center gap-1">
          <button className="flex min-w-0 items-center gap-1 rounded-full bg-surface-soft px-3 py-1.5 text-[12px] font-semibold active:bg-primary-container">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">560103 · Bengaluru</span>
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-surface-soft">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

const mobileDestinations = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: Grid2x2 },
  { to: "/search", label: "Search", icon: Search },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] pb-4">
      <div className="container-page">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-nav backdrop-blur">
          {mobileDestinations.map((destination) => {
            const active =
              destination.to === "/" ? pathname === "/" : pathname.startsWith(destination.to);
            const Icon = destination.icon;
            return (
              <Link
                key={destination.to}
                to={destination.to}
                search={destination.to === "/search" ? { q: "" } : {}}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-2 text-[11px] font-semibold transition-colors",
                  active ? "bg-primary-container text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {destination.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

