"use client";

import Image from "next/image";
import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { uploadImage, type MediaFolder } from "@/lib/admin/upload";
import { useToast } from "./ToastProvider";
import { ImageIcon, Spinner, TrashIcon, UploadIcon } from "@/components/ui/icons";

type Props = {
  name: string;
  label: string;
  folder: MediaFolder;
  defaultValue?: string | null;
  hint?: string;
  error?: string;
  aspect?: "video" | "square" | "portrait" | "logo";
  onChange?: () => void;
};

const aspectClass = {
  video: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  logo: "aspect-[3/1]",
};

/** Single image field. Uploads immediately; the URL is submitted with the form. */
export function ImageUpload({ name, label, folder, defaultValue, hint, error, aspect = "video", onChange }: Props) {
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const { push } = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      setUrl(await uploadImage(file, folder));
      onChange?.();
    } catch (e) {
      push("error", e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-sm font-medium text-bone">
        {label}
      </p>
      <input type="hidden" name={name} value={url ?? ""} />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-inset transition-colors",
          aspectClass[aspect],
          dragging ? "ring-2 ring-ember-500" : error ? "ring-red-400/70" : "ring-white/10",
        )}
      >
        {url ? (
          <Image src={url} alt="" fill unoptimized sizes="400px" className={cn(aspect === "logo" ? "object-contain p-6" : "object-cover")} />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-smoke hover:text-bone"
            aria-labelledby={`${id}-label`}
          >
            <ImageIcon size={28} />
            <span>Drop an image or click to upload</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/70 text-bone backdrop-blur-sm">
            <span className="flex items-center gap-2 text-sm">
              <Spinner /> Uploading…
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-bone hover:bg-white/15 disabled:opacity-50"
        >
          <UploadIcon size={14} /> {url ? "Replace" : "Upload"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => {
              setUrl(null);
              onChange?.();
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
          >
            <TrashIcon size={14} /> Remove
          </button>
        )}
        {(error || hint) && <p className={cn("text-xs", error ? "text-red-300" : "text-smoke")}>{error ?? hint}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
