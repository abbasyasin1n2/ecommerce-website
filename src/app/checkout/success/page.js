"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const displayOrderId = orderId ? orderId.slice(-8).toUpperCase() : "PENDING";

  return (
    <div className="py-16 md:py-24 bg-muted/30 min-h-[80vh]">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your order. We have received your order and will
              begin processing it soon.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-xl font-bold text-primary">#{displayOrderId}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Confirmation email sent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-sm">Order Processing</p>
                    <p className="text-xs text-muted-foreground">1-2 days</p>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">Shipped</p>
                    <p className="text-xs text-muted-foreground">2-3 days</p>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">Delivered</p>
                    <p className="text-xs text-muted-foreground">3-5 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View Orders</Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-16 md:py-24 bg-muted/30 min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
