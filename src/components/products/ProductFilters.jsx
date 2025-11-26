"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Headphones, 
  Monitor, 
  Check,
  Star,
  RotateCcw
} from "lucide-react";
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

const ratingOptions = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 2, label: "2★ & above" },
  { value: 1, label: "1★ & above" },
];

// Price constants
const MIN_PRICE = 0;
const MAX_PRICE = 200000;

export default function ProductFilters({
  category,
  subcategory,
  minPrice,
  maxPrice,
  brand,
  minRating,
  inStock,
  onFilterChange,
}) {
  // Derive initial values from props
  const initialMin = minPrice ? parseInt(minPrice) : MIN_PRICE;
  const initialMax = maxPrice ? parseInt(maxPrice) : MAX_PRICE;
  
  // Local state for price slider to avoid too many URL updates
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
  const [minPriceInput, setMinPriceInput] = useState(minPrice || "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice || "");
  
  // Track if props changed externally (e.g., clear filters)
  const [lastMinPrice, setLastMinPrice] = useState(minPrice);
  const [lastMaxPrice, setLastMaxPrice] = useState(maxPrice);
  
  // Only sync when props actually change from parent (not from our own changes)
  if (minPrice !== lastMinPrice || maxPrice !== lastMaxPrice) {
    setPriceRange([
      minPrice ? parseInt(minPrice) : MIN_PRICE,
      maxPrice ? parseInt(maxPrice) : MAX_PRICE,
    ]);
    setMinPriceInput(minPrice || "");
    setMaxPriceInput(maxPrice || "");
    setLastMinPrice(minPrice);
    setLastMaxPrice(maxPrice);
  }

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

  // Handle price slider change (update local state only)
  const handlePriceSliderChange = (values) => {
    setPriceRange(values);
    setMinPriceInput(values[0].toString());
    setMaxPriceInput(values[1].toString());
  };

  // Apply price filter when slider stops or button clicked
  const applyPriceFilter = () => {
    onFilterChange({
      minPrice: priceRange[0] > MIN_PRICE ? priceRange[0].toString() : "",
      maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1].toString() : "",
    });
  };

  // Handle manual price input
  const handlePriceInputChange = (type, value) => {
    const numValue = value.replace(/[^0-9]/g, "");
    if (type === "min") {
      setMinPriceInput(numValue);
      setPriceRange([parseInt(numValue) || MIN_PRICE, priceRange[1]]);
    } else {
      setMaxPriceInput(numValue);
      setPriceRange([priceRange[0], parseInt(numValue) || MAX_PRICE]);
    }
  };

  const handlePriceInputBlur = () => {
    // Validate and apply
    const min = Math.max(MIN_PRICE, Math.min(parseInt(minPriceInput) || MIN_PRICE, MAX_PRICE));
    const max = Math.min(MAX_PRICE, Math.max(parseInt(maxPriceInput) || MAX_PRICE, MIN_PRICE));
    
    if (min <= max) {
      setPriceRange([min, max]);
      onFilterChange({
        minPrice: min > MIN_PRICE ? min.toString() : "",
        maxPrice: max < MAX_PRICE ? max.toString() : "",
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

  const handleRatingChange = (rating) => {
    if (minRating === rating.toString()) {
      onFilterChange({ minRating: "" });
    } else {
      onFilterChange({ minRating: rating.toString() });
    }
  };

  const handleInStockChange = (checked) => {
    onFilterChange({ inStock: checked ? "true" : "" });
  };

  const clearAllFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setMinPriceInput("");
    setMaxPriceInput("");
    onFilterChange({
      category: "",
      subcategory: "",
      minPrice: "",
      maxPrice: "",
      brand: "",
      minRating: "",
      inStock: "",
    });
  };

  const hasActiveFilters = category || subcategory || minPrice || maxPrice || brand || minRating || inStock;

  return (
    <div className="space-y-1">
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground mb-4"
          onClick={clearAllFilters}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      <Accordion type="multiple" defaultValue={["categories", "price", "brands", "rating"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  {/* Main Category */}
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors ${
                      category === cat.name && !subcategory
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <cat.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>

                  {/* Subcategories */}
                  <div className="ml-6 space-y-1">
                    {cat.subcategories.map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => handleSubcategoryClick(cat.name, subcat)}
                        className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                          subcategory === subcat
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {/* Price Slider */}
              <div className="px-2">
                <Slider
                  value={priceRange}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={1000}
                  onValueChange={handlePriceSliderChange}
                  onValueCommit={applyPriceFilter}
                  className="w-full"
                />
              </div>

              {/* Price Range Display */}
              <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>৳{priceRange[0].toLocaleString("en-BD")}</span>
                <span>৳{priceRange[1].toLocaleString("en-BD")}</span>
              </div>

              {/* Manual Price Inputs */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="text"
                    placeholder="0"
                    value={minPriceInput}
                    onChange={(e) => handlePriceInputChange("min", e.target.value)}
                    onBlur={handlePriceInputBlur}
                    onKeyDown={(e) => e.key === "Enter" && handlePriceInputBlur()}
                    className="h-8 text-sm"
                  />
                </div>
                <span className="text-muted-foreground mt-5">-</span>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="text"
                    placeholder="200,000"
                    value={maxPriceInput}
                    onChange={(e) => handlePriceInputChange("max", e.target.value)}
                    onBlur={handlePriceInputBlur}
                    onKeyDown={(e) => e.key === "Enter" && handlePriceInputBlur()}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Quick Price Presets */}
              <div className="flex flex-wrap gap-1">
                {[
                  { label: "Under ৳5K", min: 0, max: 5000 },
                  { label: "৳5K-15K", min: 5000, max: 15000 },
                  { label: "৳15K-50K", min: 15000, max: 50000 },
                  { label: "৳50K+", min: 50000, max: MAX_PRICE },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant={
                      priceRange[0] === preset.min && priceRange[1] === preset.max
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => {
                      setPriceRange([preset.min, preset.max]);
                      setMinPriceInput(preset.min > 0 ? preset.min.toString() : "");
                      setMaxPriceInput(preset.max < MAX_PRICE ? preset.max.toString() : "");
                      onFilterChange({
                        minPrice: preset.min > MIN_PRICE ? preset.min.toString() : "",
                        maxPrice: preset.max < MAX_PRICE ? preset.max.toString() : "",
                      });
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-semibold">
            Customer Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRatingChange(option.value)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                    minRating === option.value.toString()
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < option.value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& up</span>
                  {minRating === option.value.toString() && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger className="text-sm font-semibold">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2 max-h-64 overflow-y-auto">
              {popularBrands.map((b) => (
                <div key={b} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${b}`}
                    checked={brand === b}
                    onCheckedChange={() => handleBrandClick(b)}
                  />
                  <label
                    htmlFor={`brand-${b}`}
                    className="text-sm cursor-pointer flex-1 py-1"
                  >
                    {b}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={inStock === "true"}
                  onCheckedChange={handleInStockChange}
                />
                <label htmlFor="in-stock" className="text-sm cursor-pointer">
                  In Stock Only
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
