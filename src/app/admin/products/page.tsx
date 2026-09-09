import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListRowActions } from "@/components/admin/list-row-actions";
import Product from "@/models/Product";

export default async function AdminProductsPage() {
  await requireAdmin();
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Add, edit, delete shop products and upload images (stored in MongoDB for Vercel)."
        actions={
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary text-sm">
            Add Product
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const imageUrl = product.images?.[0]?.url;
              return (
                <tr key={String(product._id)}>
                  <td>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--admin-border)] text-[10px] text-[var(--admin-muted)]">
                        —
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td className="font-mono text-sm">{product.sku}</td>
                  <td>${product.price?.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StatusBadge status={product.status} />
                  </td>
                  <td>
                    <ListRowActions
                      editHref={`/admin/products/${product._id}`}
                      deleteEndpoint={`/api/admin/products/${product._id}`}
                      itemLabel="product"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No products yet. Add your first product.</p>
        )}
      </div>
    </div>
  );
}
