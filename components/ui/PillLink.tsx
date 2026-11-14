import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

type Variant = "light" | "accent" | "outline" | "dark";

const styles: Record<Variant, { pill: string; dot: string }> = {
  light: { pill: "bg-bone text-ink-950 hover:bg-white", dot: "bg-ink-950 text-bone" },
  accent: { pill: "bg-ember-500 text-ink-950 hover:bg-ember-400", dot: "bg-ink-950 text-ember-400" },
  outline: {
    pill: "bg-white/5 text-bone ring-1 ring-inset ring-white/25 backdrop-blur-md hover:bg-white/10",
    dot: "bg-white/15 text-white",
  },
  dark: { pill: "bg-ink-950 text-bone hover:bg-black", dot: "bg-ember-500 text-ink-950" },
};

type Props = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
};

/** Rounded call-to-action pill with a circular arrow badge. */
export function PillLink({ children, variant = "light", size = "md", className, ...props }: Props) {
  const s = styles[variant];
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full font-medium transition-colors duration-300",
        size === "sm" && "py-1 pl-4 pr-1 text-[13px]",
        size === "md" && "py-1.5 pl-5 pr-1.5 text-sm",
        size === "lg" && "py-2 pl-6 pr-2 text-[15px]",
        s.pill,
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "grid place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-45",
          size === "sm" ? "size-7" : size === "md" ? "size-9" : "size-11",
          s.dot,
        )}
      >
        <ArrowUpRight size={size === "lg" ? 20 : 16} />
      </span>
    </Link>
  );
}
