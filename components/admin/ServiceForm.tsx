"use client";

import { saveService } from "@/lib/actions/admin/services";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import type { Service } from "@/lib/types";
import { FormSection, TextAreaField, TextField, ToggleField } from "./fields";
import { ImageUpload } from "./ImageUpload";
import { SaveBar } from "./SaveBar";

export function ServiceForm({ service }: { service?: Service }) {
  const { pending, onSubmit, err, markDirty } = useAdminForm(saveService);

  return (
    <form onSubmit={onSubmit} onChange={markDirty} noValidate>
      {service && <input type="hidden" name="id" value={service.id} />}

      <FormSection title="Service" description="Shown in the hero strip, the services list and the contact form's project types.">
        <TextField name="title" label="Name" required maxLength={120} defaultValue={service?.title} error={err("title")} />
        <TextField name="short_description" label="Tagline" maxLength={200} defaultValue={service?.short_description} error={err("short_description")} hint="A short line shown over the service image." />
        <TextAreaField name="description" label="Description" rows={4} maxLength={4000} defaultValue={service?.description} error={err("description")} />
        <TextAreaField
          name="deliverables"
          label="Deliverables"
          rows={4}
          maxLength={2000}
          defaultValue={service?.deliverables.join("\n")}
          error={err("deliverables")}
          hint="One per line (up to 20)."
        />
      </FormSection>

      <FormSection title="Image & visibility">
        <ImageUpload name="image_url" label="Service image" folder="services" aspect="portrait" defaultValue={service?.image_url} error={err("image_url")} onChange={markDirty} />
        <ToggleField name="is_published" label="Visible on website" defaultChecked={service?.is_published ?? true} />
        <TextField name="display_order" label="Display order" type="number" inputMode="numeric" defaultValue={service?.display_order ?? ""} error={err("display_order")} hint="Leave empty to add at the end." wrapperClassName="max-w-xs" />
      </FormSection>

      <SaveBar pending={pending} cancelHref="/admin/services" label={service ? "Save service" : "Create service"} />
    </form>
  );
}
