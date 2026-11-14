"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage, validateUpload } from "@/lib/admin/upload";
import { useToast } from "./ToastProvider";
import { inputClass } from "./fields";
import { ChevronDown, ChevronUp, PlusIcon, Spinner, TrashIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Item = { key: string; image_url: string; alt_text: string; caption: string };
type Initial = { image_url: string; alt_text: string; caption: string | null };

const MAX_IMAGES = 40;

/** Manages a project's gallery. Serialised as JSON into the `gallery` form field. */
export function GalleryManager({ initial, error, onChange }: { initial: Initial[]; error?: string; onChange?: () => void }) {
  const [items, setItems] = useState<Item[]>(() =>
    initial.map((img, i) => ({ key: `i${i}`, image_url: img.image_url, alt_text: img.alt_text, caption: img.caption ?? "" })),
  );
  const [pending, setPending] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const update = (next: Item[]) => {
    setItems(next);
    onChange?.();
  };

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, MAX_IMAGES - items.length);
    const valid = list.filter((f) => {
      const problem = validateUpload(f, "image");
      if (problem) push("error", problem);
      return !problem;
    });
    setPending((p) => p + valid.length);
    await Promise.all(
      valid.map(async (file) => {
        try {
          const url = await uploadImage(file, "projects");
          const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
          setItems((prev) => [...prev, { key: crypto.randomUUID(), image_url: url, alt_text: alt, caption: "" }]);
          onChange?.();
        } catch (e) {
          push("error", e instanceof Error ? e.message : "Upload failed.");
        } finally {
          setPending((p) => p - 1);
        }
      }),
    );
    if (inputRef.current) inputRef.current.value = "";
  }

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const edit = (index: number, field: "alt_text" | "caption", value: string) =>
    update(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));

  const serialised = JSON.stringify(items.map(({ image_url, alt_text, caption }) => ({ image_url, alt_text, caption })));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-bone">Gallery images</p>
          <p className="text-xs text-smoke">
            {items.length} / {MAX_IMAGES} · shown in this order on the project page. Alt text helps accessibility and SEO.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={items.length >= MAX_IMAGES}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-medium text-bone hover:bg-white/15 disabled:opacity-50"
        >
          <PlusIcon size={14} /> Add images
        </button>
      </div>
      <input type="hidden" name="gallery" value={serialised} />
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void addFiles(e.target.files)}
      />

      {items.length === 0 && pending === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed px-6 py-10 text-sm text-smoke hover:text-bone",
            error ? "border-red-400/60" : "border-white/15",
          )}
        >
          <PlusIcon size={22} />
          Upload images to build the case study
        </button>
      ) : (
        <ol className="space-y-3">
          {items.map((item, i) => (
            <li key={item.key} className="flex gap-3 rounded-2xl bg-ink-800/60 p-3 ring-1 ring-inset ring-white/5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-ink-700 sm:size-24">
                <Image src={item.image_url} alt="" fill unoptimized sizes="96px" className="object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 text-[10px] text-white">{i + 1}</span>
              </div>
              <div className="grid min-w-0 flex-1 gap-2">
                <input
                  aria-label={`Alt text for image ${i + 1}`}
                  placeholder="Alt text — describe the image"
                  value={item.alt_text}
                  maxLength={300}
                  onChange={(e) => edit(i, "alt_text", e.target.value)}
                  className={cn(inputClass, "py-2")}
                />
                <input
                  aria-label={`Caption for image ${i + 1}`}
                  placeholder="Caption (optional)"
                  value={item.caption}
                  maxLength={300}
                  onChange={(e) => edit(i, "caption", e.target.value)}
                  className={cn(inputClass, "py-2")}
                />
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} up`} className="grid size-8 place-items-center rounded-lg text-mist hover:bg-white/10 hover:text-white disabled:opacity-30">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move image ${i + 1} down`} className="grid size-8 place-items-center rounded-lg text-mist hover:bg-white/10 hover:text-white disabled:opacity-30">
                  <ChevronDown size={16} />
                </button>
                <button type="button" onClick={() => update(items.filter((_, j) => j !== i))} aria-label={`Remove image ${i + 1}`} className="grid size-8 place-items-center rounded-lg text-red-300 hover:bg-red-500/10">
                  <TrashIcon size={16} />
                </button>
              </div>
            </li>
          ))}
          {pending > 0 && (
            <li className="flex items-center gap-2 rounded-2xl bg-ink-800/60 p-4 text-sm text-mist">
              <Spinner /> Uploading {pending} image{pending > 1 ? "s" : ""}…
            </li>
          )}
        </ol>
      )}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
