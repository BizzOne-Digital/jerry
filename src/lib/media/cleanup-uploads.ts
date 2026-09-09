import { deleteStoredUploadByUrl } from "@/lib/media/stored-uploads";

type ImageRefLike = { url?: string | null } | null | undefined;

function collectUrls(...sources: Array<string | null | undefined | ImageRefLike | ImageRefLike[]>): string[] {
  const urls: string[] = [];

  for (const source of sources) {
    if (!source) continue;
    if (typeof source === "string") {
      urls.push(source);
      continue;
    }
    if (Array.isArray(source)) {
      for (const item of source) {
        if (item?.url) urls.push(item.url);
      }
      continue;
    }
    if (source.url) urls.push(source.url);
  }

  return urls.filter((url) => url.startsWith("/api/uploads/"));
}

export async function deleteStoredUploadsFromUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls)];
  await Promise.all(unique.map((url) => deleteStoredUploadByUrl(url)));
}

export async function deleteProductUploads(product: {
  images?: ImageRefLike[];
  seo?: { ogImage?: ImageRefLike };
}): Promise<void> {
  await deleteStoredUploadsFromUrls(collectUrls(product.images, product.seo?.ogImage?.url));
}

export async function deleteServiceUploads(service: {
  cardImage?: ImageRefLike;
  detailHero?: { image?: ImageRefLike; backgroundImage?: ImageRefLike };
  detailImages?: ImageRefLike[];
  featureSection?: { image?: ImageRefLike };
  seo?: { ogImage?: ImageRefLike };
}): Promise<void> {
  await deleteStoredUploadsFromUrls(
    collectUrls(
      service.cardImage,
      service.detailHero?.image,
      service.detailHero?.backgroundImage,
      service.detailImages,
      service.featureSection?.image,
      service.seo?.ogImage,
    ),
  );
}

export async function deleteTestimonialUploads(testimonial: { avatar?: ImageRefLike }): Promise<void> {
  await deleteStoredUploadsFromUrls(collectUrls(testimonial.avatar));
}
