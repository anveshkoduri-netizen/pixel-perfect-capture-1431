import { Link } from "@tanstack/react-router";
import {
  Bolt,
  BrickWall,
  Cable,
  Droplets,
  Factory,
  Fan,
  HardHat,
  Hammer,
  Lightbulb,
  Minus,
  PaintRoller,
  Plus,
  SprayCan,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/skycart-data";

export const categoryIcons: Record<CategorySlug, LucideIcon> = {
  electrical: Zap,
  "wires-cables": Cable,
  lighting: Lightbulb,
  plumbing: Droplets,
  hardware: Wrench,
  "power-tools": Bolt,
  "hand-tools": Hammer,
  safety: HardHat,
  "construction-supplies": BrickWall,
  "industrial-supplies": Factory,
  fasteners: Bolt,
  "paint-adhesives": PaintRoller,
  "pumps-motors": Fan,
  "cleaning-maintenance": SprayCan,
};

type PillProps = ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };

export function PillButton({ className, variant = "primary", size = "md", ...props }: PillProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]",
        size === "sm" && "h-9 px-4 text-[13px]",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-[15px]",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/92 shadow-[0_6px_18px_-10px_var(--primary)]",
        variant === "secondary" && "border border-border-strong bg-card text-foreground hover:bg-surface-soft",
        variant === "ghost" && "text-primary hover:bg-primary-container",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  children,
  selected,
  className,
  ...props
}: ComponentProps<"button"> & { selected?: boolean | undefined }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
        selected
          ? "border-primary bg-primary-container text-primary-container-foreground"
          : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        tone === "neutral" && "bg-surface-soft text-muted-foreground",
        tone === "primary" && "bg-primary-container text-primary-container-foreground",
        tone === "success" && "bg-success/12 text-success",
        tone === "warning" && "bg-warning/18 text-warning-foreground",
        tone === "danger" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  to,
}: {
  eyebrow?: string | undefined;
  title: string;
  action?: string | undefined;
  to?: string | undefined;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
        <h2 className="truncate text-xl font-bold md:text-[22px]">{title}</h2>
      </div>
      {action && to ? (
        <Link to={to} className="shrink-0 text-sm font-semibold text-primary hover:underline">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function QuantityStepper({
  qty,
  onChange,
  max = 99,
}: {
  qty: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-border-strong bg-card">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= max}
        onClick={() => onChange(qty + 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-container text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>
      {children ? <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
