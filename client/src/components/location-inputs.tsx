import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowUpDown } from "lucide-react";
import { getCurrentLocation } from "@/lib/geolocation";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";

interface LocationInputsProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onPickupChange: (location: Location | null) => void;
  onDropoffChange: (location: Location | null) => void;
  onSwapLocations: () => void;
  onSearchRides: () => void;
  isLoading: boolean;
  pickupText?: string;
  dropoffText?: string;
}

export function LocationInputs({
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange,
  onSwapLocations,
  onSearchRides,
  isLoading,
  pickupText = "",
  dropoffText = "",
}: LocationInputsProps) {
  const [pickupInput, setPickupInput] = useState(pickupText || pickupLocation?.address || "");
  const [dropoffInput, setDropoffInput] = useState(dropoffText || dropoffLocation?.address || "");
  const { toast } = useToast();

  // Update input fields when external text props change (after login)
  useEffect(() => {
    if (pickupText && pickupText !== pickupInput) {
      setPickupInput(pickupText);
    }
    if (dropoffText && dropoffText !== dropoffInput) {
      setDropoffInput(dropoffText);
    }
  }, [pickupText, dropoffText]);

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      const currentLocationData: Location = {
        address: "Current Location",
        latitude: location.latitude,
        longitude: location.longitude,
      };
      onPickupChange(currentLocationData);
      setPickupInput("Current Location");
      toast({
        title: "Location found",
        description: "Using your current location as pickup",
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your current location",
        variant: "destructive",
      });
    }
  };

  const handlePickupInputChange = (value: string) => {
    setPickupInput(value);
    if (value.trim()) {
      // For demo purposes, create a location with mock coordinates
      // In real app, you'd geocode the address
      const mockLocation: Location = {
        address: value,
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      };
      onPickupChange(mockLocation);
    } else {
      onPickupChange(null);
    }
  };

  const handleDropoffInputChange = (value: string) => {
    setDropoffInput(value);
    if (value.trim()) {
      // For demo purposes, create a location with mock coordinates
      // In real app, you'd geocode the address
      const mockLocation: Location = {
        address: value,
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      };
      onDropoffChange(mockLocation);
    } else {
      onDropoffChange(null);
    }
  };

  return (
    <section className="bg-white shadow-sm">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-primary mb-4">Where to?</h2>
        
        {/* Pickup Location */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Pickup location"
                value={pickupInput}
                onChange={(e) => handlePickupInputChange(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                data-testid="input-pickup"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGetCurrentLocation}
              className="p-2 hover:bg-gray-100 rounded-lg"
              data-testid="button-current-location"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={onSwapLocations}
            className="p-2 bg-white border-2 border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            data-testid="button-swap-locations"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Drop-off Location */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Where to?"
                value={dropoffInput}
                onChange={(e) => handleDropoffInputChange(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                data-testid="input-dropoff"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={onSearchRides}
          disabled={isLoading || !pickupLocation || !dropoffLocation}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
          data-testid="button-compare-rides"
        >
          {isLoading ? "Searching..." : "Compare Rides"}
        </Button>
      </div>
    </section>
  );
}
