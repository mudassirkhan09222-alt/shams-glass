/** Shimmering skeleton block. Use `rounded`/`className` to shape it. */
export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`sg-skeleton rounded-lg ${className}`} aria-hidden />;
}

/** Card skeleton used in product grid loading states. */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-hairline bg-white overflow-hidden">
      <Skeleton className="rounded-none aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
