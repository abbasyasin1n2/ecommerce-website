"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Filter states from URL
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brand = searchParams.get("brand") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [viewMode, setViewMode] = useState("grid");

  // Update URL with filters
  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change (except when changing page)
      if (!newFilters.hasOwnProperty("page")) {
        params.set("page", "1");
      }

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (subcategory) params.set("subcategory", subcategory);
        if (search) params.set("search", search);
        params.set("page", page.toString());
        params.set("limit", "100"); // Fetch more for client-side filtering

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        let productList = data.products || data;

        // Client-side filtering for price range
        if (minPrice) {
          const min = parseInt(minPrice);
          productList = productList.filter((p) => p.price >= min);
        }
        if (maxPrice) {
          const max = parseInt(maxPrice);
          productList = productList.filter((p) => p.price <= max);
        }

        // Client-side filtering for brand
        if (brand) {
          productList = productList.filter(
            (p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase()
          );
        }

        // Client-side sorting
        if (sort === "price-low") {
          productList.sort((a, b) => a.price - b.price);
        } else if (sort === "price-high") {
          productList.sort((a, b) => b.price - a.price);
        } else if (sort === "rating") {
          productList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sort === "name") {
          productList.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        setProducts(productList);
        setPagination({
          total: productList.length,
          page: 1,
          limit: 12,
          totalPages: Math.ceil(productList.length / 12) || 1,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, subcategory, search, sort, page, minPrice, maxPrice, brand]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    router.push("/products");
  };

  const hasActiveFilters = category || subcategory || search || minPrice || maxPrice || brand;

  // Get price range label
  const getPriceRangeLabel = () => {
    if (minPrice && maxPrice) {
      return `৳${parseInt(minPrice).toLocaleString()} - ৳${parseInt(maxPrice).toLocaleString()}`;
    } else if (minPrice) {
      return `Over ৳${parseInt(minPrice).toLocaleString()}`;
    } else if (maxPrice) {
      return `Under ৳${parseInt(maxPrice).toLocaleString()}`;
    }
    return null;
  };

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {subcategory || category || "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? "Loading products..."
              : `Showing ${products.length} of ${pagination.total} products`}
          </p>
        </div>

        {/* Search and Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sort} onValueChange={(value) => updateFilters({ sort: value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden md:flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters
                    category={category}
                    subcategory={subcategory}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    brand={brand}
                    onFilterChange={updateFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {category && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters({ category: "", subcategory: "" })}
              >
                {category}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {subcategory && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters({ subcategory: "" })}
              >
                {subcategory}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {search && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: "" });
                }}
              >
                &ldquo;{search}&rdquo;
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {(minPrice || maxPrice) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters({ minPrice: "", maxPrice: "" })}
              >
                {getPriceRangeLabel()}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {brand && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters({ brand: "" })}
              >
                {brand}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <ProductFilters
              category={category}
              subcategory={subcategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brand={brand}
              onFilterChange={updateFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => updateFilters({ page: (page - 1).toString() })}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={page === i + 1 ? "default" : "outline"}
                          size="icon"
                          onClick={() => updateFilters({ page: (i + 1).toString() })}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      disabled={page >= pagination.totalPages}
                      onClick={() => updateFilters({ page: (page + 1).toString() })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
