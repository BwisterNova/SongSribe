import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Check,
  Zap,
  Crown,
  Music,
  CreditCard,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutPageProps {
  onBack: () => void;
  planId: string;
  billingCycle: "monthly" | "yearly";
}

function CheckoutPage({ onBack, planId, billingCycle }: CheckoutPageProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = {
    pro: {
      name: "Pro",
      icon: Zap,
      price: { monthly: 9.99, yearly: 99.99 },
      gradient: "from-purple-600 to-blue-600",
      features: [
        "Unlimited song identifications",
        "Full lyrics with timestamps",
        "PDF, DOCX & TXT downloads",
        "QR codes on exports",
        "Priority audio recognition",
        "No ads",
        "Email support",
      ],
    },
    premium: {
      name: "Premium",
      icon: Crown,
      price: { monthly: 19.99, yearly: 199.99 },
      gradient: "from-amber-500 to-orange-600",
      features: [
        "Everything in Pro",
        "API access",
        "Bulk song identification",
        "Custom branding on exports",
        "Advanced analytics",
        "Priority support (24/7)",
        "Early access to new features",
      ],
    },
  };

  const selectedPlan = plans[planId as keyof typeof plans];
  const price = billingCycle === "monthly" ? selectedPlan.price.monthly : selectedPlan.price.yearly;
  const Icon = selectedPlan.icon;

  // Convert price to kobo (Paystack uses smallest currency unit)
  // For USD, we'll use cents. For NGN, we'll use kobo.
  // Assuming price is in USD, converting to kobo (1 USD ≈ 1500 NGN for demo)
  const amountInKobo = Math.round(price * 100 * 1500); // Convert to NGN kobo

  const handlePaystackPayment = async () => {
    if (!user) {
      setError("Please sign in to continue");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Initialize Paystack payment
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      
      if (!paystackPublicKey) {
        throw new Error("Payment configuration not available");
      }

      // Create a unique reference
      const reference = `songscribe_${planId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Use Paystack Popup
      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: user.email,
        amount: amountInKobo,
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: planId,
            },
            {
              display_name: "Billing Cycle",
              variable_name: "billing_cycle",
              value: billingCycle,
            },
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: user.id,
            },
          ],
        },
        callback: function (response: any) {
          // Payment successful
          console.log("Payment successful:", response);
          // Here you would verify the payment on your backend
          // and activate the subscription
          alert(`Payment successful! Reference: ${response.reference}`);
          onBack();
        },
        onClose: function () {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
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
                Checkout
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="w-16 h-16 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Sign In Required
            </h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to complete your purchase
            </p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
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
              Checkout
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Complete your subscription
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedPlan.gradient} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{selectedPlan.name} Plan</h4>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {billingCycle === "monthly" ? "Monthly" : "Yearly"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"}
                  </p>
                </div>
              </div>

              <div className="border-t border-purple-500/20 pt-4 space-y-2">
                {selectedPlan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-500/20 mt-4 pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${price.toFixed(2)} USD</span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-green-400 mt-1">
                    You save ${((selectedPlan.price.monthly * 12) - selectedPlan.price.yearly).toFixed(2)} per year!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payment
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-muted-foreground">
                    Secure payment powered by <span className="text-purple-400 font-medium">Paystack</span>
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handlePaystackPayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6 text-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Pay ${price.toFixed(2)} USD
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL encrypted payment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subscribing as</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <Music className="w-8 h-8 text-purple-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
