import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import ContactMessage from "@/models/ContactMessage";

export default async function AdminMessagesPage() {
  await requireAdmin();
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions" />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Inquiry</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={String(msg._id)}>
                <td>
                  <div>{msg.name}</div>
                  <div className="text-xs text-[var(--admin-muted)]">{msg.email}</div>
                </td>
                <td>{msg.inquiryType}</td>
                <td>
                  <StatusBadge status={msg.status} />
                </td>
                <td className="text-[var(--admin-muted)]">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/admin/messages/${msg._id}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
