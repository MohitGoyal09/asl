"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { OpenStreetMap } from "@/components/ui/openstreet-map";

export default function CabBookingPage() {
  const [date, setDate] = useState<Date>();
  const [selectedLocation, setSelectedLocation] = useState<{
    type: "pickup" | "destination";
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  }>({ distance: 0, duration: 0 });
  const [bookingData, setBookingData] = useState({
    pickup: "",
    destination: "",
    passengers: "1",
    name: "",
    phone: "",
    email: "",
    requirements: {
      wheelchair: false,
      boarding: false,
      extraSpace: false,
      serviceAnimal: false,
    },
    pickupCoords: { lat: 0, lng: 0 },
    destinationCoords: { lat: 0, lng: 0 },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    if (selectedLocation) {
      const type = selectedLocation.type;
      setBookingData((prev) => ({
        ...prev,
        [type]: location.address,
        [`${type}Coords`]: { lat: location.lat, lng: location.lng },
      }));
      setSelectedLocation(null);
    }
  };

  const handleRequirementChange = (requirement: string) => {
    setBookingData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [requirement]:
          !prev.requirements[requirement as keyof typeof prev.requirements],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !bookingData.pickup ||
      !bookingData.destination ||
      !date ||
      !bookingData.name ||
      !bookingData.phone ||
      !bookingData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(bookingData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      const bookingPayload = {
        ...bookingData,
        date: date?.toISOString(),
        estimatedFare: calculateFare(),
        routeInfo,
      };

      // For now, we'll just log the booking data
      console.log("Booking submitted:", bookingPayload);
      alert("Booking submitted successfully! We'll contact you shortly.");
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("There was an error submitting your booking. Please try again.");
    }
  };

  // Calculate fare based on distance and requirements
  const calculateFare = () => {
    const baseFare = 200; // Base fare in INR
    const perKmRate = 15; // Rate per kilometer in INR
    const accessibilitySurcharge = Object.values(bookingData.requirements).some(
      (value) => value
    )
      ? 50
      : 0;
    const distanceFare = routeInfo.distance * perKmRate;
    return Math.ceil(baseFare + distanceFare + accessibilitySurcharge);
  };

  return (
    <div className="mt-24">
      {/* Page Header */}
      <div className="relative text-center mb-16 container max-w-7xl mx-auto px-6">
        <div className="space-y-12">
          <SparklesText
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            text="Book Your Ride"
          />
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Safe, reliable, and accessible transportation at your service. Book
            a ride with our specially trained drivers and accessible vehicles.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Pickup Location
                    </label>
                    <div className="flex gap-2">
                      <Input
                        name="pickup"
                        placeholder="Enter pickup address"
                        value={bookingData.pickup}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={() =>
                          setSelectedLocation({
                            type: "pickup",
                            lat: 0,
                            lng: 0,
                            address: "",
                          })
                        }
                      >
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <div className="flex gap-2">
                      <Input
                        name="destination"
                        placeholder="Enter destination address"
                        value={bookingData.destination}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={() =>
                          setSelectedLocation({
                            type: "destination",
                            lat: 0,
                            lng: 0,
                            address: "",
                          })
                        }
                      >
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Number of Passengers
                    </label>
                    <Select
                      name="passengers"
                      value={bookingData.passengers}
                      onValueChange={(value) =>
                        setBookingData((prev) => ({
                          ...prev,
                          passengers: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "passenger" : "passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      name="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Accessibility Requirements */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Accessibility Requirements
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wheelchair"
                        checked={bookingData.requirements.wheelchair}
                        onCheckedChange={() =>
                          handleRequirementChange("wheelchair")
                        }
                      />
                      <label htmlFor="wheelchair" className="text-sm">
                        Wheelchair Access
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="boarding"
                        checked={bookingData.requirements.boarding}
                        onCheckedChange={() =>
                          handleRequirementChange("boarding")
                        }
                      />
                      <label htmlFor="boarding" className="text-sm">
                        Boarding Assistance
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extraSpace"
                        checked={bookingData.requirements.extraSpace}
                        onCheckedChange={() =>
                          handleRequirementChange("extraSpace")
                        }
                      />
                      <label htmlFor="extraSpace" className="text-sm">
                        Extra Space
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="serviceAnimal"
                        checked={bookingData.requirements.serviceAnimal}
                        onCheckedChange={() =>
                          handleRequirementChange("serviceAnimal")
                        }
                      />
                      <label htmlFor="serviceAnimal" className="text-sm">
                        Service Animal
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                >
                  Book Cab
                </Button>
              </form>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <OpenStreetMap
                  onLocationSelect={handleLocationSelect}
                  pickup={
                    bookingData.pickupCoords.lat !== 0
                      ? {
                          lat: bookingData.pickupCoords.lat,
                          lng: bookingData.pickupCoords.lng,
                          address: bookingData.pickup,
                        }
                      : undefined
                  }
                  destination={
                    bookingData.destinationCoords.lat !== 0
                      ? {
                          lat: bookingData.destinationCoords.lat,
                          lng: bookingData.destinationCoords.lng,
                          address: bookingData.destination,
                        }
                      : undefined
                  }
                  onRouteUpdate={setRouteInfo}
                />
              </div>
              {selectedLocation && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Click on the map to select {selectedLocation.type} location
                </p>
              )}
            </Card>

            {/* Estimated Fare Card */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-4">Estimated Fare</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="font-medium">₹200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance (est.)</span>
                  <span className="font-medium">
                    {routeInfo.distance.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time (est.)</span>
                  <span className="font-medium">{routeInfo.duration} mins</span>
                </div>
                {Object.entries(bookingData.requirements).some(
                  ([_, value]) => value
                ) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Accessibility Surcharge
                    </span>
                    <span className="font-medium">₹50</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Estimate</span>
                    <span className="font-semibold">₹{calculateFare()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Final fare may vary based on actual route and waiting time
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
