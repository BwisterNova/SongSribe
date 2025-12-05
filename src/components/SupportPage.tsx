import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Bug, CreditCard, ArrowLeft, Send, CheckCircle, XCircle } from "lucide-react";

interface SupportPageProps {
  onBack: () => void;
}

type CategoryType = "review" | "bug" | "billing" | null;

function SupportPage({ onBack }: SupportPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  
  // Form states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSeverity, setBugSeverity] = useState("");
  const [billingIssue, setBillingIssue] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingDescription, setBillingDescription] = useState("");

  const categories = [
    {
      id: "review" as CategoryType,
      icon: Star,
      title: "Review",
      description: "Share your experience and help us improve SongScribe",
      hoverBg: "hover:bg-yellow-500/10",
      hoverBorder: "hover:border-yellow-500/50",
      activeBg: "bg-yellow-500/10",
      activeBorder: "border-yellow-500/50",
      iconColor: "text-yellow-500",
    },
    {
      id: "bug" as CategoryType,
      icon: Bug,
      title: "Bug Report",
      description: "Found something broken? Let us know so we can fix it",
      hoverBg: "hover:bg-red-500/10",
      hoverBorder: "hover:border-red-500/50",
      activeBg: "bg-red-500/10",
      activeBorder: "border-red-500/50",
      iconColor: "text-red-500",
    },
    {
      id: "billing" as CategoryType,
      icon: CreditCard,
      title: "Billing Issue / Refund",
      description: "Questions about payments, subscriptions, or refund requests",
      hoverBg: "hover:bg-green-500/10",
      hoverBorder: "hover:border-green-500/50",
      activeBg: "bg-green-500/10",
      activeBorder: "border-green-500/50",
      iconColor: "text-green-500",
    },
  ];

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setShowModal(true);
    setSubmitStatus(null);
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setBugTitle("");
    setBugDescription("");
    setBugSeverity("");
    setBillingIssue("");
    setBillingEmail("");
    setBillingDescription("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate success (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;
    
    setIsSubmitting(false);
    setSubmitStatus(isSuccess ? "success" : "error");
    
    if (isSuccess) {
      setTimeout(() => {
        setShowModal(false);
        setSelectedCategory(null);
        resetForm();
        setSubmitStatus(null);
      }, 2000);
    }
  };

  const renderReviewForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          How would you rate SongScribe?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Your Review
        </label>
        <Textarea
          placeholder="Tell us what you think about SongScribe..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={5}
          className="bg-background/50 border-purple-500/20 focus:border-yellow-500/50"
        />
      </div>
    </div>
  );

  const renderBugForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Bug Title
        </label>
        <Input
          placeholder="Brief description of the issue..."
          value={bugTitle}
          onChange={(e) => setBugTitle(e.target.value)}
          className="bg-background/50 border-purple-500/20 focus:border-red-500/50"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Severity
        </label>
        <Select value={bugSeverity} onValueChange={setBugSeverity}>
          <SelectTrigger className="bg-background/50 border-purple-500/20 focus:border-red-500/50">
            <SelectValue placeholder="Select severity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Minor inconvenience</SelectItem>
            <SelectItem value="medium">Medium - Feature not working properly</SelectItem>
            <SelectItem value="high">High - Major functionality broken</SelectItem>
            <SelectItem value="critical">Critical - App is unusable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Description
        </label>
        <Textarea
          placeholder="Please describe the bug in detail. Include steps to reproduce if possible..."
          value={bugDescription}
          onChange={(e) => setBugDescription(e.target.value)}
          rows={5}
          className="bg-background/50 border-purple-500/20 focus:border-red-500/50"
        />
      </div>
    </div>
  );

  const renderBillingForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Issue Type
        </label>
        <Select value={billingIssue} onValueChange={setBillingIssue}>
          <SelectTrigger className="bg-background/50 border-purple-500/20 focus:border-green-500/50">
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="refund">Refund Request</SelectItem>
            <SelectItem value="charge">Unexpected Charge</SelectItem>
            <SelectItem value="subscription">Subscription Issue</SelectItem>
            <SelectItem value="payment">Payment Failed</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
          className="bg-background/50 border-purple-500/20 focus:border-green-500/50"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Description
        </label>
        <Textarea
          placeholder="Please describe your billing issue in detail..."
          value={billingDescription}
          onChange={(e) => setBillingDescription(e.target.value)}
          rows={5}
          className="bg-background/50 border-purple-500/20 focus:border-green-500/50"
        />
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (selectedCategory) {
      case "review":
        return "Leave a Review";
      case "bug":
        return "Report a Bug";
      case "billing":
        return "Billing Issue / Refund Request";
      default:
        return "";
    }
  };

  const getButtonColor = () => {
    switch (selectedCategory) {
      case "review":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "bug":
        return "bg-red-600 hover:bg-red-700";
      case "billing":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-purple-600 hover:bg-purple-700";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-purple-500/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Support & Contact
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              We're here to help you
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Select a Category
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Choose the type of support you need and we'll guide you through the process
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? `${category.activeBg} ${category.activeBorder}`
                      : `bg-card/50 dark:bg-card/50 border-purple-500/20 ${category.hoverBg} ${category.hoverBorder}`
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-background/50 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-card/30 dark:bg-card/30 rounded-2xl p-6 border border-purple-500/20">
          <h3 className="font-semibold text-foreground mb-3">Need immediate help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For urgent matters, you can reach us directly at:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-purple-400">📧 support@songscribe.app</p>
            <p className="text-purple-400">🐦 @SongScribeApp on Twitter</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>

          {submitStatus === "success" ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Sent Successfully!
              </h3>
              <p className="text-muted-foreground">
                Thank you for your feedback. We'll get back to you soon.
              </p>
            </div>
          ) : submitStatus === "error" ? (
            <div className="py-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Submission Failed
              </h3>
              <p className="text-muted-foreground mb-4">
                Something went wrong. Please try again.
              </p>
              <Button
                onClick={() => setSubmitStatus(null)}
                variant="outline"
                className="border-purple-500/30"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="py-4">
                {selectedCategory === "review" && renderReviewForm()}
                {selectedCategory === "bug" && renderBugForm()}
                {selectedCategory === "billing" && renderBillingForm()}
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={getButtonColor()}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupportPage;
