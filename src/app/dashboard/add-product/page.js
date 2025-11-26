"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Plus, ImageIcon, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { value: "Electronics", subcategories: ["Headphones", "Camera & Photo"] },
  { value: "Computer", subcategories: ["Monitors", "Computer Accessories & Peripherals", "GPU"] },
];

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brand: "",
    specifications: "",
    features: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/dashboard/add-product");
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    if (!imageUrl) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value, subcategory: "" }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Parse specifications and features
      let specifications = {};
      if (formData.specifications.trim()) {
        formData.specifications.split("\n").forEach((line) => {
          const [key, value] = line.split(":").map((s) => s.trim());
          if (key && value) {
            specifications[key] = value;
          }
        });
      }

      const features = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f);

      const productData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        imageUrl: imageUrl,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand.trim(),
        specifications,
        features,
        createdBy: session.user.email,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/dashboard/manage-products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.value === formData.category);

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to add a new product to the store.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of the product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Product Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Sony WH-1000XM5 Wireless Headphones"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">
                      Short Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      placeholder="Brief description (1-2 sentences)"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={2}
                      className={errors.shortDescription ? "border-destructive" : ""}
                    />
                    {errors.shortDescription && (
                      <p className="text-sm text-destructive">{errors.shortDescription}</p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <Textarea
                      id="fullDescription"
                      name="fullDescription"
                      placeholder="Detailed product description..."
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Set the product price in Bangladeshi Taka (৳)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Price (৳) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="29999"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price}</p>
                      )}
                    </div>

                    {/* Original Price (for discount) */}
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">
                        Original Price (৳) <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        placeholder="35999"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-muted-foreground">
                        Set this higher than price to show a discount
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category & Brand */}
              <Card>
                <CardHeader>
                  <CardTitle>Category & Brand</CardTitle>
                  <CardDescription>
                    Organize your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category}</p>
                      )}
                    </div>

                    {/* Subcategory */}
                    <div className="space-y-2">
                      <Label>Subcategory</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, subcategory: value }))
                        }
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="e.g., Sony, Samsung, Apple"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Specifications & Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications & Features</CardTitle>
                  <CardDescription>
                    Add technical details (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Specifications */}
                  <div className="space-y-2">
                    <Label htmlFor="specifications">
                      Specifications
                      <span className="text-muted-foreground ml-2">(one per line, format: Key: Value)</span>
                    </Label>
                    <Textarea
                      id="specifications"
                      name="specifications"
                      placeholder="Color: Black&#10;Weight: 250g&#10;Battery Life: 30 hours"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <Label htmlFor="features">
                      Features
                      <span className="text-muted-foreground ml-2">(one per line)</span>
                    </Label>
                    <Textarea
                      id="features"
                      name="features"
                      placeholder="Industry-leading noise cancellation&#10;30-hour battery life&#10;Touch sensor controls"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Image */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>
                    Upload an image for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  <div className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted relative ${errors.image ? 'border-destructive' : 'border-muted-foreground/25'}`}>
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt="Product preview"
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : uploading ? (
                      <div className="text-center p-6">
                        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Uploading image...
                        </p>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-center p-6 w-full h-full flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm font-medium text-primary">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </label>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image}</p>
                  )}
                  {imageUrl && (
                    <p className="text-xs text-muted-foreground break-all">
                      {imageUrl}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
