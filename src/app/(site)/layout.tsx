import { PublicShell } from "@/components/layout/PublicShell";
import { getSiteSettings } from "@/lib/data/settings";
import type { ReactNode } from "react";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <PublicShell
      announcementText={settings.general?.announcementText}
      enableIntro={settings.motion?.enableIntro ?? true}
      introOncePerSession={settings.motion?.introOncePerSession ?? true}
      footer={{
        companyName: settings.general?.companyName,
        tagline: settings.general?.tagline,
        email: settings.contact?.email,
        phone: settings.contact?.phone,
        copyright: settings.footer?.copyright,
      }}
    >
      {children}
    </PublicShell>
  );
}
