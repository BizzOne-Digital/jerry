import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import MediaCategory from "@/models/MediaCategory";
import MediaAsset from "@/models/MediaAsset";

export default async function AdminGalleryPage() {
  await requireAdmin();
  await connectDB();

  const categories = await MediaCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
  const counts = await MediaAsset.aggregate([
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count as number]));

  return (
    <div>
      <PageHeader title="Gallery" description="Private media library — manage categories and uploads" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={String(cat._id)}
            href={`/admin/gallery/${cat._id}`}
            className="admin-card block p-5 transition hover:border-[var(--admin-accent)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{cat.name}</h3>
              <StatusBadge status={cat.status} />
            </div>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">
              {countMap.get(String(cat._id)) ?? 0} assets
            </p>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="mt-4 text-sm text-[var(--admin-muted)]">
          No categories yet. Create one from a category page or run the seed script.
        </p>
      )}
    </div>
  );
}
