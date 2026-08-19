import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import BlogPost from "@/models/BlogPost";

export default async function AdminBlogsPage() {
  await requireAdmin();
  await connectDB();
  const items = await BlogPost.find().sort({ publishDate: -1, createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="Manage blog posts"
        actions={
          <Link href="/admin/blogs/new" className="admin-btn admin-btn-primary text-sm">
            New Post
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item._id)}>
                <td>{item.title}</td>
                <td className="text-[var(--admin-muted)]">{item.authorName}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td className="text-[var(--admin-muted)]">
                  {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "—"}
                </td>
                <td>
                  <Link
                    href={`/admin/blogs/${item._id}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
