"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckoutAddressFields,
  type CheckoutContact,
} from "@/components/checkout/checkout-address-fields";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { authHeaders, useAuth } from "@/hooks/auth-context";
import { useCart } from "@/hooks/cart-context";

function isValidPin(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin);
}

const emptyContact = (email = "", fullName = ""): CheckoutContact => ({
  email,
  phone: "",
  fullName,
  address: "",
  city: "",
  state: "",
  pin: "",
});

export function CheckoutForm() {
  const { lines, subtotal, hydrated, clearCart } = useCart();
  const { user, status, token } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState<CheckoutContact>(emptyContact());
  const [saveAddress, setSaveAddress] = useState(true);
  const [usingSaved, setUsingSaved] = useState(false);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!user || !token) {
      setContact(emptyContact());
      setFormReady(true);
      return;
    }
    setContact((c) => ({ ...c, email: user.email, fullName: c.fullName || user.name }));
    fetch("/api/account/address", { headers: authHeaders(token) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.address) {
          setContact({
            email: user.email,
            phone: data.address.phone ?? "",
            fullName: data.address.fullName ?? user.name,
            address: data.address.address ?? "",
            city: data.address.city ?? "",
            state: data.address.state ?? "",
            pin: data.address.pin ?? "",
          });
          setUsingSaved(true);
        } else {
          setContact((c) => ({ ...c, email: user.email, fullName: c.fullName || user.name }));
        }
      })
      .finally(() => setFormReady(true));
  }, [user, status, token]);

  if (!hydrated || !formReady) {
    return <p className="container-kashu py-20 text-muted">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="container-kashu py-24 text-center">
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="mt-4 text-muted">Your bag is empty.</p>
        <Link href="/shop" className="inline-block mt-8 text-sm border-b border-ink">Shop now</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isValidPin(contact.pin)) {
      setError("Enter a valid 6-digit Indian PIN code.");
      return;
    }
    setPending(true);
    const payload = {
      email: contact.email,
      saveAddress: user ? saveAddress : false,
      items: lines.map((l) => ({
        productId: l.productId,
        slug: l.slug,
        name: l.name,
        priceInr: l.priceInr,
        quantity: l.quantity,
        image: l.image,
      })),
      address: {
        fullName: contact.fullName,
        address: contact.address,
        city: contact.city,
        state: contact.state,
        pin: contact.pin,
        phone: contact.phone,
      },
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "Could not place order. Try again.");
      return;
    }

    const orderNumber = data.order?.orderNumber ?? "";
    clearCart();
    router.push(`/checkout/success?order=${orderNumber}`);
  }

  return (
    <div className="container-kashu py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-2">Checkout</h1>
        {status !== "loading" && (
          <p className="text-muted text-sm mb-10">
            {user
              ? usingSaved
                ? `Signed in as ${user.name}. Your saved address is prefilled below.`
                : `Signed in as ${user.name}. Complete your address once — we can save it for next time.`
              : (
                <>
                  Checking out as guest.{" "}
                  <Link href="/login?next=/checkout" className="text-ink border-b border-accent/50">
                    Sign in
                  </Link>{" "}
                  to save your address for faster checkout.
                </>
              )}
          </p>
        )}

        <form onSubmit={onSubmit} className="grid lg:grid-cols-5 gap-8 lg:gap-14">
          <div className="lg:col-span-3 space-y-8 sm:space-y-10 order-2 lg:order-1">
            <CheckoutAddressFields
              values={contact}
              onChange={(patch) => {
                setUsingSaved(false);
                setContact((c) => ({ ...c, ...patch }));
              }}
              saveAddress={saveAddress}
              onSaveAddressChange={setSaveAddress}
              showSaveOption={!!user}
              usingSaved={usingSaved}
            />

            <section>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted mb-4">Delivery</h2>
              <label className="flex items-center gap-3 border border-line p-4 cursor-pointer bg-paper">
                <input type="radio" name="delivery" defaultChecked className="accent-accent" />
                <span className="text-sm">Standard (5–7 business days) — included</span>
              </label>
            </section>

            <section>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted mb-4">Payment</h2>
              <div className="border border-accent bg-stone/30 p-4 flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked
                  readOnly
                  className="accent-accent mt-0.5"
                  aria-label="Cash on delivery"
                />
                <div>
                  <p className="text-sm text-ink">Cash on delivery</p>
                  <p className="text-xs text-muted mt-1">
                    Pay in cash when your order arrives. Please keep exact change ready where possible.
                  </p>
                </div>
              </div>
            </section>

            {error && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full md:w-auto min-w-[200px] h-12 px-10 bg-ink text-paper text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {pending ? "Placing order…" : "Place order"}
            </button>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <CheckoutSummary lines={lines} subtotal={subtotal} />
            <Link href="/cart" className="inline-block mt-6 text-sm text-muted hover:text-ink">
              ← Back to bag
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
