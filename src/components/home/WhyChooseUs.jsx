"use client";

import Container from "@/components/layout/Container";
import { Truck, Shield, RotateCcw, CreditCard, Headphones, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Free & Fast Shipping",
    description: "Free shipping on orders over ৳5,000. Most orders arrive within 2-3 business days.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is processed securely with industry-standard encryption.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Pay your way with credit cards, PayPal, or buy now pay later options.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is here to help you anytime, day or night.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "All products come with manufacturer warranty and our quality guarantee.",
  },
];

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

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Why Choose ElectroHub?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re committed to providing the best shopping experience with quality
            products and exceptional service.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-4 p-6 rounded-xl bg-background border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
