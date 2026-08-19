import { ProductCard } from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: { url: string; alt?: string }[];
  category?: string;
  stock?: number;
  onSale?: boolean;
  featured?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="py-12 text-center text-arena-muted">
        No products found. Check back soon for new drops.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
