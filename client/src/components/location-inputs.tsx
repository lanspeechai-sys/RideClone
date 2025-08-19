import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowUpDown, Navigation } from "lucide-react";
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
    <Card className="card-elevated animate-scale-in">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Where to?</h2>
            <p className="text-muted-foreground">Enter your pickup and destination to compare rides</p>
          </div>
          
          {/* Pickup Location */}
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm"></div>
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Pickup location"
                  value={pickupInput}
                  onChange={(e) => handlePickupInputChange(e.target.value)}
                  className="input-modern h-12 text-base"
                  data-testid="input-pickup"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGetCurrentLocation}
                className="h-12 w-12 rounded-xl border-2 hover:bg-accent"
                data-testid="button-current-location"
              >
                <Navigation className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={onSwapLocations}
              className="h-10 w-10 rounded-full border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              data-testid="button-swap-locations"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Drop-off Location */}
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm"></div>
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Where to?"
                  value={dropoffInput}
                  onChange={(e) => handleDropoffInputChange(e.target.value)}
                  className="input-modern h-12 text-base"
                  data-testid="input-dropoff"
                />
              </div>
              <div className="h-12 w-12 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={onSearchRides}
            disabled={isLoading || !pickupLocation || !dropoffLocation}
            className="btn-primary w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            data-testid="button-compare-rides"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Searching...</span>
              </div>
            ) : (
              "Compare Rides"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}