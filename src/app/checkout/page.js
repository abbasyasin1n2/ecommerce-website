"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Container from "@/components/layout/Container";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ChevronLeft,
  Lock,
  CheckCircle2,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    division: "",
    postalCode: "",
  });

  const shippingCost = cartTotal >= 5000 ? 0 : 100;
  const finalTotal = cartTotal + shippingCost;

  // Update form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || prev.firstName,
        lastName: session.user.name?.split(" ").slice(1).join(" ") || prev.lastName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.division
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in backend
      const orderData = {
        userEmail: session?.user?.email || formData.email,
        items: cart.map(item => ({
          productId: item._id,
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl || item.image
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.division,
          postalCode: formData.postalCode
        },
        paymentMethod,
        subtotal: cartTotal,
        shipping: shippingCost,
        total: finalTotal
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();

      // Clear cart and redirect to success page with order ID
      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="py-8 md:py-12 bg-muted/30">
        <Container>
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        </Container>
      </div>
    );
  }

  // Show sign in required message
  if (!session) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <LogIn className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In to Checkout</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Please sign in to your account to complete your purchase. Your cart items will be saved.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/login?callbackUrl=/checkout">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register?callbackUrl=/checkout">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Add some products to your cart before checking out.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-muted/30">
      <Container>
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/cart">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1XXX-XXXXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House #, Road #, Area"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Dhaka"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division *</Label>
                      <Select
                        value={formData.division}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, division: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((div) => (
                            <SelectItem key={div} value={div}>
                              {div}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="1205"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </div>
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "bkash"
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === "bkash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">bKash</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with bKash mobile banking
                      </p>
                    </div>
                    <div className="h-6 w-10 bg-pink-600 rounded text-white text-xs font-bold flex items-center justify-center">
                      bKash
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "nagad"
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={paymentMethod === "nagad"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Nagad</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with Nagad mobile banking
                      </p>
                    </div>
                    <div className="h-6 w-10 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">
                      Nagad
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.imageUrl || item.image || "/placeholder.svg"}
                          alt={item.title || item.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{cartTotal.toLocaleString("en-BD")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                      {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ৳{finalTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order - ৳{finalTotal.toLocaleString("en-BD")}
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Seller
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
