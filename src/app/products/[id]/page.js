"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const productName = product.title || product.name;
    const productImage = product.imageUrl || product.image || "/placeholder.svg";
    const productCategory = product.subcategory || product.category;
    
    // Add to cart with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        name: productName,
        price: product.price,
        originalPrice: product.originalPrice,
        image: productImage,
        category: productCategory,
      });
    }
    
    toast.success(`${quantity} ${productName} added to cart!`);
  };

  const handleAddToWishlist = () => {
    toast.success("Added to wishlist!");
  };

  const productInCart = product ? isInCart(product._id) : false;
  const cartQuantity = product ? getItemQuantity(product._id) : 0;

  if (loading) {
    return (
      <div className="py-8 md:py-12">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-8 md:py-12">
        <Container>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Normalize field names
  const productName = product.title || product.name;
  const productImage = product.imageUrl || product.image || "/placeholder.svg";
  const productCategory = product.subcategory || product.category;
  const productDescription = product.fullDescription || product.description || "";
  const productFeatures = product.features || [];
  const productSpecs = product.specifications || {};

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Mock images array (in real app, product would have multiple images)
  const images = [productImage];

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          {productCategory !== product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{productCategory}</span>
            </>
          )}
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={images[selectedImage]}
                alt={productName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-lg px-3 py-1">
                  -{discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery - for future multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              {product.brand && (
                <Badge variant="secondary">{product.brand}</Badge>
              )}
              <Badge variant="outline">{productCategory}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold">{productName}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Rating
                value={product.rating || 0}
                readOnly
                style={{ maxWidth: 120 }}
              />
              <span className="text-muted-foreground">
                {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-muted-foreground">{product.shortDescription}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                ৳{product.price?.toLocaleString("en-BD")}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ৳{product.originalPrice?.toLocaleString("en-BD")}
                </span>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1" 
                onClick={handleAddToCart}
                variant={productInCart ? "secondary" : "default"}
              >
                {productInCart ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    In Cart ({cartQuantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
              >
                <Heart className="mr-2 h-5 w-5" />
                Wishlist
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <Truck className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-medium">Free Shipping</span>
                <span className="text-xs text-muted-foreground">Over ৳5,000</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-medium">Warranty</span>
                <span className="text-xs text-muted-foreground">1 Year</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <RotateCcw className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-medium">Easy Returns</span>
                <span className="text-xs text-muted-foreground">30 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {productDescription}
                </p>

                {productFeatures.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {productFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              {Object.keys(productSpecs).length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(productSpecs).map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <td className="px-4 py-3 font-medium w-1/3">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No specifications available for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
                <Button variant="outline">Write a Review</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
