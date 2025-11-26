"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product, viewMode = "grid" }) {
  const { addToCart, isInCart } = useCart();
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Normalize field names
  const productName = product.title || product.name;
  const productImage = product.imageUrl || product.image || "/placeholder.svg";
  const productCategory = product.subcategory || product.category;
  const productDescription = product.shortDescription || product.description || "";

  const inCart = isInCart(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id,
      name: productName,
      price: product.price,
      originalPrice: product.originalPrice,
      image: productImage,
      category: productCategory,
    });
    
    toast.success(`${productName} added to cart!`);
  };

  if (viewMode === "list") {
    return (
      <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <Link
          href={`/products/${product._id}`}
          className="relative w-full sm:w-48 aspect-square sm:aspect-auto sm:h-48 shrink-0 bg-muted"
        >
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 200px"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{discountPercent}%
            </Badge>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {productCategory}
          </p>

          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">
              {productName}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {productDescription}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <Rating value={product.rating || 0} readOnly style={{ maxWidth: 100 }} />
            <span className="text-sm text-muted-foreground">
              {product.rating?.toFixed(1)} ({product.reviews || 0})
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
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

            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddToCart}
                variant={inCart ? "secondary" : "default"}
              >
                {inCart ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View (default)
  return (
    <Card className="group overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link
        href={`/products/${product._id}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            -{discountPercent}%
          </Badge>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {productCategory}
        </p>

        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
            {productName}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Rating value={product.rating || 0} readOnly style={{ maxWidth: 100 }} />
          <span className="text-sm text-muted-foreground">
            {product.rating?.toFixed(1)}
          </span>
        </div>

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
        <Button 
          className="w-full" 
          size="sm" 
          onClick={handleAddToCart}
          variant={inCart ? "secondary" : "default"}
        >
          {inCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
