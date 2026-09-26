import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Check, CreditCard, Landmark, Smartphone, Truck, Wallet } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/skycart-data";
import { Logo } from "@/components/skycart/Header";
import { PillButton } from "@/components/skycart/primitives";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SKYCART" },
      { name: "description", content: "Confirm address, delivery method and payment for your SKYCART order." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout — SKYCART" },
      { property: "og:description", content: "Confirm address, delivery and payment." },
    ],
  }),
  component: CheckoutPage,
});

const steps = ["Address", "Delivery & Payment", "Done"] as const;

const addresses = [
  {
    id: "site",
    label: "Site office",
    lines: "Plot 14, Bommasandra Industrial Area, Bengaluru 560103",
    phone: "+91 98450 11223",
  },
  {
    id: "warehouse",
    label: "Warehouse",
    lines: "Shed 6, Peenya 2nd Stage, Bengaluru 560058",
    phone: "+91 98450 44556",
  },
];

const payments = [
  { id: "upi", label: "UPI", note: "Pay with any UPI app", icon: Smartphone },
  { id: "card", label: "Card", note: "Credit or debit card", icon: CreditCard },
  { id: "credit", label: "Business credit", note: "30-day terms · ₹2,00,000 available", icon: Landmark },
  { id: "cod", label: "Pay on delivery", note: "Available for this pincode", icon: Wallet },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { detailed, totals, clear } = useCart();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("site");
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5");
  const [errors, setErrors] = useState<string[]>([]);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const deliveryFee = delivery === "express" ? 249 : totals.delivery;
  const total = totals.subtotal + totals.gst + deliveryFee;

  const validateAddress = () => {
    const issues: string[] = [];
    if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(gstin.toUpperCase())) {
      issues.push("GSTIN doesn't look valid — check the 15-character format, or leave it blank.");
    }
    setErrors(issues);
    if (issues.length === 0) setStep(1);
  };

  const pay = () => {
    if (payment === "card") {
      setPaymentFailed(true);
      return;
    }
    setPaymentFailed(false);
    clear();
    setStep(2);
  };

  if (detailed.length === 0 && step < 2) {
    return (
      <div className="container-page flex min-h-screen flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-extrabold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add products to your cart to continue.</p>
        <PillButton className="mt-5" onClick={() => navigate({ to: "/" })}>
          Go to home
        </PillButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <p className="hidden text-[13px] font-medium text-muted-foreground sm:block">Secure checkout</p>
          <Link to="/cart" className="flex items-center gap-1.5 text-[13px] font-semibold hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>
        </div>
      </header>

      <div className="container-page py-8">
        <ol className="flex items-center gap-3">
          {steps.map((label, index) => (
            <li key={label} className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold",
                  index < step
                    ? "bg-primary text-primary-foreground"
                    : index === step
                      ? "bg-primary-container text-primary"
                      : "bg-surface-soft text-muted-foreground",
                )}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[13px] font-semibold",
                  index === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {index < steps.length - 1 ? <span className="hidden h-px w-10 bg-border sm:block" /> : null}
            </li>
          ))}
        </ol>

        {step === 2 ? (
          <div className="surface-card mx-auto mt-8 max-w-xl p-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/12 text-success">
              <Check className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Order placed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Order SKY-48213 is confirmed. You'll get delivery updates on +91 98450 11223 and the GST invoice by
              email.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <PillButton onClick={() => navigate({ to: "/orders" })}>View order</PillButton>
              <PillButton variant="secondary" onClick={() => navigate({ to: "/" })}>
                Continue shopping
              </PillButton>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_368px]">
            <div className="space-y-5">
              {step === 0 ? (
                <section className="surface-card p-5">
                  <h2 className="text-lg font-bold">Delivery address</h2>
                  <div className="mt-4 space-y-3">
                    {addresses.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setAddress(entry.id)}
                        className={cn(
                          "w-full rounded-xl border p-4 text-left transition-colors",
                          address === entry.id
                            ? "border-primary bg-primary-container/60"
                            : "border-border hover:border-border-strong",
                        )}
                      >
                        <p className="text-sm font-bold">{entry.label}</p>
                        <p className="mt-1 text-[13px] text-muted-foreground">{entry.lines}</p>
                        <p className="mt-1 text-[13px] text-muted-foreground">{entry.phone}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="gstin" className="eyebrow">
                      GSTIN (optional)
                    </label>
                    <input
                      id="gstin"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="mt-2 h-11 w-full rounded-full border border-border-strong bg-card px-4 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {errors.length > 0 ? (
                    <div className="mt-4 rounded-xl bg-destructive/8 p-3.5">
                      {errors.map((message) => (
                        <p key={message} className="flex items-start gap-2 text-[13px] text-destructive">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                          {message}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  <PillButton className="mt-5 w-full sm:w-auto" size="lg" onClick={validateAddress}>
                    Continue to delivery
                  </PillButton>
                </section>
              ) : (
                <>
                  <section className="surface-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-bold">Delivery method</h2>
                      <button onClick={() => setStep(0)} className="text-[13px] font-semibold text-primary">
                        Change address
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        { id: "standard", label: "Standard delivery", note: "Tomorrow, 9 am – 7 pm", fee: totals.delivery },
                        { id: "express", label: "Express delivery", note: "Today before 9 pm", fee: 249 },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setDelivery(option.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
                            delivery === option.id
                              ? "border-primary bg-primary-container/60"
                              : "border-border hover:border-border-strong",
                          )}
                        >
                          <span className="flex items-start gap-3">
                            <Truck className="mt-0.5 h-4 w-4 text-primary" />
                            <span>
                              <span className="block text-sm font-bold">{option.label}</span>
                              <span className="block text-[13px] text-muted-foreground">{option.note}</span>
                            </span>
                          </span>
                          <span className="text-sm font-semibold">{option.fee === 0 ? "Free" : inr(option.fee)}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="surface-card p-5">
                    <h2 className="text-lg font-bold">Payment method</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {payments.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setPayment(option.id);
                              setPaymentFailed(false);
                            }}
                            className={cn(
                              "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                              payment === option.id
                                ? "border-primary bg-primary-container/60"
                                : "border-border hover:border-border-strong",
                            )}
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>
                              <span className="block text-sm font-bold">{option.label}</span>
                              <span className="block text-[13px] text-muted-foreground">{option.note}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {paymentFailed ? (
                      <div className="mt-4 rounded-xl bg-destructive/8 p-4">
                        <p className="flex items-start gap-2 text-[13px] text-destructive">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>
                            <span className="font-semibold">The card payment was declined.</span> Nothing was charged
                            and your order is still here. Try UPI or business credit.
                          </span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <PillButton size="sm" onClick={() => setPayment("upi")}>
                            Pay by UPI
                          </PillButton>
                          <PillButton size="sm" variant="secondary" onClick={() => setPayment("credit")}>
                            Use business credit
                          </PillButton>
                        </div>
                      </div>
                    ) : null}
                  </section>
                </>
              )}
            </div>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="surface-card p-5">
                <h2 className="text-base font-bold">Order summary</h2>
                <ul className="mt-3 space-y-2">
                  {detailed.map(({ product, qty }) => (
                    <li key={product.id} className="flex justify-between gap-3 text-[13px]">
                      <span className="min-w-0 truncate text-muted-foreground">
                        {qty} × {product.name}
                      </span>
                      <span className="shrink-0 font-semibold">{inr(product.price * qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-semibold">{inr(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="font-semibold">{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">GST (18%)</dt>
                    <dd className="font-semibold">{inr(totals.gst)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base">
                    <dt className="font-bold">Total</dt>
                    <dd className="font-display font-extrabold">{inr(total)}</dd>
                  </div>
                </dl>
                {step === 1 ? (
                  <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-card px-4 pb-5 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Total incl. GST</p>
                        <p className="font-display text-lg font-extrabold">{inr(total)}</p>
                      </div>
                      <PillButton className="flex-1" size="lg" onClick={pay}>
                        Pay {inr(total)}
                      </PillButton>
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
