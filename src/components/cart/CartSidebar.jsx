"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartSidebar({ onClose }) {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <SheetContent className="flex flex-col w-full sm:max-w-lg">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopping Cart ({cartCount})
        </SheetTitle>
      </SheetHeader>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add some products to get started
          </p>
          <SheetClose asChild>
            <Button asChild onClick={onClose}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-4">
                {/* Image */}
                <Link
                  href={`/products/${item._id}`}
                  onClick={onClose}
                  className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0"
                >
                  <Image
                    src={item.imageUrl || item.image || "/placeholder.svg"}
                    alt={item.title || item.name || "Product image"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item._id}`} onClick={onClose}>
                    <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                      {item.title || item.name}
                    </h4>
                  </Link>
                  {item.brand && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.brand}
                    </p>
                  )}
                  <p className="font-semibold text-primary mt-1">
                    ৳{item.price?.toLocaleString("en-BD")}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Cart Summary */}
          <div className="py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{cartTotal.toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600">
                {cartTotal >= 5000 ? "Free" : "৳100"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">
                ৳{(cartTotal + (cartTotal >= 5000 ? 0 : 100)).toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <SheetClose asChild>
              <Button asChild className="w-full" onClick={onClose}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" asChild className="w-full" onClick={onClose}>
                <Link href="/cart">View Cart</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        </>
      )}
    </SheetContent>
  );
}
