import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Oswald, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { DEFAULT_SITE_SETTINGS } from "@/lib/data/defaults";
import { getSiteUrl } from "@/lib/env";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { general } = DEFAULT_SITE_SETTINGS;
  return {
    title: {
      default: general.defaultSeoTitle,
      template: `%s | ${general.companyName}`,
    },
    description: general.defaultSeoDescription,
    metadataBase: new URL(getSiteUrl()),
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${dmSans.variable} ${cormorant.variable} h-full overflow-x-clip`}>
      <body className="flex min-h-full w-full flex-col overflow-x-clip antialiased bg-arena-black text-arena-cream">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
