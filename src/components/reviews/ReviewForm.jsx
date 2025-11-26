"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Star, Loader2, Edit, X } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm({ 
  productId, 
  existingReview = null, 
  onReviewSubmitted,
  trigger 
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const isEditing = !!existingReview;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${existingReview._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`;
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userEmail: session.user.email,
          userName: session.user.name,
          userImage: session.user.image,
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(isEditing ? "Review updated successfully!" : "Review submitted successfully!");
      setOpen(false);
      
      if (onReviewSubmitted) {
        onReviewSubmitted(data.review);
      }

      // Reset form if not editing
      if (!isEditing) {
        setRating(0);
        setTitle("");
        setComment("");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || rating;

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditing ? "outline" : "default"}>
            {isEditing ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Review
              </>
            ) : (
              "Write a Review"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Your Review" : "Write a Review"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update your review for this product"
                : "Share your experience with this product"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Your Rating *</Label>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= displayRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {displayRating > 0 && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {ratingLabels[displayRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                placeholder="Sum up your experience in a few words"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Tell others what you liked or disliked about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : (
                isEditing ? "Update Review" : "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
