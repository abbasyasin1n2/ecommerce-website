import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main>
      {/* Hero Section Skeleton */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-16 w-full max-w-3xl mb-4" />
            <Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />
            <Skeleton className="h-6 w-full max-w-xl mb-8" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Cards Skeleton */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-[500px] rounded-3xl" />
            <div className="flex flex-col gap-6">
              <Skeleton className="h-[240px] rounded-3xl" />
              <Skeleton className="h-[240px] rounded-3xl" />
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Skeleton */}
      <section className="py-16">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </Container>
      </section>

      {/* Products Skeleton */}
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
