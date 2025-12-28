import { Card, CardContent, CardFooter } from "./ui/card";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Supplier */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        {/* Price */}
        <div className="h-8 bg-gray-200 rounded w-2/3" />

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded" />

        {/* Stats */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </CardFooter>
    </Card>
  );
}

export function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
