'use client';

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
          <div className="h-44 bg-white/5" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-white/5 rounded-md" />
              <div className="h-6 w-16 bg-white/5 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/5 bg-[#08080f] animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded w-2/3" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-12 bg-white/5 rounded-lg" />
            <div className="h-7 w-12 bg-white/5 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-6 w-48 bg-white/5 rounded-full mb-6" />
      <div className="h-10 w-96 bg-white/5 rounded mb-4" />
      <div className="h-4 w-80 bg-white/5 rounded mb-12" />
      <CardSkeleton count={6} />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 border border-white/5 bg-[#08080f]">
          <div className="h-3 w-20 bg-white/5 rounded mb-3" />
          <div className="h-10 w-16 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}
