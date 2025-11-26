"use client";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Truck, Shield, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <>
      {/* Main Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Bangladesh&apos;s #1 Electronics Store
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight max-w-4xl"
            >
              Premium Electronics
              <br />
              <span className="text-primary">at Unbeatable Prices</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              Discover the latest smartphones, laptops, cameras, and accessories. 
              Quality products with nationwide delivery across Bangladesh.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="px-8 text-lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                <Link href="/products?subcategory=GPU">
                  View Deals
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free Shipping over ৳5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Featured Cards Section */}
      <section className="relative overflow-hidden py-6 md:py-10 lg:py-12 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Main Hero Card - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 relative bg-gradient-to-br from-green-200 via-green-100 to-green-50 rounded-3xl p-8 md:p-12 min-h-[400px] md:min-h-[500px] overflow-hidden"
            >
              {/* News Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEWS
                </span>
                <span className="text-green-700 text-sm font-medium flex items-center gap-1">
                  Free Shipping on Orders Above ৳5,000!
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 leading-tight max-w-md">
                Gadgets you&apos;ll love.
                <br />
                <span className="text-green-600">Prices you&apos;ll trust.</span>
              </h2>

              {/* Price Tag */}
              <div className="mt-8">
                <p className="text-green-700 text-sm font-medium">Starts from</p>
                <p className="text-4xl md:text-5xl font-bold text-green-900">৳490</p>
              </div>

              {/* CTA Button */}
              <Button 
                size="lg" 
                className="mt-8 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link href="/products">
                  LEARN MORE
                </Link>
              </Button>

              {/* Hero Model Image */}
              <div className="absolute right-0 bottom-0 w-[280px] md:w-[350px] lg:w-[400px] h-[350px] md:h-[450px] lg:h-[500px]">
                <Image
                  src="/staticassests/hero_model_img.png"
                  alt="Happy customer with headphones"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </motion.div>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Best Products Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/products?category=Audio" className="block">
                  <div className="relative bg-gradient-to-br from-orange-200 via-orange-100 to-orange-50 rounded-3xl p-6 md:p-8 h-[200px] md:h-[240px] overflow-hidden group hover:shadow-lg transition-shadow">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Best
                      <br />
                      products
                    </h3>
                    <p className="mt-4 text-gray-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      View more
                      <ArrowRight className="h-4 w-4" />
                    </p>
                    
                    {/* Product Image */}
                    <div className="absolute right-4 bottom-4 w-[100px] md:w-[120px] h-[100px] md:h-[120px]">
                      <Image
                        src="/staticassests/hero_product_img1.png"
                        alt="AirPods"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Discounts Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/products" className="block">
                  <div className="relative bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 rounded-3xl p-6 md:p-8 h-[200px] md:h-[240px] overflow-hidden group hover:shadow-lg transition-shadow">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                      20%
                      <br />
                      <span className="text-blue-600">discounts</span>
                    </h3>
                    <p className="mt-4 text-gray-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      View more
                      <ArrowRight className="h-4 w-4" />
                    </p>
                    
                    {/* Product Image */}
                    <div className="absolute right-4 bottom-4 w-[100px] md:w-[120px] h-[100px] md:h-[120px]">
                      <Image
                        src="/staticassests/hero_product_img2.png"
                        alt="Smart Watch"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
