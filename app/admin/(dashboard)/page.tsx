import Link from "next/link";
import { getAdminPageSession } from "@/lib/admin/auth";
import { Badge, Card, ErrorNotice, PageHeader } from "@/components/admin/ui";
import { ArrowRight, InboxIcon, LayersIcon, SparkIcon, UsersIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  const session = await getAdminPageSession();
  if (!session) return null;
  const db = session.supabase;

  const head = { count: "exact" as const, head: true };
  const [projects, published, services, clients, messages, unread, recent] = await Promise.all([
    db.from("projects").select("id", head),
    db.from("projects").select("id", head).eq("is_published", true),
    db.from("services").select("id", head),
    db.from("clients").select("id", head),
    db.from("contact_messages").select("id", head),
    db.from("contact_messages").select("id", head).eq("is_read", false),
    db.from("contact_messages").select("id, name, email, subject, message, is_read, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const failed = [projects, published, services, clients, messages, unread, recent].find((r) => r.error);
  const recentMessages = (recent.data ?? []) as Pick<ContactMessage, "id" | "name" | "email" | "subject" | "message" | "is_read" | "created_at">[];

  const stats = [
    { label: "Portfolio samples", value: projects.count ?? 0, note: `${published.count ?? 0} published`, href: "/admin/projects", icon: LayersIcon },
    { label: "Services", value: services.count ?? 0, note: "What I do section", href: "/admin/services", icon: SparkIcon },
    { label: "Client logos", value: clients.count ?? 0, note: "Trusted-by strip", href: "/admin/clients", icon: UsersIcon },
    { label: "Messages", value: messages.count ?? 0, note: `${unread.count ?? 0} unread`, href: "/admin/messages", icon: InboxIcon },
  ];

  return (
    <>
      <PageHeader title="Overview" description="A snapshot of your portfolio and recent enquiries." />
      {failed?.error && <div className="mb-6"><ErrorNotice message={failed.error.message} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, href, icon: Icon }) => (
          <Link key={label} href={href} className="group">
            <Card className="h-full p-5 transition-colors group-hover:bg-ink-850">
              <div className="flex items-center justify-between text-mist">
                <span className="text-sm">{label}</span>
                <Icon size={18} />
              </div>
              <p className="mt-6 font-display text-5xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-smoke">{note}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
          <h2 className="font-display text-lg font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-white">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="p-8 text-center text-sm text-smoke">No messages yet. Enquiries from the contact form will appear here.</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {recentMessages.map((m) => (
              <li key={m.id}>
                <Link href="/admin/messages" className="flex items-center gap-4 p-4 hover:bg-white/[0.02]">
                  <span className={`size-2 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-ember-500"}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-bone">{m.name}</span>
                      {!m.is_read && <Badge tone="accent">New</Badge>}
                    </span>
                    <span className="block truncate text-sm text-mist">{m.subject} — <span className="text-smoke">{m.message}</span></span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-smoke sm:block">{formatDate(m.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
