"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Star, ThumbsUp, MoreVertical, Trash2, Edit, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import ReviewForm from "./ReviewForm";

export default function ReviewCard({ review, productId, onReviewUpdated, onReviewDeleted }) {
  const { data: session } = useSession();
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = session?.user?.email === review.userEmail;

  const handleMarkHelpful = async () => {
    if (hasMarkedHelpful) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review._id}/helpful`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to mark as helpful");

      setHelpful((prev) => prev + 1);
      setHasMarkedHelpful(true);
      toast.success("Thanks for your feedback!");
    } catch (error) {
      toast.error("Failed to mark as helpful");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review._id}?userEmail=${encodeURIComponent(session.user.email)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete review");
      }

      toast.success("Review deleted successfully");
      setShowDeleteDialog(false);
      
      if (onReviewDeleted) {
        onReviewDeleted(review._id);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userImage} alt={review.userName} />
            <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName || "Anonymous"}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              {review.updatedAt !== review.createdAt && " (edited)"}
            </p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ReviewForm
                productId={productId}
                existingReview={review}
                onReviewSubmitted={onReviewUpdated}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Review
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        {review.title && (
          <span className="font-medium">{review.title}</span>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Footer - Helpful */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${hasMarkedHelpful ? "text-primary" : "text-muted-foreground"}`}
          onClick={handleMarkHelpful}
          disabled={hasMarkedHelpful || isOwner}
        >
          <ThumbsUp className={`h-4 w-4 mr-1 ${hasMarkedHelpful ? "fill-current" : ""}`} />
          Helpful ({helpful})
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
