import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import { Hero } from "@/components/hero";
import Header from "@/components/ui/header";
import { Testimonials } from "@/components/Testinomial";
import Image from "next/image";
import { Pricing } from "@/components/ui/pricing";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Feature />
      <Pricing
        plans={[
          {
            name: "Basic",
            price: "29",
            yearlyPrice: "279",
            period: "month",
            features: [
              "Basic ASL Translation",
              "24/7 Support",
              "Mobile Access",
            ],
            description: "Perfect for individuals starting their journey",
            buttonText: "Get Started",
            href: "/signup",
            isPopular: false,
          },
          {
            name: "Pro",
            price: "49",
            yearlyPrice: "469",
            period: "month",
            features: [
              "Advanced ASL Translation",
              "Priority Support",
              "Mobile Access",
              "Custom Signs",
            ],
            description: "Ideal for active learners and professionals",
            buttonText: "Start Pro",
            href: "/signup-pro",
            isPopular: true,
          },
          {
            name: "Enterprise",
            price: "99",
            yearlyPrice: "949",
            period: "month",
            features: [
              "Enterprise ASL Translation",
              "Dedicated Support",
              "Mobile Access",
              "Custom Signs",
              "API Access",
            ],
            description: "For organizations and institutions",
            buttonText: "Contact Sales",
            href: "/contact",
            isPopular: false,
          },
        ]}
      />
      <Testimonials />
      <Footer />
    </>
  );
}
