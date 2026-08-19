import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Product from "@/models/Product";

export default async function AdminProductsPage() {
  await requireAdmin();
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage shop inventory"
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
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={String(product._id)}>
                <td>{product.name}</td>
                <td className="font-mono text-sm">{product.sku}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <StatusBadge status={product.status} />
                </td>
                <td>
                  <Link
                    href={`/admin/products/${product._id}`}
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
