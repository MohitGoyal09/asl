import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Languages, Mail, Phone } from "lucide-react";
import takerData from "@/data/taker.json";
import { notFound } from "next/navigation";

interface Review {
  author: string;
  rating: number;
  text: string;
}

interface Provider {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
  location: string;
  specializations: string[];
  languages: string[];
  availability: string;
  hourlyRate: number;
  reviews: Review[];
}

interface PageProps {
  params: Promise<{ provider: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProviderPage({
  params,
  searchParams,
}: PageProps) {
  const { provider } = await params;

  const providerData = takerData.find((p) => p.id === provider);

  if (!providerData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-12">
      {/* Provider Header */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={providerData.profilePicture}
                alt={providerData.name}
              />
              <AvatarFallback>{providerData.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Provider Info */}
          <div className="space-y-4 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{providerData.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{providerData.location}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Schedule Call
                </Button>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">{providerData.bio}</p>

            {/* Specializations */}
            <div className="space-y-2">
              <h3 className="font-semibold">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {providerData.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages & Availability */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {providerData.languages.map((lang) => (
                <Badge key={lang}>{lang}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability
            </h3>
            <p className="text-muted-foreground">{providerData.availability}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Hourly Rate</h3>
            <p className="text-2xl font-bold text-primary">
              ${providerData.hourlyRate}/hr
            </p>
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <Badge variant="secondary">
                {providerData.reviews.length} Reviews
              </Badge>
            </div>

            <div className="space-y-4">
              {providerData.reviews.length > 0 ? (
                providerData.reviews.map((review: Review, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{review.author}</span>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No reviews yet
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
