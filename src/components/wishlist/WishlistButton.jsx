'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function WishlistButton({ product, variant = 'icon', className }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const inWishlist = session ? isInWishlist(product._id) : false;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Require login to use wishlist
    if (!session) {
      toast.error('Please sign in to add items to your wishlist');
      router.push('/login');
      return;
    }
    
    const added = toggleWishlist(product);
    if (added) {
      toast.success('Added to wishlist');
    } else {
      toast.success('Removed from wishlist');
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow-sm",
          inWishlist && "text-red-500 hover:text-red-600",
          className
        )}
        onClick={handleToggle}
      >
        <Heart 
          className={cn("h-5 w-5", inWishlist && "fill-current")} 
        />
      </Button>
    );
  }

  return (
    <Button
      variant={inWishlist ? "default" : "outline"}
      className={cn(
        inWishlist && "bg-red-500 hover:bg-red-600",
        className
      )}
      onClick={handleToggle}
    >
      <Heart className={cn("mr-2 h-4 w-4", inWishlist && "fill-current")} />
      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </Button>
  );
}
