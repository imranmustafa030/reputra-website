import { offer, whatsappLink } from "@/content/site";
import { cn } from "@/lib/cn";

const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** The star motif: the one place gold appears besides the primary action. */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("shrink-0 text-[#F5B301]", className)} aria-hidden>
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span data-dummy="D24" className={cn("inline-flex items-center gap-[0.32em] font-semibold tracking-[-0.035em]", className)}>
      <Star className="size-[0.8em] translate-y-[-0.02em]" />
      reputra
    </span>
  );
}

/** The primary action, worded one way everywhere. Opens WhatsApp with the first message ready. */
export function StartButton({ size = "lg", className }: { size?: "lg" | "sm"; className?: string }) {
  return (
    <a
      href={whatsappLink(offer.firstMessage)}
      target="_blank"
      rel="noopener noreferrer"
      data-dummy="D10"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#F5B301] font-semibold tracking-[-0.01em] text-[#0B2545] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#FFC21F] active:scale-[0.98]",
        size === "lg" ? "h-[54px] px-7 text-[17px]" : "h-11 px-5 text-[14px]",
        className,
      )}
    >
      {offer.freeTrial}
      <span className="sr-only"> (opens WhatsApp)</span>
    </a>
  );
}

/** A quiet button for the secondary plans: plane fill, ink text. */
export function QuietButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-[54px] items-center justify-center rounded-full bg-[#ECECE9] px-7 text-[17px] font-semibold tracking-[-0.01em] text-[#0B2545] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#E2E2DE] active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </a>
  );
}
