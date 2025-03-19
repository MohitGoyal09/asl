"use client";

import { Pricing } from "@/components/ui/pricing";

export default function PricingPage() {
  return (
    <Pricing
      title="Simple, Transparent Pricing"
      description="Choose the plan that works best for you\nAll plans include access to our ASL translation platform and dedicated support."
      plans={[
        {
          name: "Basic",
          price: "2499",
          yearlyPrice: "2199",
          period: "month",
          features: [
            "Basic ASL Translation (30 mins/day)",
            "Standard Email Support",
            "Mobile Device Access",
            "English Translation Output",
            "Basic Video Recording",
            "Cloud Storage (1GB)",
          ],
          description:
            "Perfect for individuals starting their journey with ASL",
          buttonText: "Get Started",
          href: "/signup",
          isPopular: false,
        },
        {
          name: "Pro",
          price: "3499",
          yearlyPrice: "3199",
          period: "month",
          features: [
            "Unlimited ASL Translation",
            "Priority Support (4-hour response)",
            "Enhanced Mobile Features",
            "3 Language Outputs",
            "Custom Signs Library",
            "30-Day Translation History",
            "Advanced Video Recording",
            "Cloud Storage (10GB)",
          ],
          description: "Ideal for active learners and professionals",
          buttonText: "Start Pro",
          href: "/signup-pro",
          isPopular: true,
        },
        {
          name: "Enterprise",
          price: "4299",
          yearlyPrice: "4199",
          period: "month",
          features: [
            "Enterprise-grade Translation",
            "24/7 Dedicated Support",
            "Full API Access",
            "All Language Outputs",
            "Custom Integration",
            "Advanced Analytics",
            "Team Management",
            "99.9% Uptime SLA",
            "Unlimited Cloud Storage",
          ],
          description:
            "For organizations and institutions requiring full features",
          buttonText: "Contact Sales",
          href: "/contact",
          isPopular: false,
        },
      ]}
    />
  );
}
