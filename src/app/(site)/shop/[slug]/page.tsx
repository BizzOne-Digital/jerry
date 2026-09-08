import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ImageGallery } from "@/components/sections/SectionRenderer";
import { formatCurrency } from "@/lib/utils";
import { getProductBySlug } from "@/lib/data/products";
import { resolveProductGalleryImages, resolveProductImage } from "@/lib/images";
import { isPackageLogoImage, isStoredUploadUrl, isSvgImage, resolveImageSrc } from "@/lib/image-utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const primaryImage = resolveImageSrc(
    resolveProductImage(product.images?.[0]?.url, product.slug, product.category),
  );
  const isLogo = isPackageLogoImage(primaryImage);
  const images = resolveProductGalleryImages(product.slug, product.category, product.images, product.name);

  const inStock = product.stock > 0 || product.allowBackorder;

  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-sm arena-glow">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className={isLogo ? "object-contain bg-arena-navy p-6" : "object-cover"}
                sizes="50vw"
                priority
                unoptimized={isStoredUploadUrl(primaryImage) || isSvgImage(primaryImage)}
              />
            </div>
            <div className="mt-6">
              <ImageGallery images={images} columns={3} />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {product.featured && <Badge>Featured</Badge>}
              {product.isAuthenticated && <Badge>Authenticated</Badge>}
              {product.onSale && <Badge className="border-arena-coral/40 text-arena-coral">On Sale</Badge>}
            </div>
            <p className="mt-3 text-xs font-display tracking-widest text-arena-gold uppercase">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-3xl text-arena-cream">{product.name}</h1>
            <p className="mt-4 text-2xl text-arena-gold">{formatCurrency(product.price)}</p>
            {product.shortDescription && (
              <p className="mt-4 text-arena-muted">{product.shortDescription}</p>
            )}
            {product.longDescription && (
              <div
                className="prose prose-invert mt-6 max-w-none text-sm text-arena-muted"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            )}
            <div className="mt-8">
              <AddToCartButton
                disabled={!inStock}
                item={{
                  productId: product._id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: primaryImage,
                  sku: product.sku,
                }}
              />
            </div>
            {product.condition && (
              <p className="mt-4 text-sm text-arena-muted">
                Condition: <span className="text-arena-cream">{product.condition}</span>
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
