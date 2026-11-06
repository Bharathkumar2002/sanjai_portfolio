-- =============================================================================
-- replace_project_images(): atomically replaces a project's gallery.
-- SECURITY INVOKER, so the caller's RLS policies still apply; the explicit
-- admin check gives a clear error instead of a silent no-op.
-- =============================================================================
create or replace function public.replace_project_images(p_project_id uuid, p_images jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if jsonb_typeof(coalesce(p_images, '[]'::jsonb)) <> 'array' then
    raise exception 'invalid_images' using errcode = '22023';
  end if;
  if jsonb_array_length(coalesce(p_images, '[]'::jsonb)) > 40 then
    raise exception 'too_many_images' using errcode = '22023';
  end if;

  delete from public.project_images where project_id = p_project_id;

  insert into public.project_images (project_id, image_url, alt_text, caption, display_order)
  select
    p_project_id,
    e.item ->> 'image_url',
    coalesce(e.item ->> 'alt_text', ''),
    nullif(e.item ->> 'caption', ''),
    e.ord::integer
  from jsonb_array_elements(coalesce(p_images, '[]'::jsonb)) with ordinality as e(item, ord);
end;
$$;

revoke all on function public.replace_project_images(uuid, jsonb) from public;
grant execute on function public.replace_project_images(uuid, jsonb) to authenticated;
