import Link from "next/link";
import { Spinner } from "@/components/ui/icons";

export function SaveBar({ pending, cancelHref, label = "Save changes" }: { pending: boolean; cancelHref?: string; label?: string }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-white/[0.06] bg-ink-950/85 px-4 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <div className="flex items-center justify-end gap-3">
        {cancelHref && (
          <Link href={cancelHref} className="rounded-full px-4 py-2.5 text-sm font-medium text-mist hover:text-white">
            Cancel
          </Link>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-6 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-ember-400 disabled:opacity-60"
        >
          {pending && <Spinner size={16} />}
          {pending ? "Saving…" : label}
        </button>
      </div>
    </div>
  );
}
