import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { AdminLayoutWrapper } from "@/components/admin/layout-wrapper";
import { AdminToastProvider } from "@/components/admin/toast-provider";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | Sodapops Collectibles",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="admin-theme">
        <AdminToastProvider />
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </div>
    </SessionProvider>
  );
}
