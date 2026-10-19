import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Shams Glass — Premium Glass & Aluminium",
    template: "%s — Shams Glass",
  },
};

export default function PublicRouteLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
