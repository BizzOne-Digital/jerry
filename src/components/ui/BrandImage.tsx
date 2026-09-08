import Image, { type ImageProps } from "next/image";
import { isSvgImage } from "@/lib/image-utils";

type BrandImageProps = Omit<ImageProps, "unoptimized"> & {
  src: string;
};

export function BrandImage({ src, alt = "", ...props }: BrandImageProps) {
  return <Image src={src} alt={alt} unoptimized={isSvgImage(src)} {...props} />;
}
