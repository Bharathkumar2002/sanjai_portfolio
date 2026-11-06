-- =============================================================================
-- Placeholder seed content (fictional brands). GENERATED FILE — do not edit.
-- Source: content/placeholder-content.json  ·  Regenerate: npm run db:seed
-- Safe to run more than once: existing rows are left untouched.
-- =============================================================================

update public.site_settings set
  brand_name = 'Sanjai',
  designer_name = 'Sanjai',
  role_title = 'Graphic Designer',
  hero_greeting = 'Hey, I''m Sanjai —',
  hero_headline = 'Creative
*Designer*',
  hero_tagline = 'Design should be felt before it is read.',
  hero_intro = 'I craft bold brand identities, packaging and campaigns for companies that refuse to blend in — strategy-led, obsessively detailed and built to be remembered.',
  hero_image = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80',
  about_eyebrow = 'Behind the Designs',
  about_headline = 'Creating Visual Experiences That Make Brands *Stand Out*',
  about_intro = 'I''m a graphic designer who sits at the meeting point of strategy and craft. Every logo, label and layout starts with one question: what should people feel?',
  about_bio = 'For the past six years I''ve partnered with founders, studios and growing teams to shape how their brands look, speak and move. My work spans identity systems, packaging, editorial and digital — always designed as one connected story rather than a pile of separate assets.',
  about_philosophy = 'Good design is quiet confidence. I strip ideas back to what matters, then push the details until they feel inevitable. Bold where it counts, restrained everywhere else.',
  about_experience = 'Specialised in brand identity and packaging, with deep experience in type, colour systems and art direction for launches across food & beverage, beauty, fashion and tech.',
  about_image = 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1400&q=80',
  years_experience = 6,
  projects_completed = 120,
  clients_served = 45,
  availability = 'Booking new projects now',
  contact_email = 'hello@example.com',
  contact_phone = '',
  location = 'Working worldwide, remotely',
  instagram_url = 'https://www.instagram.com/',
  behance_url = 'https://www.behance.net/',
  linkedin_url = 'https://www.linkedin.com/',
  dribbble_url = 'https://dribbble.com/',
  x_url = '',
  seo_title = 'Sanjai — Graphic Designer & Brand Identity Specialist',
  seo_description = 'Portfolio of Sanjai, a graphic designer crafting brand identities, packaging, posters and digital experiences for ambitious brands.',
  og_image = null
where id = 1;

