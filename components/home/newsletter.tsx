"use client";

import { useState } from "react";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  return (
    <section className="border-t border-line bg-stone/50">
      <div className="container-kashu py-20 md:py-28 grid md:grid-cols-2 gap-10 items-end">
        <div>
          <h2 className="font-display text-4xl md:text-5xl text-ink">The Kashu letter</h2>
          <p className="mt-4 text-muted max-w-md">
            Restocks, atelier stories, and early access to small-batch drops. No spam—unsubscribe
            anytime.
          </p>
        </div>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("loading");
            setTimeout(() => setStatus("done"), 600);
          }}
        >
          <input type="text" name="_honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
          <label className="sr-only" htmlFor="newsletter-email">Email</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 h-12 border border-line bg-paper px-4 text-sm outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={status !== "idle"}
            className="h-12 px-8 bg-ink text-paper text-sm disabled:opacity-60"
          >
            {status === "done" ? "Subscribed" : status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
