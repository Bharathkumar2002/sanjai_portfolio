import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/20 blur-3xl" />
        <p className="font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-none tracking-[-0.07em] text-white">
          4<span className="text-ember-400">0</span>4
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
        <p className="mt-2 text-mist">It may have been moved, unpublished or never designed at all.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink-950 hover:bg-white">
            Back home
          </Link>
          <Link href="/#work" className="rounded-full px-6 py-3 text-sm font-medium text-bone ring-1 ring-white/20 hover:bg-white/5">
            View work
          </Link>
        </div>
      </div>
    </main>
  );
}
