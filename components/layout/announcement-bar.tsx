import { ANNOUNCEMENT } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper text-center text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-relaxed py-2 sm:py-2.5 px-3 sm:px-4">
      <span className="inline-block max-w-[90rem]">
        Complimentary shipping above ₹2,499
        <span className="hidden sm:inline"> · Crafted in small batches across India</span>
      </span>
    </div>
  );
}
