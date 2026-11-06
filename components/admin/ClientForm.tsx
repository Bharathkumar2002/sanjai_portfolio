"use client";

import { saveClient } from "@/lib/actions/admin/clients";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import type { Client } from "@/lib/types";
import { FormSection, TextField, ToggleField } from "./fields";
import { ImageUpload } from "./ImageUpload";
import { SaveBar } from "./SaveBar";

export function ClientForm({ client }: { client?: Client }) {
  const { pending, onSubmit, err, markDirty } = useAdminForm(saveClient);

  return (
    <form onSubmit={onSubmit} onChange={markDirty} noValidate>
      {client && <input type="hidden" name="id" value={client.id} />}

      <FormSection title="Client" description="Only list brands you have genuinely worked with.">
        <TextField name="name" label="Name" required maxLength={120} defaultValue={client?.name} error={err("name")} />
        <TextField name="website_url" label="Website (optional)" type="url" placeholder="https://" maxLength={2048} defaultValue={client?.website_url ?? ""} error={err("website_url")} />
        <ImageUpload
          name="logo_url"
          label="Logo"
          folder="clients"
          aspect="logo"
          defaultValue={client?.logo_url}
          error={err("logo_url")}
          onChange={markDirty}
          hint="SVG or transparent PNG. It is shown in white on the site. Without a logo, the name is shown."
        />
      </FormSection>

      <FormSection title="Visibility">
        <ToggleField name="is_published" label="Visible on website" defaultChecked={client?.is_published ?? true} />
        <TextField name="display_order" label="Display order" type="number" inputMode="numeric" defaultValue={client?.display_order ?? ""} error={err("display_order")} hint="Leave empty to add at the end." wrapperClassName="max-w-xs" />
      </FormSection>

      <SaveBar pending={pending} cancelHref="/admin/clients" label={client ? "Save client" : "Add client"} />
    </form>
  );
}
