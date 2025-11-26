"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-6 w-24" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Use title/imageUrl from API, fallback to name/image for flexibility
  const productName = product.title || product.name;
  const productImage = product.imageUrl || product.image || "/placeholder.svg";
  const productCategory = product.subcategory || product.category;

  return (
    <motion.div variants={itemVariants}>
      <Card className="group overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <Link href={`/products/${product._id}`} className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              -{discountPercent}%
            </Badge>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Low Stock
            </Badge>
          )}
        </Link>

        {/* Content */}
        <CardContent className="p-4 flex-1">
          {/* Category */}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {productCategory}
          </p>

          {/* Name */}
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
              {productName}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating
              value={product.rating || 0}
              readOnly
              style={{ maxWidth: 100 }}
            />
            <span className="text-sm text-muted-foreground">
              {product.rating?.toFixed(1)} ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              ৳{product.price?.toLocaleString("en-BD")}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ৳{product.originalPrice?.toLocaleString("en-BD")}
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button className="w-full group/btn" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=8`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        // API returns { products: [...], pagination: {...} }
        const productList = data.products || data;
        setProducts(productList.slice(0, 8)); // Ensure max 8 products
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Check out our handpicked selection of top electronics
            </p>
          </div>
          <Button variant="outline" className="mt-4 sm:mt-0 group" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Unable to load products. Please try again later.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
