"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare } from "lucide-react";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import Link from "next/link";

export default function ProductReviews({ productId }) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [userReview, setUserReview] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${productId}?sort=${sortBy}&page=${page}&limit=5`
      );
      const data = await res.json();
      
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy, page]);

  const fetchUserReview = useCallback(async () => {
    if (!session?.user?.email) return;
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user/${encodeURIComponent(session.user.email)}/product/${productId}`
      );
      const data = await res.json();
      setUserReview(data.review);
    } catch (error) {
      console.error("Failed to fetch user review:", error);
    }
  }, [session?.user?.email, productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserReview();
    }
  }, [status, fetchUserReview]);

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
    setLoading(true);
  };

  const handleReviewSubmitted = (newReview) => {
    setUserReview(newReview);
    setPage(1);
    setLoading(true);
    fetchReviews();
  };

  const handleReviewUpdated = (updatedReview) => {
    setUserReview(updatedReview);
    setReviews((prev) =>
      prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );
  };

  const handleReviewDeleted = (reviewId) => {
    setUserReview(null);
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    // Refresh to update stats
    setPage(1);
    setLoading(true);
    fetchReviews();
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-6">
        <div className="flex gap-8">
          <Skeleton className="h-32 w-32" />
          <div className="flex-1 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg min-w-[150px]">
          <span className="text-4xl font-bold">
            {stats?.averageRating || "0.0"}
          </span>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(parseFloat(stats?.averageRating) || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {stats?.totalReviews || 0} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats?.distribution?.[rating] || 0;
            const percentage = stats?.totalReviews
              ? (count / stats.totalReviews) * 100
              : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Write Review Button */}
        <div className="flex flex-col items-center justify-center gap-3">
          {status === "authenticated" ? (
            userReview ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  You already reviewed this product
                </p>
                <ReviewForm
                  productId={productId}
                  existingReview={userReview}
                  onReviewSubmitted={handleReviewUpdated}
                />
              </div>
            ) : (
              <ReviewForm
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to write a review
              </p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sort & Filter */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Customer Reviews ({stats?.totalReviews || 0})
          </h3>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              productId={productId}
              onReviewUpdated={handleReviewUpdated}
              onReviewDeleted={handleReviewDeleted}
            />
          ))}

          {/* Load More */}
          {pagination && page < pagination.totalPages && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={loadMore}>
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">
            No reviews yet. Be the first to review this product!
          </p>
          {status === "authenticated" && !userReview && (
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}
        </div>
      )}
    </div>
  );
}
