'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Star, ArrowRight, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/wishlist');
    }
  }, [status, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="py-8 md:py-12">
        <Container>
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <LogIn className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Please sign in to view and manage your wishlist.
            </p>
            <Button size="lg" asChild>
              <Link href="/login?callbackUrl=/wishlist">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleRemove = (productId, productTitle) => {
    removeFromWishlist(productId);
    toast.success(`${productTitle} removed from wishlist`);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach(product => {
      addToCart(product);
    });
    clearWishlist();
    toast.success('All items moved to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Save items you love by clicking the heart icon on products. They&apos;ll appear here for easy access later.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              if (confirm('Are you sure you want to clear your wishlist?')) {
                clearWishlist();
                toast.success('Wishlist cleared');
              }
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={handleMoveAllToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add All to Cart
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product._id} className="group overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <Link href={`/products/${product._id}`}>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </Link>
                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(product._id, product.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-1">
                    {product.title}
                  </h3>
                </Link>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ৳{product.price?.toLocaleString()}
                  </span>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
