"use client";

import { useState } from "react";
import { saveProject } from "@/lib/actions/admin/projects";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import { PROJECT_CATEGORIES } from "@/lib/data/defaults";
import type { ProjectWithImages } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { FormSection, TextAreaField, TextField, ToggleField } from "./fields";
import { GalleryManager } from "./GalleryManager";
import { ImageUpload } from "./ImageUpload";
import { SaveBar } from "./SaveBar";

export function ProjectForm({ project, categories }: { project?: ProjectWithImages; categories: string[] }) {
  const { pending, onSubmit, err, markDirty } = useAdminForm(saveProject);
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const suggestions = Array.from(new Set([...PROJECT_CATEGORIES, ...categories]));

  return (
    <form onSubmit={onSubmit} onChange={markDirty} noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      <FormSection title="Basics" description="How the project appears in grids and search results.">
        <TextField
          name="title"
          label="Title"
          required
          maxLength={160}
          defaultValue={project?.title}
          error={err("title")}
          onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="slug"
            label="URL slug"
            maxLength={120}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
            }}
            hint={`/projects/${slug || "…"}`}
            error={err("slug")}
          />
          <div>
            <TextField
              name="category"
              label="Category"
              required
              maxLength={60}
              list="category-options"
              defaultValue={project?.category}
              error={err("category")}
              hint="Pick a suggestion or type a new category."
            />
            <datalist id="category-options">
              {suggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="client_name" label="Client (optional)" maxLength={120} defaultValue={project?.client_name ?? ""} error={err("client_name")} />
          <TextField name="project_year" label="Year" type="number" inputMode="numeric" min={1950} max={2100} defaultValue={project?.project_year ?? new Date().getFullYear()} error={err("project_year")} />
        </div>
        <TextAreaField
          name="short_description"
          label="Short description"
          rows={2}
          maxLength={320}
          defaultValue={project?.short_description}
          error={err("short_description")}
          hint="One or two sentences shown on project cards."
        />
      </FormSection>

      <FormSection title="Images" description="The cover appears on cards and at the top of the case study.">
        <ImageUpload name="cover_image" label="Cover image" folder="projects" defaultValue={project?.cover_image} error={err("cover_image")} onChange={markDirty} hint="Landscape, at least 2000px wide works best." />
        <GalleryManager initial={project?.project_images ?? []} error={err("gallery")} onChange={markDirty} />
      </FormSection>

      <FormSection title="Case study" description="Separate paragraphs with a blank line. Empty sections are hidden.">
        <TextAreaField name="description" label="Overview" rows={5} maxLength={10000} defaultValue={project?.description} error={err("description")} />
        <TextAreaField name="design_process" label="Design process" rows={5} maxLength={10000} defaultValue={project?.design_process} error={err("design_process")} />
        <TextAreaField name="challenges" label="Creative challenges" rows={4} maxLength={10000} defaultValue={project?.challenges} error={err("challenges")} />
        <TextAreaField name="outcome" label="Final outcome" rows={4} maxLength={10000} defaultValue={project?.outcome} error={err("outcome")} />
      </FormSection>

      <FormSection title="Visibility" description="Control where and whether this project appears.">
        <ToggleField name="is_published" label="Published" description="Visible on the public website." defaultChecked={project?.is_published ?? false} />
        <ToggleField name="is_featured" label="Featured" description="Shown in Featured Projects on the home page (up to 5)." defaultChecked={project?.is_featured ?? false} />
        <TextField
          name="display_order"
          label="Display order"
          type="number"
          inputMode="numeric"
          defaultValue={project?.display_order ?? ""}
          error={err("display_order")}
          hint="Lower numbers appear first. Leave empty to add at the end. You can also reorder from the list."
          wrapperClassName="max-w-xs"
        />
      </FormSection>

      <SaveBar pending={pending} cancelHref="/admin/projects" label={project ? "Save project" : "Create project"} />
    </form>
  );
}
