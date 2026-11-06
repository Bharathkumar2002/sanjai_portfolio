import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Emphasis } from "./RichText";

type Props = {
  eyebrow: string;
  title: string;
  aside?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  titleId?: string;
};

export function SectionHeading({ eyebrow, title, aside, className, as: Tag = "h2", titleId }: Props) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <Reveal className="lg:col-span-7">
        <p className="mb-4 flex items-center gap-3 text-sm font-medium text-ember-500">
          <span className="h-px w-8 bg-ember-500/60" aria-hidden="true" />
          {eyebrow}
        </p>
        <Tag id={titleId} className="font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1] tracking-[-0.04em] text-balance">
          <Emphasis text={title} accentClassName="text-ember-400" />
        </Tag>
      </Reveal>
      {aside && (
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
