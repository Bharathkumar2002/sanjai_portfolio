"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page grid min-h-[70vh] place-items-center pt-28 text-center">
      <div className="max-w-md">
        <p className="text-sm font-medium text-ember-500">Something went wrong</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">This page didn&apos;t load.</h1>
        <p className="mt-4 text-mist">A temporary problem stopped the content from loading. Please try again in a moment.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-ember-500 px-6 py-3 text-sm font-medium text-white hover:bg-ember-600"
          >
            Try again
          </button>
          <Link href="/" className="rounded-full px-6 py-3 text-sm font-medium text-bone ring-1 ring-white/20 hover:bg-white/5">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
