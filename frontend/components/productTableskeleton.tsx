import { Skeleton } from "@/components/ui/skeleton";

export default function ProductTableSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[60px]" />
        </div>
      ))}
    </div>
  );
}
