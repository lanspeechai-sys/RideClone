import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LocationInputs } from "@/components/location-inputs";
import { RideComparison } from "@/components/ride-comparison";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { RefreshCw, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TripRequest, RideComparisonResponse, Location } from "@shared/schema";

export default function Home() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [comparisonData, setComparisonData] = useState<RideComparisonResponse | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("price");
  const { toast } = useToast();

  const compareRidesMutation = useMutation({
    mutationFn: async (request: TripRequest) => {
      const response = await apiRequest("POST", "/api/rides/compare", request);
      return response.json() as Promise<RideComparisonResponse>;
    },
    onSuccess: (data) => {
      setComparisonData(data);
      toast({
        title: "Rides found!",
        description: `Found ${data.estimates.length} ride options`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get ride estimates",
        variant: "destructive",
      });
    },
  });

  const handleSearchRides = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast({
        title: "Missing locations",
        description: "Please select both pickup and drop-off locations",
        variant: "destructive",
      });
      return;
    }

    compareRidesMutation.mutate({
      pickup: pickupLocation,
      dropoff: dropoffLocation,
    });
  };

  const handleRefresh = () => {
    if (pickupLocation && dropoffLocation) {
      compareRidesMutation.mutate({
        pickup: pickupLocation,
        dropoff: dropoffLocation,
      });
    }
  };

  const handleSwapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(temp);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">RideCompare</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              data-testid="button-menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Location Inputs */}
        <LocationInputs
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onPickupChange={setPickupLocation}
          onDropoffChange={setDropoffLocation}
          onSwapLocations={handleSwapLocations}
          onSearchRides={handleSearchRides}
          isLoading={compareRidesMutation.isPending}
        />

        {/* Trip Summary */}
        {comparisonData && (
          <section className="bg-white mt-2 shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Distance: <span className="font-medium text-primary" data-testid="text-distance">
                    {(comparisonData.tripDistance / 1000).toFixed(1)} km
                  </span>
                </span>
                <span>
                  Duration: <span className="font-medium text-primary" data-testid="text-duration">
                    {comparisonData.tripDuration} min
                  </span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {compareRidesMutation.isPending && <LoadingState />}

        {/* Error State */}
        {compareRidesMutation.isError && (
          <ErrorState 
            error={compareRidesMutation.error}
            onRetry={handleRefresh}
          />
        )}

        {/* Ride Comparison */}
        {comparisonData && !compareRidesMutation.isPending && (
          <RideComparison 
            estimates={comparisonData.estimates}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}
      </main>

      {/* Floating Action Button */}
      {comparisonData && (
        <div className="fixed bottom-6 right-4">
          <Button
            onClick={handleRefresh}
            disabled={compareRidesMutation.isPending}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            data-testid="button-refresh"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
