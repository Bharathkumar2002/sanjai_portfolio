import Image from "next/image";
import type { Client } from "@/lib/types";
import { cn, isSvg } from "@/lib/utils";

/** Simple geometric glyphs used when a client has no uploaded logo yet. */
const glyphs = [
  <circle key="c" cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />,
  <path key="t" d="M3 4h14L10 11l7 5H3l7-5z" fill="currentColor" />,
  <g key="h"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" /></g>,
  <g key="p"><rect x="1.5" y="5" width="17" height="10" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="7" cy="10" r="3" fill="currentColor" /></g>,
  <path key="s" d="M10 2l2.2 5.8L18 10l-5.8 2.2L10 18l-2.2-5.8L2 10l5.8-2.2z" fill="currentColor" />,
  <g key="b"><rect x="3" y="3" width="6" height="6" rx="1.5" fill="currentColor" /><rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor" /><rect x="11" y="3" width="6" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /></g>,
];

function ClientMark({ client, index }: { client: Client; index: number }) {
  const content = client.logo_url ? (
    <Image
      src={client.logo_url}
      alt={client.name}
      width={140}
      height={40}
      unoptimized={isSvg(client.logo_url)}
      className="h-7 w-auto max-w-[8.5rem] object-contain opacity-70 brightness-0 invert transition-opacity group-hover:opacity-100"
    />
  ) : (
    <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white/75 transition-colors group-hover:text-white">
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        {glyphs[index % glyphs.length]}
      </svg>
      {client.name}
    </span>
  );

  return client.website_url ? (
    <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="group flex items-center" aria-label={client.name}>
      {content}
    </a>
  ) : (
    <span className="group flex items-center">{content}</span>
  );
}

export function ClientsStrip({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;
  const marquee = clients.length >= 4;

  return (
    <div className="flex flex-col gap-5 px-6 py-7 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-14">
      <h2 className="shrink-0 text-xs font-medium leading-snug text-white/60 lg:w-40">
        Trusted by brands I&apos;ve helped shape
      </h2>
      <div
        className={cn(
          "relative min-w-0 flex-1",
          marquee && "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        )}
      >
        <div className={cn("flex w-max items-center", marquee ? "animate-marquee hover:[animation-play-state:paused]" : "flex-wrap gap-x-12 gap-y-4")}>
          {(marquee ? [0, 1] : [0]).map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center gap-12 pr-12"
              aria-hidden={copy === 1 ? true : undefined}
              inert={copy === 1 ? true : undefined}
            >
              {clients.map((client, i) => (
                <li key={client.id}>
                  <ClientMark client={client} index={i} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
