"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { BRAND_IMAGES } from "@/lib/images";

import { isSvgImage } from "@/lib/image-utils";

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url ?? BRAND_IMAGES.cards;
  const outOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-sm arena-glow bg-arena-surface transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.images?.[0]?.alt ?? product.name}
          fill
          unoptimized={isSvgImage(imageUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.featured && <Badge>Featured</Badge>}
          {product.onSale && <Badge className="border-arena-coral/40 bg-arena-coral/20 text-arena-coral">Sale</Badge>}
          {outOfStock && <Badge className="border-arena-muted/40 bg-arena-muted/20 text-arena-muted">Sold Out</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="text-[10px] font-display tracking-widest text-arena-gold uppercase">{product.category}</p>
        )}
        <h3 className="mt-1 flex-1 font-display text-sm text-arena-cream line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-arena-gold">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-arena-muted line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
