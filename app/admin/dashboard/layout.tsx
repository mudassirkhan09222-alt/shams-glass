import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopBar } from "@/components/admin/topbar";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s — Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-canvas flex">
      <AdminSidebar userEmail={admin.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar userEmail={admin.email ?? ""} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
