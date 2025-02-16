"use client";

import React from "react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Clock, Languages } from "lucide-react";
import {
  ProviderCard,
  NoProvidersFound,
  Provider,
} from "@/components/ui/provider-card";
import takerData from "@/data/taker.json";

const specializations = [
  { id: "asl", label: "ASL Communication" },
  { id: "mobility", label: "Mobility Assistance" },
  { id: "personal", label: "Personal Care" },
  { id: "medical", label: "Medical Assistance" },
  { id: "companionship", label: "Companionship" },
  { id: "respite", label: "Respite Care" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "asl", label: "ASL" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const availability = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings" },
  { value: "flexible", label: "Flexible" },
];

export default function CarePage() {
  const [providers, setProviders] = React.useState<Provider[]>(
    takerData.map((taker) => ({
      id: taker.id,
      name: taker.name,
      image: taker.profilePicture,
      tagline: taker.bio,
      specializations: taker.specializations,
      location: taker.location,
    }))
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedAvailability, setSelectedAvailability] = React.useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [selectedPriceRange, setSelectedPriceRange] = React.useState("");
  const [selectedSpecializations, setSelectedSpecializations] = React.useState<
    string[]
  >([]);

  const handleSearch = () => {
    let filtered = takerData.map((taker) => ({
      id: taker.id,
      name: taker.name,
      image: taker.profilePicture,
      tagline: taker.bio,
      specializations: taker.specializations,
      location: taker.location,
    }));

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.tagline.toLowerCase().includes(query) ||
          provider.specializations.some((spec) =>
            spec.toLowerCase().includes(query)
          )
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((provider) =>
        provider.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Specializations filter
    if (selectedSpecializations.length > 0) {
      filtered = filtered.filter((provider) =>
        selectedSpecializations.every((spec) =>
          provider.specializations.includes(spec)
        )
      );
    }

    setProviders(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedAvailability("");
    setSelectedLanguage("");
    setSelectedPriceRange("");
    setSelectedSpecializations([]);
    setProviders(
      takerData.map((taker) => ({
        id: taker.id,
        name: taker.name,
        image: taker.profilePicture,
        tagline: taker.bio,
        specializations: taker.specializations,
        location: taker.location,
      }))
    );
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedLocation, selectedSpecializations]);

  return (
    <div className="container mx-auto px-4 py-24 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-6">
        <SparklesText
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          text="Connect with Dedicated Caregivers"
        />

        <AuroraText className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Eyelink connects you with a network of compassionate and skilled care
          providers dedicated to supporting differently-abled individuals.
          Browse our profiles to find the right caregiver to meet your unique
          needs and preferences.
        </AuroraText>
      </div>

      {/* Search and Filter Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by skills, languages, or provider name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="los angeles">Los Angeles</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Availability
              </Label>
              <Select
                value={selectedAvailability}
                onValueChange={setSelectedAvailability}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availability.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Languages Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages
              </Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Select
                value={selectedPriceRange}
                onValueChange={setSelectedPriceRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25">$0 - $25/hr</SelectItem>
                  <SelectItem value="25-50">$25 - $50/hr</SelectItem>
                  <SelectItem value="50-75">$50 - $75/hr</SelectItem>
                  <SelectItem value="75+">$75+/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-3">
            <Label>Specializations</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specializations.map((spec) => (
                <div key={spec.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec.id}
                    checked={selectedSpecializations.includes(spec.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSpecializations([
                          ...selectedSpecializations,
                          spec.label,
                        ]);
                      } else {
                        setSelectedSpecializations(
                          selectedSpecializations.filter(
                            (s) => s !== spec.label
                          )
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={spec.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {spec.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </div>
      </Card>

      {/* Provider Listings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Available Care Providers</h2>
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <NoProvidersFound />
        )}
      </div>
    </div>
  );
}
