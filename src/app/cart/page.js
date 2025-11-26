"use client";

import { useCart } from "@/context/CartContext";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [couponCode, setCouponCode] = useState("");

  const shippingCost = cartTotal >= 5000 ? 0 : 100;
  const finalTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. 
              Start shopping and discover amazing electronics!
            </p>
            <Button size="lg" asChild>
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      href={`/products/${item._id}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted shrink-0"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <Link href={`/products/${item._id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          {item.category && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.category}
                            </p>
                          )}
                        </div>
                        <p className="text-xl font-bold text-primary shrink-0">
                          ৳{item.price?.toLocaleString("en-BD")}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Qty:</span>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground hidden md:block">
                            Subtotal:{" "}
                            <span className="font-semibold text-foreground">
                              ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                            </span>
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">Apply</Button>
                </div>

                <Separator className="mb-4" />

                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{cartTotal.toLocaleString("en-BD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                      {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders over ৳5,000
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ৳{finalTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button size="lg" className="w-full mt-6" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
