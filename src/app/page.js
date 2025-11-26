import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Temporary Hero Section - Will be enhanced in Step 3 */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4" />
              Welcome to ElectroHub
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Your One-Stop Shop for{" "}
              <span className="text-primary">Premium Electronics</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Discover the latest headphones, cameras, monitors, and computer parts. 
              Quality products at competitive prices, delivered to your doorstep.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Placeholder for other sections */}
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="text-center">
            <p className="text-muted-foreground">
              More sections coming soon: Features, Products, Testimonials, Newsletter...
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