insert into public.services (title, short_description, description, image_url, deliverables, display_order)
select * from (values
  ('Brand Identity Design', 'Identity systems with a point of view.', 'From positioning workshops to the final brand book, I build complete identity systems — logo, typography, colour, voice and the rules that keep everything consistent as your brand grows.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80', array['Brand strategy', 'Logo suite', 'Colour & type system', 'Brand guidelines', 'Stationery']::text[], 1),
  ('Logo Design', 'Marks that work at every size.', 'Distinctive, timeless logos designed to scale from a favicon to a billboard. Every mark is tested in context, refined on the grid and delivered with a full set of lock-ups.', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80', array['Primary & secondary marks', 'Monogram / icon', 'Responsive lock-ups', 'Usage guide']::text[], 2),
  ('Social Media Creatives', 'Scroll-stopping content systems.', 'Templates, campaign visuals and motion-ready assets that keep your feed on-brand without starting from zero each week. Built for Instagram, LinkedIn, TikTok and beyond.', 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1400&q=80', array['Campaign key visuals', 'Post & story templates', 'Ad creatives', 'Content grid planning']::text[], 3),
  ('Packaging Design', 'Shelf presence that sells.', 'Packaging that earns attention on crowded shelves and feels premium in hand — from structure and materials to labels, dielines and print-ready production files.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1400&q=80', array['Label & box design', 'Dielines', '3D mockups', 'Print production']::text[], 4),
  ('Poster & Print Design', 'Print that people keep.', 'Posters, editorial layouts, brochures and event collateral with strong typography and careful attention to paper, finishes and colour accuracy.', 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=1400&q=80', array['Posters', 'Brochures & catalogues', 'Event collateral', 'Pre-press files']::text[], 5),
  ('UI/UX Design', 'Interfaces with brand DNA.', 'Clean, intuitive interfaces that carry your brand into product. Research-informed flows, design systems and high-fidelity prototypes ready for developers.', 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1400&q=80', array['User flows', 'Wireframes', 'UI design system', 'Interactive prototypes']::text[], 6)
) as v(title, short_description, description, image_url, deliverables, display_order)
where not exists (select 1 from public.services);

insert into public.clients (name, logo_url, website_url, display_order)
select * from (values
  ('Northwind', null::text, null::text, 1),
  ('Lumen Labs', null::text, null::text, 2),
  ('Halcyon', null::text, null::text, 3),
  ('Ember & Co.', null::text, null::text, 4),
  ('Vantage', null::text, null::text, 5),
  ('Orbit', null::text, null::text, 6)
) as v(name, logo_url, website_url, display_order)
where not exists (select 1 from public.clients);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Ember Coffee Roasters', 'ember-coffee-roasters', 'Branding', 'A warm, crafted identity for a small-batch roastery growing into its first café.', 'Ember is an independent roastery that had outgrown its hand-drawn logo. They needed an identity that felt as considered as their coffee — premium without losing the warmth that regulars loved.

The new system is built around a glowing ''ember'' mark, a roasted colour palette and a confident serif paired with a utilitarian grotesk for menus and labels.', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=2000&q=80', 'Ember Coffee (concept)', 2025, 'We began with a two-day immersion at the roastery — tasting, photographing and interviewing staff and regulars. Three territories were explored: heritage, craft and warmth. Warmth won, and the ember mark grew out of sketches of glowing coals inside the roaster drum.

The palette was sampled directly from roast stages, from green bean to dark roast.', 'The brand had to work on everything from a 30mm coffee bag label to a 6-metre café wall. The mark was redrawn three times to keep its glow legible at small sizes on kraft paper.', 'The rebrand launched alongside the first café. Bag sales grew steadily over the following quarter and the identity has since extended to merchandise and a subscription service without needing new rules.', true, true, 1)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=80', 'Latte art in branded cups on a café table', 1),
  ('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=2000&q=80', 'Coffee cup and cookies styled for the brand shoot', 2)
) as v(image_url, alt_text, display_order)
where p.slug = 'ember-coffee-roasters'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Lumen Skincare', 'lumen-skincare', 'Packaging', 'Minimal, sculptural packaging for a clean-beauty line built on light.', 'Lumen is a clean skincare line built around light-activated botanicals. The packaging needed to communicate purity and efficacy while standing apart from the sea of white minimalism in the category.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=2000&q=80', 'Lumen Labs (concept)', 2025, 'I studied how light falls across glass and paper, then translated it into a system of soft gradients printed on uncoated stock. Typography was kept surgical and small so the product itself became the hero.', 'Achieving a consistent gradient across glass, paper and plastic substrates required close collaboration with three different printers and multiple rounds of proofs.', 'A cohesive range of nine products with a modular label system that lets the team launch new SKUs in days instead of weeks.', true, true, 2)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=2000&q=80', 'Matte refillable bottle from the range', 1),
  ('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=2000&q=80', 'Soft gradient light study used for the label artwork', 2)
) as v(image_url, alt_text, display_order)
where p.slug = 'lumen-skincare'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Northwind Outerwear', 'northwind-outerwear', 'Branding', 'A rugged, monochrome identity for a technical outerwear label.', 'Northwind makes technical outerwear for city commuters. The brand needed to feel engineered and durable, while still fitting into a fashion context.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=2000&q=80', 'Northwind (concept)', 2024, 'The identity borrows from topographic maps and garment care labels. A custom stencil wordmark is paired with a strict monochrome palette and a grid of technical callouts used across tags, packaging and e-commerce.', 'The label system had to survive washing, stitching and heat transfer — every element was tested on real fabric before sign-off.', 'A complete identity including hang tags, woven labels, shipping boxes and a lookbook that set the tone for the brand''s first collection.', true, true, 3)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=2000&q=80', 'Bomber jacket held on a hanger', 1),
  ('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=2000&q=80', 'Row of shirts on hangers', 2),
  ('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80', 'Clothing rail styled for the lookbook', 3)
) as v(image_url, alt_text, display_order)
where p.slug = 'northwind-outerwear'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Pulse Audio Launch', 'pulse-audio-launch', 'Social Media Design', 'A bold launch campaign system for a new range of wireless headphones.', 'Pulse needed a launch campaign for its first over-ear headphones that could run across paid social, organic content and retail screens for six weeks without feeling repetitive.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2000&q=80', 'Pulse (concept)', 2025, 'The campaign is built on a single idea — ''hear the colour''. Each product colourway gets its own sound-wave typographic treatment, generated from real audio and set in a modular template system.', 'Creating enough variety for 60+ assets while keeping production fast. The answer was a component-based template library the in-house team could remix.', 'Over sixty launch assets delivered in two weeks, plus a template kit the team still uses for ongoing content.', true, true, 4)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=2000&q=80', 'Headphones on a white desk with keyboard and mouse', 1),
  ('https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=2000&q=80', 'Wired headphones on a white background', 2)
) as v(image_url, alt_text, display_order)
where p.slug = 'pulse-audio-launch'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Chroma Festival Posters', 'chroma-festival-posters', 'Poster Design', 'A fluid, generative poster series for a weekend art & music festival.', 'Chroma is a weekend festival celebrating experimental art and electronic music. The poster series needed to feel alive and unpredictable — no two pieces the same.', 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=2000&q=80', null, 2024, 'I combined hand-poured acrylic textures with a rigid typographic grid. Each poster pairs a unique pour with the same structural layout so the series reads as one family.', 'Reproducing the depth of fluid colour in screen print and risograph without losing vibrancy.', 'A series of twelve posters, festival wayfinding and a limited print run that sold out at the merch stand.', true, true, 5)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=2000&q=80', 'Fluid acrylic artwork in yellow, black and white', 1),
  ('https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=2000&q=80', 'Swirling red and teal ink artwork', 2),
  ('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2000&q=80', 'Colourful ink clouds in water', 3)
) as v(image_url, alt_text, display_order)
where p.slug = 'chroma-festival-posters'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Orbit Money App', 'orbit-money-app', 'UI/UX Design', 'A friendly budgeting app that makes money feel less intimidating.', 'Orbit helps first-time earners understand where their money goes. The challenge was making financial data approachable without making it feel like a toy.', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=2000&q=80', 'Orbit (concept)', 2024, 'Research interviews with twelve young professionals shaped a simple mental model: money orbits around goals. Wireframes were tested weekly before moving into a component-based UI system.', 'Balancing playful visuals with the trust and clarity expected from a finance product.', 'A 40-screen high-fidelity prototype and a design system with over 120 components handed off to the engineering team.', false, true, 6)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=2000&q=80', 'Hand sketching wireframes on paper', 1),
  ('https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=2000&q=80', 'Colourful printed wireframes laid out on a table', 2),
  ('https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=2000&q=80', 'Team mapping user flows with sticky notes', 3)
) as v(image_url, alt_text, display_order)
where p.slug = 'orbit-money-app'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Kiln Ceramics', 'kiln-ceramics', 'Logo Design', 'A handcrafted mark for a ceramics studio and its workshop programme.', 'Kiln is a ceramics studio running small-batch tableware and weekend workshops. They wanted a mark that felt handmade but worked across a website, stamps and glaze labels.', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=2000&q=80', 'Kiln Studio (concept)', 2023, 'Dozens of brush and clay-stamp explorations were digitised and refined. The final mark is a simple arch — the shape of the kiln door — with a slightly irregular edge.', 'Keeping the handmade character while producing a clean vector that could be laser-cut into a clay stamp.', 'A primary mark, monogram stamp and colour system now used on every piece that leaves the studio.', false, true, 7)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=2000&q=80', 'Colour swatches and design sketches on a desk', 1),
  ('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=2000&q=80', 'Designer reviewing the identity on a laptop', 2)
) as v(image_url, alt_text, display_order)
where p.slug = 'kiln-ceramics'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);

insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values ('Faces of the City', 'faces-of-the-city', 'Illustration', 'Large-scale portrait illustrations celebrating local creatives.', 'A personal illustration series portraying the artists, makers and musicians who shape the city''s creative scene — painted digitally and printed at mural scale.', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=2000&q=80', null, 2023, 'Each subject was photographed in their own space, then reinterpreted with bold, expressive colour. Brush textures were scanned from real paint to keep the work tactile at large sizes.', 'Making digital work hold up when printed six metres tall — every piece was built at print resolution from the start.', 'Eight portraits exhibited in a pop-up gallery, with prints and postcards sold to support the featured artists.', false, true, 8)
on conflict (slug) do nothing;

insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
  ('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=2000&q=80', 'Paint brush with orange paint', 1),
  ('https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=2000&q=80', 'Swirling blue and pink paint texture', 2),
  ('https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=2000&q=80', 'Abstract marbled paint in pastel colours', 3)
) as v(image_url, alt_text, display_order)
where p.slug = 'faces-of-the-city'
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);
