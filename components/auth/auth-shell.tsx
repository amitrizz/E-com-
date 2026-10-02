import Link from "next/link";
import { AuthAsidePanel } from "@/components/auth/auth-aside-panel";
import { BRAND_NAME } from "@/lib/constants";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alternate?: { label: string; href: string; prompt: string };
};

export function AuthShell({ title, subtitle, children, alternate }: AuthShellProps) {
  return (
    <div className="min-h-[calc(100vh-10rem)] grid md:grid-cols-2 border-t border-line">
      <div className="flex flex-col justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24 lg:px-12 xl:px-20 bg-paper">
        <Link href="/" className="font-display text-2xl text-ink mb-12 lg:mb-16 inline-block w-fit">
          {BRAND_NAME}
        </Link>
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent mb-3">Account</p>
          <h1 className="font-display text-4xl md:text-[2.75rem] leading-tight text-ink">{title}</h1>
          <p className="mt-3 text-muted text-[15px] leading-relaxed">{subtitle}</p>
          <div className="mt-10 p-6 md:p-8 border border-line bg-paper shadow-[0_1px_0_rgba(17,17,17,0.04)]">
            {children}
          </div>
          {alternate && (
            <p className="mt-8 text-sm text-muted text-center lg:text-left">
              {alternate.prompt}{" "}
              <Link href={alternate.href} className="text-ink border-b border-accent/60 pb-0.5 hover:border-accent">
                {alternate.label}
              </Link>
            </p>
          )}
        </div>
      </div>
      <AuthAsidePanel />
    </div>
  );
}
