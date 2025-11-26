"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Headphones, Monitor, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";

const categoryData = [
  {
    name: "Electronics",
    icon: Headphones,
    subcategories: ["Headphones", "Camera & Photo"],
  },
  {
    name: "Computer",
    icon: Monitor,
    subcategories: ["Monitors", "Computer Accessories & Peripherals", "GPU"],
  },
];

const priceRanges = [
  { label: "Under ৳5,000", min: 0, max: 5000 },
  { label: "৳5,000 - ৳15,000", min: 5000, max: 15000 },
  { label: "৳15,000 - ৳50,000", min: 15000, max: 50000 },
  { label: "Over ৳50,000", min: 50000, max: Infinity },
];

const popularBrands = [
  "Skullcandy",
  "Raycon",
  "Philips",
  "Sennheiser",
  "ASUS",
  "MSI",
  "AMD",
  "Fujifilm",
  "Dell",
  "Corsair",
  "PowerColor",
  "GIGABYTE",
];

export default function ProductFilters({
  category,
  subcategory,
  minPrice,
  maxPrice,
  brand,
  onFilterChange,
}) {
  const [expandedCategories, setExpandedCategories] = useState(
    categoryData.map((c) => c.name)
  );

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCategoryClick = (cat) => {
    if (category === cat) {
      onFilterChange({ category: "", subcategory: "" });
    } else {
      onFilterChange({ category: cat, subcategory: "" });
    }
  };

  const handleSubcategoryClick = (cat, subcat) => {
    if (subcategory === subcat) {
      onFilterChange({ subcategory: "" });
    } else {
      onFilterChange({ category: cat, subcategory: subcat });
    }
  };

  const handlePriceRangeClick = (range) => {
    const currentMin = minPrice ? parseInt(minPrice) : null;
    const currentMax = maxPrice ? parseInt(maxPrice) : null;

    // If same range is clicked, clear it
    if (currentMin === range.min && (currentMax === range.max || (range.max === Infinity && !maxPrice))) {
      onFilterChange({ minPrice: "", maxPrice: "" });
    } else {
      onFilterChange({
        minPrice: range.min.toString(),
        maxPrice: range.max === Infinity ? "" : range.max.toString(),
      });
    }
  };

  const handleBrandClick = (selectedBrand) => {
    if (brand === selectedBrand) {
      onFilterChange({ brand: "" });
    } else {
      onFilterChange({ brand: selectedBrand });
    }
  };

  const isPriceRangeActive = (range) => {
    const currentMin = minPrice ? parseInt(minPrice) : null;
    const currentMax = maxPrice ? parseInt(maxPrice) : null;

    if (range.max === Infinity) {
      return currentMin === range.min && !maxPrice;
    }
    return currentMin === range.min && currentMax === range.max;
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categoryData.map((cat) => (
            <div key={cat.name} className="space-y-1">
              {/* Main Category */}
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={`text-sm ${
                      category === cat.name ? "font-semibold text-primary" : ""
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
                {expandedCategories.includes(cat.name) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.includes(cat.name) && (
                <div className="ml-6 space-y-1">
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left p-2 text-sm rounded-md hover:bg-muted transition-colors ${
                      category === cat.name && !subcategory
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    All {cat.name}
                  </button>
                  {cat.subcategories.map((subcat) => (
                    <button
                      key={subcat}
                      onClick={() => handleSubcategoryClick(cat.name, subcat)}
                      className={`w-full text-left p-2 text-sm rounded-md hover:bg-muted transition-colors ${
                        subcategory === subcat
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={range.label}
              variant={isPriceRangeActive(range) ? "default" : "outline"}
              size="sm"
              className="w-full justify-between"
              onClick={() => handlePriceRangeClick(range)}
            >
              {range.label}
              {isPriceRangeActive(range) && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Popular Brands</Label>
        <div className="flex flex-wrap gap-2">
          {popularBrands.map((b) => (
            <Button
              key={b}
              variant={brand === b ? "default" : "outline"}
              size="sm"
              onClick={() => handleBrandClick(b)}
            >
              {b}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
