"use client";

import { useRef, useState, type DragEvent } from "react";
import { uploadFile } from "@/lib/admin/upload";
import { cn, formatBytes } from "@/lib/utils";
import { useToast } from "./ToastProvider";
import { ExternalIcon, FileIcon, Spinner, TrashIcon, UploadIcon } from "@/components/ui/icons";

type Resume = { url: string; name: string; size: number | null };

type Props = {
  defaultUrl: string | null;
  defaultName: string | null;
  defaultSize: number | null;
  error?: string;
  onChange?: () => void;
};

/** Résumé (PDF) field. Uploads to Storage immediately; URL + metadata are saved with the form. */
export function ResumeUpload({ defaultUrl, defaultName, defaultSize, error, onChange }: Props) {
  const [resume, setResume] = useState<Resume | null>(
    defaultUrl ? { url: defaultUrl, name: defaultName || "resume.pdf", size: defaultSize } : null,
  );
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();
  const isPlaceholderFile = Boolean(resume?.url.includes("resume-placeholder"));

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "resume", "pdf");
      setResume({ url, name: file.name.slice(0, 200), size: file.size });
      onChange?.();
      push("success", "Résumé uploaded — save to publish it.");
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
      <p className="mb-1.5 text-sm font-medium text-bone">Résumé (PDF)</p>
      <input type="hidden" name="resume_url" value={resume?.url ?? ""} />
      <input type="hidden" name="resume_file_name" value={resume?.name ?? ""} />
      <input type="hidden" name="resume_size_bytes" value={resume?.size ?? ""} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex items-center gap-4 rounded-2xl bg-ink-800 p-4 ring-1 ring-inset transition-colors",
          dragging ? "ring-2 ring-ember-500" : error ? "ring-red-400/70" : "ring-white/10",
        )}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-iris-500/15 text-iris-300">
          {uploading ? <Spinner /> : <FileIcon size={22} />}
        </span>
        <div className="min-w-0 flex-1">
          {resume ? (
            <>
              <p className="truncate text-sm font-medium text-bone">{resume.name}</p>
              <p className="text-xs text-smoke">
                {[formatBytes(resume.size), isPlaceholderFile ? "Placeholder file — upload the real résumé" : "Live on the site after saving"]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </>
          ) : (
            <p className="text-sm text-smoke">{uploading ? "Uploading…" : "No résumé yet. Drop a PDF here or upload one."}</p>
          )}
        </div>
        {resume && (
          <a href={resume.url} target="_blank" rel="noopener noreferrer" className="hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-mist hover:bg-white/10 hover:text-white sm:inline-flex">
            <ExternalIcon size={14} /> Open
          </a>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-bone hover:bg-white/15 disabled:opacity-50"
        >
          <UploadIcon size={14} /> {resume ? "Replace PDF" : "Upload PDF"}
        </button>
        {resume && (
          <button
            type="button"
            onClick={() => {
              setResume(null);
              onChange?.();
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
          >
            <TrashIcon size={14} /> Remove
          </button>
        )}
        <p className={cn("text-xs", error ? "text-red-300" : "text-smoke")}>{error ?? "PDF, up to 10 MB. Visitors can view or download it."}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
