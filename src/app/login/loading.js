import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Container className="max-w-md">
        <Card>
          <CardHeader className="space-y-3 text-center">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-11 w-full" />
            <div className="relative">
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
