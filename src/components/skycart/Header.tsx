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
            <MapPin className="h-[22px] w-[22px] shrink-0 text-primary" />
            <span className="whitespace-nowrap"><span className="loc-city">Bengaluru </span>560103</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-surface-soft">
            <ShoppingCart className="h-[22px] w-[22px]" />
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

const ORDERS_BADGE = 1; // orders currently out for delivery

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav data-bottom-nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] px-4 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="nav-dock pointer-events-auto flex h-16 items-center gap-1 rounded-[32px] p-1.5">
        {mobileDestinations.map((destination) => {
          const active =
            destination.to === "/" ? pathname === "/" : pathname.startsWith(destination.to);
          const Icon = destination.icon;
          return (
            <Link
              key={destination.to}
              to={destination.to}
              search={destination.to === "/search" ? { q: "" } : {}}
              aria-current={active ? "page" : undefined}
              style={{ flexGrow: active ? 1.45 : 1, flexBasis: 0 }}
              className={cn(
                "nav-item flex h-[52px] min-w-0 flex-col items-center justify-center gap-[3px] rounded-[26px] text-[10px] leading-[13px]",
                active ? "bg-primary font-bold text-primary-foreground" : "font-semibold text-muted-foreground",
              )}
            >
              <span className="relative grid h-[22px] w-[22px] place-items-center">
                <Icon className="h-[22px] w-[22px]" />
                {destination.to === "/orders" && ORDERS_BADGE > 0 ? (
                  <span className="absolute -right-1.5 -top-1 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground ring-2 ring-card">
                    {ORDERS_BADGE}
                  </span>
                ) : null}
              </span>
              {destination.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
