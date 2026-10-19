import type { Metadata } from "next";
import Link from "next/link";
import { Package, Eye, PenLine, Layers, Plus, ArrowRight } from "lucide-react";
import { getAdminMetrics } from "@/lib/products/queries";
import { isServiceRoleConfigured } from "@/lib/supabase/config-check";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminDashboardPage() {
  const configured = isServiceRoleConfigured();
  const metrics = configured ? await getAdminMetrics() : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">Dashboard Overview</h1>
        <p className="mt-1 text-ink-soft text-sm">
          Manage products and categories for the Shams Glass website.
        </p>
      </div>

      {!configured ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 mb-8">
          <strong className="font-semibold">Service role key not configured.</strong> Add{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.local</code> to enable product management.
          See <code className="rounded bg-amber-100 px-1.5 py-0.5">supabase/SUPABASE_SETUP.md</code>.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Products"
          value={metrics?.totalProducts}
          icon={Package}
          href="/admin/dashboard/products"
          tone="navy"
        />
        <MetricCard
          label="Published"
          value={metrics?.publishedProducts}
          icon={Eye}
          href="/admin/dashboard/products"
          tone="green"
        />
        <MetricCard
          label="Draft"
          value={metrics?.draftProducts}
          icon={PenLine}
          href="/admin/dashboard/products"
          tone="amber"
        />
        <MetricCard
          label="Categories"
          value={metrics?.categories}
          icon={Layers}
          href="/admin/dashboard/categories"
          tone="blue"
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <QuickLink
          title="Add a product"
          description="Create a new glass or aluminium product listing."
          href="/admin/dashboard/products/new"
          icon={Plus}
        />
        <QuickLink
          title="Manage categories"
          description="Create and organise product categories."
          href="/admin/dashboard/categories"
          icon={Layers}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  href,
  tone,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  href: string;
  tone: "navy" | "green" | "amber" | "blue";
}) {
  const tones = {
    navy: "bg-navy/8 text-navy",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-glass text-corporate",
  };
  return (
    <Link
      href={href}
      className="sg-card flex items-center gap-4 rounded-2xl border border-hairline bg-white p-5 hover:border-corporate"
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="text-2xl font-semibold text-navy">
          {value != null ? value : "—"}
        </p>
      </div>
    </Link>
  );
}

function QuickLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="sg-card flex items-start gap-4 rounded-2xl border border-hairline bg-white p-5 hover:border-corporate"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-glass text-corporate shrink-0">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div className="flex-1">
        <p className="font-semibold text-navy">{title}</p>
        <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-ink-muted shrink-0 mt-0.5" aria-hidden />
    </Link>
  );
}
