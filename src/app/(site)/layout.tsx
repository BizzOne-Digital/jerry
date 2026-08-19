import { PublicShell } from "@/components/layout/PublicShell";
import { DEFAULT_SITE_SETTINGS } from "@/lib/data/defaults";
import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const settings = DEFAULT_SITE_SETTINGS;

  return (
    <PublicShell
      announcementText={settings.general.announcementText}
      enableIntro={settings.motion.enableIntro}
      introOncePerSession={settings.motion.introOncePerSession}
      footer={{
        companyName: settings.general.companyName,
        tagline: settings.general.tagline,
        email: settings.contact.email,
        phone: settings.contact.phone,
        copyright: settings.footer.copyright,
      }}
    >
      {children}
    </PublicShell>
  );
}
