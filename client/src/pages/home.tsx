import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LocationInputs } from "@/components/location-inputs";
import { RideComparison } from "@/components/ride-comparison";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { RecentLocations } from "@/components/recent-locations";
import { TripSummary } from "@/components/trip-summary";
import { AppHeader } from "@/components/app-header";
import { FareTracker } from "@/components/fare-tracker";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TripRequest, RideComparisonResponse, Location } from "@shared/schema";

export default function Home() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [comparisonData, setComparisonData] = useState<RideComparisonResponse | null>(null);
  const [previousComparisonData, setPreviousComparisonData] = useState<RideComparisonResponse | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("price");
  const [showRecentLocations, setShowRecentLocations] = useState(true);
  const { toast } = useToast();

  const compareRidesMutation = useMutation({
    mutationFn: async (request: TripRequest) => {
      const response = await apiRequest("POST", "/api/rides/compare", request);
      return response.json() as Promise<RideComparisonResponse>;
    },
    onSuccess: (data) => {
      setPreviousComparisonData(comparisonData);
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
      toast({
        title: "Refreshing prices...",
        description: "Getting latest ride estimates",
      });
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

  const handleQuickLocationSelect = (location: Location, isPickup: boolean = true) => {
    if (isPickup) {
      setPickupLocation(location);
    } else {
      setDropoffLocation(location);
    }
    setShowRecentLocations(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <AppHeader 
        title="RideCompare" 
        showNotifications={comparisonData !== null}
      />

      <main className="pb-20">
        {/* Location Inputs */}
        <LocationInputs
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onPickupChange={(location) => {
            setPickupLocation(location);
            if (location) setShowRecentLocations(false);
          }}
          onDropoffChange={(location) => {
            setDropoffLocation(location);
            if (location) setShowRecentLocations(false);
          }}
          onSwapLocations={handleSwapLocations}
          onSearchRides={handleSearchRides}
          isLoading={compareRidesMutation.isPending}
        />

        {/* Recent Locations */}
        {showRecentLocations && !comparisonData && (
          <div className="px-4">
            <RecentLocations 
              onLocationSelect={(location) => handleQuickLocationSelect(location, !pickupLocation)}
            />
          </div>
        )}

        {/* Trip Summary */}
        {comparisonData && (
          <div className="px-4">
            <TripSummary data={comparisonData} />
          </div>
        )}

        {/* Fare Tracker */}
        {comparisonData && previousComparisonData && (
          <FareTracker 
            currentEstimates={comparisonData.estimates}
            previousEstimates={previousComparisonData.estimates}
          />
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
            pickup={pickupLocation}
            dropoff={dropoffLocation}
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
