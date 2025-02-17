"use client";

import React, { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
  pickup?: Location;
  destination?: Location;
  onRouteUpdate: (info: {
    distance: number;
    duration: number;
    fare: {
      baseFare: number;
      distanceFare: number;
      timeFare: number;
      totalFare: number;
      nightCharge?: number;
      surgeCharge?: number;
    };
  }) => void;
}

export default function MapComponent({
  onLocationSelect,
  pickup,
  destination,
  onRouteUpdate,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const markersRef = useRef<{ pickup?: any; destination?: any; current?: any }>(
    {}
  );
  const leafletRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState<
    "pickup" | "destination" | null
  >(null);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Mumbai, India if location access is denied
          setUserLocation({ lat: 19.076, lng: 72.8777 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Default to Mumbai, India if geolocation is not supported
      setUserLocation({ lat: 19.076, lng: 72.8777 });
    }
  }, []);

  // Initialize Leaflet
  useEffect(() => {
    let isSubscribed = true;

    async function initializeLeaflet() {
      if (typeof window === "undefined" || !userLocation || leafletRef.current)
        return;

      try {
        setIsLoading(true);

        // Dynamically import Leaflet and its CSS
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // Initialize map before importing routing to prevent initialization issues
        leafletRef.current = L;
        mapRef.current = L.map("map").setView(
          [userLocation.lat, userLocation.lng],
          13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapRef.current);

        // Fix Leaflet's icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/marker-icon-2x.png",
          iconUrl: "/leaflet/marker-icon.png",
          shadowUrl: "/leaflet/marker-shadow.png",
        });

        // Add current location marker
        const currentLocationIcon = L.divIcon({
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-animation"></div>',
          className: "current-location-marker",
        });

        if (isSubscribed) {
          markersRef.current.current = L.marker(
            [userLocation.lat, userLocation.lng],
            {
              icon: currentLocationIcon,
            }
          )
            .addTo(mapRef.current)
            .bindPopup("Your Location");

          // Now import routing after map is initialized
          const routing = await import("leaflet-routing-machine");
          await import(
            "leaflet-routing-machine/dist/leaflet-routing-machine.css"
          );

          // Add location selection controls
          const SelectionControl = L.Control.extend({
            onAdd: function (map: any) {
              const container = L.DomUtil.create(
                "div",
                "leaflet-bar leaflet-control selection-control"
              );
              container.innerHTML = `
                <div class="flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg">
                  <button class="pickup-btn px-3 py-2 text-sm rounded-md ${
                    selectionMode === "pickup"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  } hover:bg-green-500 hover:text-white transition-colors">
                    Select Pickup
                  </button>
                  <button class="destination-btn px-3 py-2 text-sm rounded-md ${
                    selectionMode === "destination"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  } hover:bg-red-500 hover:text-white transition-colors">
                    Select Destination
                  </button>
                </div>
              `;

              // Prevent map zoom when clicking buttons
              L.DomEvent.disableClickPropagation(container);

              // Add click handlers
              const pickupBtn = container.querySelector(".pickup-btn");
              const destBtn = container.querySelector(".destination-btn");

              pickupBtn?.addEventListener("click", () => {
                setSelectionMode((current) =>
                  current === "pickup" ? null : "pickup"
                );
              });

              destBtn?.addEventListener("click", () => {
                setSelectionMode((current) =>
                  current === "destination" ? null : "destination"
                );
              });

              return container;
            },
          });

          mapRef.current.addControl(
            new SelectionControl({ position: "topleft" })
          );

          // Add search control with modified behavior
          const searchControl = L.Control.extend({
            onAdd: function (map: any) {
              const container = L.DomUtil.create(
                "div",
                "leaflet-bar leaflet-control"
              );
              const input = L.DomUtil.create(
                "input",
                "search-input",
                container
              );

              input.type = "text";
              input.placeholder = selectionMode
                ? `Search ${selectionMode} location...`
                : "Select mode first...";
              input.className =
                "px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
              input.disabled = !selectionMode;

              L.DomEvent.disableClickPropagation(container);
              L.DomEvent.disableScrollPropagation(container);

              input.addEventListener("keypress", async (e: KeyboardEvent) => {
                if (e.key === "Enter" && selectionMode) {
                  const query = (e.target as HTMLInputElement).value;
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                      )}&limit=1`
                    );
                    const data = await response.json();
                    if (data.length > 0) {
                      const { lat, lon: lng, display_name } = data[0];
                      const location = {
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                        address: display_name,
                      };
                      onLocationSelect(location);
                      map.setView([lat, lng], 16);
                      (e.target as HTMLInputElement).value = "";
                    }
                  } catch (error) {
                    console.error("Error searching location:", error);
                  }
                }
              });

              return container;
            },
          });

          mapRef.current.addControl(new searchControl({ position: "topleft" }));

          // Modify click handler for location selection
          mapRef.current.on("click", async (e: any) => {
            if (!selectionMode) {
              // Show a tooltip or alert to select mode first
              return;
            }

            const { lat, lng } = e.latlng;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await response.json();
              const location = {
                lat,
                lng,
                address: data.display_name,
              };
              onLocationSelect(location);
              setSelectionMode(null); // Reset selection mode after selecting
            } catch (error) {
              console.error("Error getting address:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    initializeLeaflet();

    return () => {
      isSubscribed = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        leafletRef.current = null;
      }
    };
  }, [userLocation, selectionMode]);

  // Fare calculation function
  const calculateFare = (distance: number, duration: number) => {
    const FARE_CONFIG = {
      baseFare: 50, // Base fare in INR
      perKmRate: 12, // Rate per kilometer
      perMinuteRate: 2, // Rate per minute
      nightMultiplier: 1.25, // 25% extra for night rides (10 PM to 5 AM)
      surgeMultiplier: 1.2, // 20% extra during peak hours
      minimumFare: 100, // Minimum fare
    };

    // Calculate basic fare components
    const baseFare = FARE_CONFIG.baseFare;
    const distanceFare = Math.max(0, distance * FARE_CONFIG.perKmRate);
    const timeFare = duration * FARE_CONFIG.perMinuteRate;

    // Check if it's night time (10 PM to 5 AM)
    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 22 || currentHour < 5;
    const nightCharge = isNightTime
      ? (baseFare + distanceFare + timeFare) * (FARE_CONFIG.nightMultiplier - 1)
      : 0;

    // Check if it's surge time (peak hours: 8-10 AM and 5-8 PM)
    const isPeakHour =
      (currentHour >= 8 && currentHour <= 10) ||
      (currentHour >= 17 && currentHour <= 20);
    const surgeCharge = isPeakHour
      ? (baseFare + distanceFare + timeFare) * (FARE_CONFIG.surgeMultiplier - 1)
      : 0;

    // Calculate total fare
    let totalFare =
      baseFare + distanceFare + timeFare + nightCharge + surgeCharge;

    // Apply minimum fare if total is less than minimum
    totalFare = Math.max(totalFare, FARE_CONFIG.minimumFare);

    // Round to nearest 10
    totalFare = Math.ceil(totalFare / 10) * 10;

    return {
      baseFare,
      distanceFare,
      timeFare,
      totalFare,
      ...(nightCharge > 0 && { nightCharge }),
      ...(surgeCharge > 0 && { surgeCharge }),
    };
  };

  // Handle markers and routing
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;

    const L = leafletRef.current;

    // Clear existing markers (except current location)
    Object.entries(markersRef.current).forEach(
      ([key, marker]: [string, any]) => {
        if (key !== "current" && marker) {
          marker.remove();
        }
      }
    );

    // Clear existing route
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Add new markers with custom icons
    const pickupIcon = L.divIcon({
      html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">P</div>',
      className: "pickup-marker",
    });

    const destinationIcon = L.divIcon({
      html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">D</div>',
      className: "destination-marker",
    });

    if (pickup) {
      markersRef.current.pickup = L.marker([pickup.lat, pickup.lng], {
        icon: pickupIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("Pickup Location");
    }

    if (destination) {
      markersRef.current.destination = L.marker(
        [destination.lat, destination.lng],
        { icon: destinationIcon }
      )
        .addTo(mapRef.current)
        .bindPopup("Destination");
    }

    // Add routing if both points exist
    if (pickup && destination) {
      const control = L.Routing.control({
        waypoints: [
          L.latLng(pickup.lat, pickup.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: "#6366f1", weight: 6 }],
        },
        createMarker: () => null,
        addWaypoints: false,
      });

      routingControlRef.current = control;
      control.addTo(mapRef.current);

      control.on("routesfound", (e: any) => {
        const route = e.routes[0];
        const distance = route.summary.totalDistance / 1000; // Convert to kilometers
        const duration = Math.round(route.summary.totalTime / 60); // Convert to minutes

        // Calculate fare
        const fare = calculateFare(distance, duration);

        onRouteUpdate({
          distance,
          duration,
          fare,
        });

        // Fit the map to show the entire route with padding
        const bounds = L.latLngBounds([
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng],
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      });
    }
  }, [pickup, destination]);

  return (
    <div className="relative">
      <style jsx global>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .leaflet-routing-container {
          display: none;
        }
        .selection-control {
          margin-top: 60px !important;
        }
        .selection-control button {
          width: 140px;
          font-weight: 500;
        }
        .selection-control button:hover {
          cursor: pointer;
        }
      `}</style>
      <div
        id="map"
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      />
      {userLocation && (
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
            }
          }}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Center on your location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
