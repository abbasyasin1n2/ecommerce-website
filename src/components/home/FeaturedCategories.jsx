"use client";

import Container from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Headphones, Camera, Monitor, Cpu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Headphones",
    description: "Premium audio gear for every lifestyle",
    icon: Headphones,
    href: "/products?subcategory=Headphones",
    color: "bg-blue-500/10 text-blue-600",
    count: "4 Products",
  },
  {
    name: "Cameras",
    description: "Capture life's moments in stunning detail",
    icon: Camera,
    href: "/products?subcategory=Camera%20%26%20Photo",
    color: "bg-purple-500/10 text-purple-600",
    count: "4 Products",
  },
  {
    name: "Monitors",
    description: "Crystal clear displays for work & play",
    icon: Monitor,
    href: "/products?subcategory=Monitors",
    color: "bg-green-500/10 text-green-600",
    count: "4 Products",
  },
  {
    name: "Computer Parts",
    description: "Build your dream setup",
    icon: Cpu,
    href: "/products?subcategory=Computer%20Accessories%20%26%20Peripherals",
    color: "bg-orange-500/10 text-orange-600",
    count: "8 Products",
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

export default function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24">
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
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of electronic products across different
            categories. Find exactly what you need.
          </p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link href={category.href}>
                <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${category.color} transition-transform group-hover:scale-110`}
                    >
                      <category.icon className="h-8 w-8" />
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>

                    {/* Count */}
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full mb-4">
                      {category.count}
                    </span>

                    {/* View link */}
                    <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
