"use client";

import Image from "next/image";
import { useState } from "react";

const REMOTE_FALLBACK =
  "https://images.unsplash.com/photo-1548036492-050b0f08d920?w=1400&q=80&auto=format&fit=crop";

export function AuthAsidePanel() {
  const [useRemote, setUseRemote] = useState(false);

  const src = useRemote ? REMOTE_FALLBACK : "/images/auth-panel.jpg";

  return (
    <div className="relative hidden md:block min-h-[280px] md:min-h-full lg:min-h-[480px] bg-stone overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover object-center"
        sizes="50vw"
        priority
        unoptimized={useRemote}
        onError={() => {
          if (!useRemote) setUseRemote(true);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
      <div className="absolute bottom-12 left-12 right-12 max-w-md z-[1]">
        <p className="font-display text-paper text-3xl leading-snug">
          Crafted for commutes, dinners, and everything between.
        </p>
        <p className="mt-4 text-stone/90 text-sm leading-relaxed">
          Members get early access to drops and complimentary shipping above ₹2,499.
        </p>
      </div>
    </div>
  );
}
