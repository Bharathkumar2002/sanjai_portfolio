import Link from "next/link";
import { getAdminPageSession } from "@/lib/admin/auth";
import { EmptyState, ErrorNotice, PageHeader } from "@/components/admin/ui";
import { MessagesList } from "@/components/admin/MessagesList";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages" };

const PAGE_SIZE = 50;

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> }) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const params = await searchParams;
  const unreadOnly = params.filter === "unread";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  let query = session.supabase
    .from("contact_messages")
    .select("id, name, email, subject, project_type, message, is_read, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (unreadOnly) query = query.eq("is_read", false);
  const { data, error, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const tab = (label: string, href: string, active: boolean) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("rounded-full px-4 py-2 text-sm font-medium", active ? "bg-bone text-ink-950" : "text-mist ring-1 ring-white/15 hover:text-white")}
    >
      {label}
    </Link>
  );
  const pageHref = (p: number) => `/admin/messages?${new URLSearchParams({ ...(unreadOnly ? { filter: "unread" } : {}), page: String(p) })}`;

  return (
    <>
      <PageHeader title="Messages" description="Enquiries sent through the contact form. Opening a message marks it as read." />
      <div className="mb-5 flex gap-2">
        {tab("All", "/admin/messages", !unreadOnly)}
        {tab("Unread", "/admin/messages?filter=unread", unreadOnly)}
      </div>
      {error ? (
        <ErrorNotice message={error.message} />
      ) : data.length === 0 ? (
        <EmptyState
          title={unreadOnly ? "You're all caught up" : "No messages yet"}
          description={unreadOnly ? "There are no unread messages." : "When someone uses your contact form, their message will appear here."}
        />
      ) : (
        <>
          <MessagesList messages={data} />
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-5 flex items-center justify-between text-sm text-mist">
              {page > 1 ? <Link href={pageHref(page - 1)} className="hover:text-white">← Newer</Link> : <span />}
              <span>Page {page} of {totalPages}</span>
              {page < totalPages ? <Link href={pageHref(page + 1)} className="hover:text-white">Older →</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </>
  );
}
