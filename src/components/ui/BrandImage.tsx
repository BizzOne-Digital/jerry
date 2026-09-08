import Image, { type ImageProps } from "next/image";
import { isStoredUploadUrl, isSvgImage, resolveImageSrc } from "@/lib/image-utils";

type BrandImageProps = Omit<ImageProps, "unoptimized" | "src"> & {
  src: string;
};

export function BrandImage({ src, alt = "", ...props }: BrandImageProps) {
  const resolved = resolveImageSrc(src);
  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized={isSvgImage(resolved) || isStoredUploadUrl(resolved)}
      {...props}
    />
  );
}
