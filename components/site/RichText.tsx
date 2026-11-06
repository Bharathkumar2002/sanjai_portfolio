import { Fragment } from "react";
import { cn, paragraphs } from "@/lib/utils";

/**
 * Renders headline markup typed by the admin:
 *   - a line break starts a new line
 *   - *words in asterisks* are set in the italic serif accent
 */
export function Emphasis({ text, accentClassName }: { text: string; accentClassName?: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
              <em
                key={pi}
                className={cn("font-serif font-normal italic tracking-[-0.01em]", accentClassName)}
              >
                {part.slice(1, -1)}
              </em>
            ) : (
              <Fragment key={pi}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}

/** Multi-paragraph body copy. */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paras = paragraphs(text);
  if (!paras.length) return null;
  return (
    <div className={cn("space-y-5", className)}>
      {paras.map((p, i) => (
        <p key={i} className="text-pretty whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
