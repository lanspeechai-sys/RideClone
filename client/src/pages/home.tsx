import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { LocationInputs } from "@/components/location-inputs";
import { RideComparison } from "@/components/ride-comparison";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { RecentLocations } from "@/components/recent-locations";
import { TripSummary } from "@/components/trip-summary";
import { AppHeader } from "@/components/app-header";
import { FareTracker } from "@/components/fare-tracker";
import { SearchHistory } from "@/components/search-history";
import { QuickActions } from "@/components/quick-actions";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSearchContext } from "@/contexts/SearchContext";
import { useSearchHistory } from "@/contexts/SearchHistoryContext";
import { useCountry } from "@/contexts/CountryContext";
import type { TripRequest, RideComparisonResponse, Location } from "@shared/schema";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { searchData, setSearchData } = useSearchContext();
  const { addToHistory } = useSearchHistory();
  const { selectedCountry } = useCountry();
  const [, setLocation] = useLocation();
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [pickupText, setPickupText] = useState<string>("");
  const [dropoffText, setDropoffText] = useState<string>("");
  const [comparisonData, setComparisonData] = useState<RideComparisonResponse | null>(null);
  const [previousComparisonData, setPreviousComparisonData] = useState<RideComparisonResponse | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("price");
  const [showRecentLocations, setShowRecentLocations] = useState(true);
  const { toast } = useToast();

  // Restore search data from context after login
  useEffect(() => {
    if (isAuthenticated && searchData) {
      setPickupLocation(searchData.pickup);
      setDropoffLocation(searchData.dropoff);
      setPickupText(searchData.pickup.address);
      setDropoffText(searchData.dropoff.address);
      
      // Auto-run the comparison if we have saved search data
      const enhancedSearchData: TripRequest = {
        ...searchData,
        country: selectedCountry.code,
      };
      compareRidesMutation.mutate(enhancedSearchData);
      
      // Clear the search data from context since we've used it
      setSearchData(null);
    }
  }, [isAuthenticated, searchData, setSearchData]);

  const compareRidesMutation = useMutation({
    mutationFn: async (request: TripRequest) => {
      const response = await apiRequest("POST", "/api/rides/compare", request);
      return response.json() as Promise<RideComparisonResponse>;
    },
    onSuccess: (data, variables) => {
      setPreviousComparisonData(comparisonData);
      setComparisonData(data);
      
      // Add to search history
      addToHistory(variables);
      
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

    const tripRequest: TripRequest = {
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      country: selectedCountry.code,
    };

    // If user is not authenticated, save search data and redirect to login
    if (!isAuthenticated) {
      setSearchData(tripRequest);
      toast({
        title: "Login required",
        description: "Please sign in to compare rides. Your search will be saved.",
      });
      setLocation("/login");
      return;
    }

    // User is authenticated, proceed with ride comparison
    compareRidesMutation.mutate(tripRequest);
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
        country: selectedCountry.code,
      });
    }
  };

  const handleSwapLocations = () => {
    const tempLocation = pickupLocation;
    const tempText = pickupText;
    
    setPickupLocation(dropoffLocation);
    setDropoffLocation(tempLocation);
    setPickupText(dropoffText);
    setDropoffText(tempText);
  };

  const handleQuickLocationSelect = (location: Location, isPickup: boolean = true) => {
    if (isPickup) {
      setPickupLocation(location);
      setPickupText(location.address);
    } else {
      setDropoffLocation(location);
      setDropoffText(location.address);
    }
    setShowRecentLocations(false);
  };

  const handleHistorySelect = (pickup: Location, dropoff: Location) => {
    setPickupLocation(pickup);
    setDropoffLocation(dropoff);
    setPickupText(pickup.address);
    setDropoffText(dropoff.address);
  };

  return (
    <div className="min-h-screen bg-gradient-page font-sans">
      {/* Header */}
      <AppHeader 
        title="RideCompare" 
        showNotifications={comparisonData !== null}
      />

      <main className="pb-20">
        {/* Hero Section */}
        {!comparisonData && (
          <section className="section-padding bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-50/30">
            <div className="container-modern text-center">
              <div className="mx-auto max-w-3xl animate-fade-in">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Find the <span className="text-gradient">Best Ride</span> at the Best Price
                </h1>
                <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                  Compare prices across Uber, Bolt, and Yango in real-time. Save money on every trip with smart price tracking and instant comparisons.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Location Inputs */}
        <section className={comparisonData ? "bg-background border-b" : ""}>
          <div className="container-modern">
            <div className={comparisonData ? "py-6" : "-mt-8"}>
              <div className="mx-auto max-w-2xl">
                <LocationInputs
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                  pickupText={pickupText}
                  dropoffText={dropoffText}
                  onPickupChange={(location) => {
                    setPickupLocation(location);
                    if (location) {
                      setPickupText(location.address);
                      setShowRecentLocations(false);
                    }
                  }}
                  onDropoffChange={(location) => {
                    setDropoffLocation(location);
                    if (location) {
                      setDropoffText(location.address);
                      setShowRecentLocations(false);
                    }
                  }}
                  onSwapLocations={handleSwapLocations}
                  onSearchRides={handleSearchRides}
                  isLoading={compareRidesMutation.isPending}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search History */}
        {!comparisonData && (
          <section className="py-6">
            <div className="container-modern">
              <div className="mx-auto max-w-2xl">
                <SearchHistory onSelectHistory={handleHistorySelect} />
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        {!comparisonData && !compareRidesMutation.isPending && (
          <section className="py-6">
            <div className="container-modern">
              <div className="mx-auto max-w-4xl">
                <QuickActions onLocationSelect={(location) => handleQuickLocationSelect(location, !pickupLocation)} />
              </div>
            </div>
          </section>
        )}

        {/* Recent Locations */}
        {showRecentLocations && !comparisonData && (
          <section className="py-6">
            <div className="container-modern">
              <div className="mx-auto max-w-2xl">
                <RecentLocations 
                  onLocationSelect={(location) => handleQuickLocationSelect(location, !pickupLocation)}
                />
              </div>
            </div>
          </section>
        )}

        {/* Trip Summary */}
        {comparisonData && (
          <section className="py-6 bg-muted/30">
            <div className="container-modern">
              <div className="mx-auto max-w-4xl">
                <TripSummary data={comparisonData} />
              </div>
            </div>
          </section>
        )}

        {/* Fare Tracker */}
        {comparisonData && previousComparisonData && (
          <section className="py-6">
            <div className="container-modern">
              <div className="mx-auto max-w-4xl">
                <FareTracker 
                  currentEstimates={comparisonData.estimates}
                  previousEstimates={previousComparisonData.estimates}
                />
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {compareRidesMutation.isPending && (
          <section className="py-12">
            <div className="container-modern">
              <LoadingState />
            </div>
          </section>
        )}

        {/* Error State */}
        {compareRidesMutation.isError && (
          <section className="py-12">
            <div className="container-modern">
              <ErrorState 
                error={compareRidesMutation.error}
                onRetry={handleRefresh}
              />
            </div>
          </section>
        )}

        {/* Ride Comparison */}
        {comparisonData && !compareRidesMutation.isPending && (
          <section className="py-6">
            <div className="container-modern">
              <div className="mx-auto max-w-4xl">
                <RideComparison 
                  estimates={comparisonData.estimates}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  pickup={pickupLocation}
                  dropoff={dropoffLocation}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      {comparisonData && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={handleRefresh}
            disabled={compareRidesMutation.isPending}
            size="lg"
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 shadow-glow"
            data-testid="button-refresh"
          >
            <RefreshCw className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}