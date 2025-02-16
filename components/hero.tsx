"use client";

import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BackgroundLines } from "@/components/ui/background-lines";
import { ChevronRight } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      <BackgroundLines className="min-h-[700px]">
        {/* Content overlay */}
        <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center space-y-12">
          {/* Announcement banner */}
          <div className="">
            <AnimatedGradientText>
              <span className="inline-flex items-center gap-2">
                🌟
                <span
                  className={cn(
                    "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
                  )}
                >
                  Welcome to Eyelink
                </span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </span>
            </AnimatedGradientText>
          </div>

          {/* Main headline */}
          <div className="space-y-4">
            <SparklesText
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              text="Bridging Hearts"
            />
            <SparklesText
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              text="Paving Ways to Inclusivity"
            />
          </div>

          <AuroraText className="text-xl sm:text-2xl font-medium max-w-2xl text-muted-foreground">
            Making life more accessible and inclusive for differently-abled
            individuals.
          </AuroraText>

          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Experience seamless communication, accessible transportation, and
            dedicated care, all in one place. Eyelink is your all-in-one
            solution to break down barriers and empower differently-abled people
            to live fuller, more connected lives.
          </p>

          <div className="flex flex-wrap gap-6 mt-8 justify-center">
            <PulsatingButton
              className="text-lg px-8 py-3 font-medium"
              onClick={() => router.push("/sign-up")}
            >
              Get Started Now
            </PulsatingButton>
            <button
              className="group text-lg px-8 py-3 text-muted-foreground border border-border rounded-lg 
              hover:bg-muted/50 transition-all hover:border-border/80 flex items-center gap-2"
              onClick={() => router.push("/about")}
            >
              Learn More
              <ChevronRight className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
}
