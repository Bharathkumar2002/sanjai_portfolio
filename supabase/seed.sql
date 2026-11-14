-- =============================================================================
-- Placeholder seed content (fictional brands). GENERATED FILE — do not edit.
-- Source: content/placeholder-content.json  ·  Regenerate: npm run db:seed
-- Safe to run more than once: existing rows are left untouched.
-- =============================================================================

update public.site_settings set
  brand_name = '[Your Name]',
  designer_name = '[Your Name]',
  role_title = 'Graphic Designer',
  workplace = 'Canto',
  hero_greeting = 'Hi, I''m',
  hero_headline = 'Designing bold visuals that *people remember.*',
  hero_tagline = '',
  hero_intro = 'I''m a graphic designer creating product posters, social campaigns and brand visuals — clear ideas, crafted down to the last pixel.',
  hero_image = '/portfolio/profile-photo.webp',
  hero_background_image = '/portfolio/editor-artwork.webp',
  contact_image = null,
  about_eyebrow = 'About',
  about_headline = 'Turning ideas into visuals that *work hard and look good.*',
  about_intro = 'I design for brands that want to be noticed — from launch posters and social creatives to complete visual identities.',
  about_bio = 'I enjoy the full journey of a design: understanding the product, finding the one idea worth saying, and then obsessing over type, colour and composition until it feels effortless.

My toolkit spans Photoshop, Illustrator, InDesign, After Effects, Figma and Blender, which lets me move comfortably between print, digital and motion.',
  about_philosophy = '',
  about_experience = '',
  about_image = null,
  years_experience = null,
  projects_completed = null,
  clients_served = null,
  availability = 'Open to freelance projects',
  contact_email = 'hello@example.com',
  contact_phone = '[Mobile number]',
  location = '',
  instagram_url = '',
  behance_url = '',
  linkedin_url = '',
  dribbble_url = '',
  x_url = '',
  seo_title = 'Graphic Designer Portfolio',
  seo_description = 'Graphic design portfolio featuring product posters, social media creatives and brand visuals.',
  og_image = '/portfolio/work-shoe.webp',
  resume_url = '/portfolio/resume-placeholder.pdf',
  resume_file_name = 'resume-placeholder.pdf',
  resume_size_bytes = 88784
where id = 1;

insert into public.services (title, short_description, description, image_url, deliverables, display_order)
select * from (values
  ('Product posters & ads', 'Launch visuals that make a product the hero.', 'Campaign key visuals and product posters for print, retail and digital — built around one clear message.', null, array['Key visuals', 'Product posters', 'Ad variations']::text[], 1),
  ('Social media creatives', 'Scroll-stopping, on-brand content.', 'Post and story systems, campaign assets and templates that keep a feed consistent week after week.', null, array['Post & story designs', 'Templates', 'Carousel layouts']::text[], 2),
  ('Brand identity', 'Logos and visual systems with a point of view.', 'Logo, colour, typography and guidelines that hold a brand together across every touchpoint.', null, array['Logo suite', 'Colour & type', 'Brand guidelines']::text[], 3),
  ('Print & packaging', 'Designs that feel good in hand.', 'Brochures, labels and packaging prepared carefully for production, from mockup to print-ready files.', null, array['Packaging', 'Brochures', 'Print-ready files']::text[], 4)
) as v(title, short_description, description, image_url, deliverables, display_order)
where not exists (select 1 from public.services);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Kova Glide Low', 'kova-glide-low', 'Footwear campaign', 'A launch poster for a lightweight everyday sneaker.', 'A launch poster for Kova, a fictional sneaker brand. The brief: introduce the Glide Low as the lightest shoe in the range, with a confident, sporty voice.

Oversized condensed type sits behind the product so the shoe can break out of the frame, while a lime price badge and short feature list keep the essentials easy to scan.', '/portfolio/work-shoe.webp', 'Concept project', 2026, 'I started with silhouette studies to get a sneaker that reads instantly at thumbnail size, then built a cobalt, lime and warm-cream palette that stays energetic without shouting.', 'Balancing a very large headline with the product illustration — the type had to feel bold while the shoe remained the clear focal point.', 'A poster system with a reusable layout for future colourways and seasonal drops.', true, true, 1)
on conflict (slug) do nothing;

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Orbit Pulse 2', 'orbit-pulse-2', 'Smartwatch launch', 'A calm, premium launch visual for a fitness smartwatch.', 'A product launch visual for Orbit, a fictional wearables brand. The goal was to present health features clearly while keeping the mood premium and calm.

A midnight gradient, a coral strap and thin callout lines guide the eye from the headline to the key features and the specs below.', '/portfolio/work-watch.webp', 'Concept project', 2026, 'I mapped the information hierarchy first — name, promise, three features, three specs — then designed the watch face and activity rings to echo the brand colours.', 'Showing several features without clutter. Grouped callouts and a single accent colour keep the layout readable.', 'A launch visual that adapts easily to social posts and web banners.', true, true, 2)
on conflict (slug) do nothing;

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Headset concept', 'headset-concept', 'Audio product', 'Placeholder — replace with the final headset design.', 'Placeholder sample. Replace this image and text with the final headset design from the dashboard (Portfolio → Headset concept).', '/portfolio/work-headset-placeholder.webp', null, 2026, '', '', '', true, true, 3)
on conflict (slug) do nothing;

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Laptop concept', 'laptop-concept', 'Tech product', 'Placeholder — replace with the final laptop design.', 'Placeholder sample. Replace this image and text with the final laptop design from the dashboard (Portfolio → Laptop concept).', '/portfolio/work-laptop-placeholder.webp', null, 2026, '', '', '', true, true, 4)
on conflict (slug) do nothing;
