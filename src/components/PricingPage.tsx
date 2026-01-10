import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Zap,
  Crown,
  Sparkles,
  Music,
  Download,
  Mic,
  FileText,
  Star,
  Shield,
  Headphones,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PricingPageProps {
  onBack: () => void;
  onNavigateToCheckout?: (planId: string, billingCycle: "monthly" | "yearly") => void;
}

function PricingPage({ onBack, onNavigateToCheckout }: PricingPageProps) {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for casual music lovers",
      icon: Music,
      price: { monthly: 0, yearly: 0 },
      features: [
        "5 song identifications per day",
        "Basic lyrics display",
        "TXT download format",
        "Standard audio quality",
        "Community support",
      ],
      limitations: [
        "Limited daily searches",
        "No PDF/DOCX exports",
        "Ads displayed",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false,
      gradient: "from-gray-500 to-gray-600",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For music enthusiasts who want more",
      icon: Zap,
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        "Unlimited song identifications",
        "Full lyrics with timestamps",
        "PDF, DOCX & TXT downloads",
        "QR codes on exports",
        "Priority audio recognition",
        "No ads",
        "Email support",
        "Lyrics history (unlimited)",
        "Notes feature",
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true,
      gradient: "from-purple-600 to-blue-600",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Ultimate experience for professionals",
      icon: Crown,
      price: { monthly: 19.99, yearly: 199.99 },
      features: [
        "Everything in Pro",
        "API access",
        "Bulk song identification",
        "Custom branding on exports",
        "Advanced analytics",
        "Priority support (24/7)",
        "Early access to new features",
        "Team collaboration (up to 5)",
        "White-label exports",
        "Dedicated account manager",
      ],
      limitations: [],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: false,
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
    },
    {
      question: "Is there a free trial for Pro or Premium?",
      answer: "Yes! Both Pro and Premium plans come with a 7-day free trial. No credit card required to start.",
    },
    {
      question: "Can I switch between plans?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Music Producer",
      content: "SongScribe Pro has been a game-changer for my workflow. The lyrics export feature saves me hours every week!",
      rating: 5,
    },
    {
      name: "James K.",
      role: "DJ",
      content: "The audio recognition is incredibly accurate. I use it at every gig to identify tracks on the fly.",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Content Creator",
      content: "Premium's API access lets me integrate song identification directly into my apps. Worth every penny!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
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
              Pricing Plans
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Choose the perfect plan for your needs
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-card/50 dark:bg-card/50 rounded-full p-1 border border-purple-500/20">
            <div className="flex gap-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
            
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 transition-all hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "border-purple-500/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <p className="text-sm text-green-400 mt-1">
                        ${(price / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : plan.id === "premium"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        : ""
                    }`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-3 opacity-50">
                        <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">—</span>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose SongScribe?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Mic, title: "Accurate Recognition", desc: "Industry-leading audio recognition technology" },
              { icon: Download, title: "Multiple Formats", desc: "Export lyrics in PDF, DOCX, or TXT" },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and protected" },
              { icon: Headphones, title: "24/7 Support", desc: "We're here to help whenever you need" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/30 dark:bg-card/30 border-purple-500/20 text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/30 dark:bg-card/30 border-purple-500/20 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/30 dark:bg-card/30 border-purple-500/20 p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-10 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of music lovers who use SongScribe to discover and save their favorite lyrics.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500/30">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
