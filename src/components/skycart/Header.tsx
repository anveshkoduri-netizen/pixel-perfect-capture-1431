import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Grid2x2, Home, MapPin, Package, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/skycart-data";
import { SearchField } from "./SearchField";

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
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-page">
        <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-[68px] lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          <Logo />
          <div className="hidden lg:block">
            <SearchField />
          </div>
          <nav className="flex shrink-0 items-center gap-1">
            <button className="hidden items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] hover:bg-surface-soft md:flex">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="leading-tight">
                <span className="block text-[11px] text-muted-foreground">Deliver to</span>
                <span className="block font-semibold">560103 · Bengaluru</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <Link
              to="/orders"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-soft md:flex"
            >
              <Package className="h-4 w-4 text-muted-foreground" /> Orders
            </Link>
            <Link
              to="/account"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-soft md:flex"
            >
              <User className="h-4 w-4 text-muted-foreground" /> Account
            </Link>
            <Link
              to="/search"
              search={{ q: "" }}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-soft lg:hidden"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full border border-border-strong px-3.5 py-2 text-sm font-semibold hover:bg-surface-soft"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2">
            <Link
              to="/categories"
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-foreground hover:bg-surface-soft"
            >
              <Grid2x2 className="h-3.5 w-3.5" /> All categories
            </Link>
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.slug}
                to="/category/$slug"
                params={{ slug: category.slug }}
                activeProps={{ className: "bg-primary-container text-primary-container-foreground" }}
                className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
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

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-[13px] text-muted-foreground">
            Industrial and business supplies with specifications, availability and delivery information upfront.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[13px] sm:grid-cols-3">
          {["Electrical", "Lighting", "Plumbing", "Power Tools", "Safety", "Fasteners"].map((label) => (
            <span key={label} className="text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="container-page pb-10 pt-2 text-[12px] text-muted-foreground md:pb-6">
        GST invoices on every order · Ships across India
      </div>
    </footer>
  );
}
