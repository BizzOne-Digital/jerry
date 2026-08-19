import { AnnouncementTicker } from "./AnnouncementTicker";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { CinematicIntro } from "@/components/motion/CinematicIntro";

interface PublicShellProps {
  children: React.ReactNode;
  announcementText?: string;
  enableIntro?: boolean;
  introOncePerSession?: boolean;
  footer?: {
    companyName?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    copyright?: string;
  };
}

export function PublicShell({
  children,
  announcementText,
  enableIntro = true,
  introOncePerSession = true,
  footer,
}: PublicShellProps) {
  return (
    <>
      <CinematicIntro enabled={enableIntro} oncePerSession={introOncePerSession} />
      <AnnouncementTicker text={announcementText} />
      <Header />
      <MainContent>
        <RouteTransition>{children}</RouteTransition>
      </MainContent>
      <Footer {...footer} />
    </>
  );
}
