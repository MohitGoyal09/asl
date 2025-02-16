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
  onRouteUpdate: (info: { distance: number; duration: number }) => void;
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
        }
      );
    } else {
      // Default to Mumbai, India if geolocation is not supported
      setUserLocation({ lat: 19.076, lng: 72.8777 });
    }
  }, []);

  // Initialize Leaflet
  useEffect(() => {
    async function initializeLeaflet() {
      if (
        typeof window !== "undefined" &&
        !leafletRef.current &&
        userLocation
      ) {
        setIsLoading(true);
        try {
          // Dynamically import Leaflet and its CSS
          const L = await import("leaflet");
          await import("leaflet/dist/leaflet.css");
          const routing = await import("leaflet-routing-machine");
          await import(
            "leaflet-routing-machine/dist/leaflet-routing-machine.css"
          );

          leafletRef.current = L;

          // Fix Leaflet's icon paths
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/leaflet/marker-icon-2x.png",
            iconUrl: "/leaflet/marker-icon.png",
            shadowUrl: "/leaflet/marker-shadow.png",
          });

          // Initialize map centered on user's location
          mapRef.current = L.map("map").setView(
            [userLocation.lat, userLocation.lng],
            13
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapRef.current);

          // Add current location marker with custom icon
          const currentLocationIcon = L.divIcon({
            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
            className: "current-location-marker",
          });

          markersRef.current.current = L.marker(
            [userLocation.lat, userLocation.lng],
            {
              icon: currentLocationIcon,
            }
          )
            .addTo(mapRef.current)
            .bindPopup("Your Location");

          // Add search control
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
              input.placeholder = "Search location...";
              input.className =
                "px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

              input.addEventListener("keypress", async (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value;
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                      )}`
                    );
                    const data = await response.json();
                    if (data.length > 0) {
                      const { lat, lon: lng, display_name } = data[0];
                      onLocationSelect({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                        address: display_name,
                      });
                      map.setView([lat, lng], 16);
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

          // Add click handler for location selection
          mapRef.current.on("click", async (e: any) => {
            const { lat, lng } = e.latlng;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await response.json();
              onLocationSelect({
                lat,
                lng,
                address: data.display_name,
              });
            } catch (error) {
              console.error("Error getting address:", error);
            }
          });
        } catch (error) {
          console.error("Error initializing map:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    initializeLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation]);

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

    // Add new markers
    if (pickup) {
      markersRef.current.pickup = L.marker([pickup.lat, pickup.lng])
        .addTo(mapRef.current)
        .bindPopup("Pickup Location");
    }

    if (destination) {
      markersRef.current.destination = L.marker([
        destination.lat,
        destination.lng,
      ])
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
        createMarker: () => null, // Don't create additional markers
      });

      routingControlRef.current = control;
      control.addTo(mapRef.current);

      control.on("routesfound", (e: any) => {
        const route = e.routes[0];
        onRouteUpdate({
          distance: route.summary.totalDistance / 1000, // Convert to kilometers
          duration: Math.round(route.summary.totalTime / 60), // Convert to minutes
        });
      });

      // Fit the map to show both markers
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, destination]);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative">
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
