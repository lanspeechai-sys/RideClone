import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "./booking-modal";
import { PriceAlerts } from "./price-alerts";
import { ArrowUpDown, Clock, MapPin, Star, DollarSign, Zap, Crown } from "lucide-react";
import type { RideEstimate, Location } from "@shared/schema";
import { useCountry } from "@/contexts/CountryContext";

interface RideComparisonProps {
  estimates: RideEstimate[];
  sortBy: "price" | "time" | "rating";
  onSortChange: (sort: "price" | "time" | "rating") => void;
  pickup: Location | null;
  dropoff: Location | null;
}

export function RideComparison({ estimates, sortBy, onSortChange, pickup, dropoff }: RideComparisonProps) {
  const [selectedRide, setSelectedRide] = useState<RideEstimate | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { formatPrice } = useCountry();
  
  const sortedEstimates = [...estimates].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "time":
        return parseInt(a.arrivalTime) - parseInt(b.arrivalTime);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const getProviderInfo = (provider: string) => {
    const providers = {
      uber: { 
        name: "UBER", 
        bg: "bg-black", 
        color: "text-black",
        accent: "border-black/20 hover:border-black/40"
      },
      bolt: { 
        name: "BOLT", 
        bg: "bg-green-600", 
        color: "text-green-600",
        accent: "border-green-200 hover:border-green-400"
      },
      yango: { 
        name: "YANGO", 
        bg: "bg-yellow-500", 
        color: "text-yellow-600",
        accent: "border-yellow-200 hover:border-yellow-400"
      },
    };
    return providers[provider as keyof typeof providers] || providers.uber;
  };

  const handleBookRide = (ride: RideEstimate) => {
    setSelectedRide(ride);
    setIsBookingModalOpen(true);
  };

  const lowestPrice = Math.min(...estimates.map(e => e.price));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Available Rides</h3>
          <p className="text-muted-foreground">Choose the best option for your trip</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {estimates.length} options
        </Badge>
      </div>

      {/* Sort Controls */}
      <Card className="card-modern">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortChange("price")}
              className="font-medium"
              data-testid="button-filter-price"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Best Price
            </Button>
            <Button
              variant={sortBy === "time" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortChange("time")}
              className="font-medium"
              data-testid="button-filter-time"
            >
              <Clock className="mr-2 h-4 w-4" />
              Fastest
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortChange("rating")}
              className="font-medium"
              data-testid="button-filter-rating"
            >
              <Star className="mr-2 h-4 w-4" />
              Top Rated
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ride Options */}
      <div className="space-y-4">
        {sortedEstimates.map((ride, index) => {
          const providerInfo = getProviderInfo(ride.provider);
          const isLowestPrice = ride.price === lowestPrice;
          const isRecommended = index === 0 && sortBy === "price";
          
          return (
            <Card
              key={ride.id}
              className={`card-modern transition-all duration-200 hover:shadow-lg ${
                isLowestPrice 
                  ? "ring-2 ring-green-500/20 bg-green-50/50 border-green-200" 
                  : "hover:border-primary/30"
              }`}
              data-testid={`card-ride-${ride.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Provider Logo */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${providerInfo.bg} shadow-md`}>
                      <span className="text-white font-bold text-xs">{providerInfo.name[0]}</span>
                    </div>

                    {/* Ride Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-foreground text-lg" data-testid={`text-service-${ride.id}`}>
                          {ride.serviceName}
                        </h4>
                        {isRecommended && (
                          <Badge className="bg-primary text-primary-foreground">
                            Recommended
                          </Badge>
                        )}
                        {ride.category === "premium" && (
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            <Crown className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                        {ride.category === "luxury" && (
                          <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                            <Crown className="mr-1 h-3 w-3" />
                            Luxury
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-2" data-testid={`text-description-${ride.id}`}>
                        {ride.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span data-testid={`text-arrival-${ride.id}`}>{ride.arrivalTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span data-testid={`text-capacity-${ride.id}`}>{ride.capacity} seats</span>
                        </div>
                        {ride.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium" data-testid={`text-rating-${ride.id}`}>
                              {ride.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {ride.surge && ride.surge > 1 && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="mr-1 h-3 w-3" />
                            {ride.surge.toFixed(1)}x Surge Pricing
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="text-right space-y-3 ml-4">
                    <div>
                      <div className={`text-2xl font-bold ${isLowestPrice ? "text-green-600" : "text-foreground"}`} data-testid={`text-price-${ride.id}`}>
                        {formatPrice(ride.price)}
                        {isLowestPrice && (
                          <Badge className="ml-2 bg-green-600 text-white text-xs">
                            BEST PRICE
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-price-range-${ride.id}`}>
                        {ride.priceRange}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleBookRide(ride)}
                      className={`w-full font-semibold ${
                        isLowestPrice 
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                          : "btn-primary"
                      }`}
                      data-testid={`button-book-${ride.id}`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Price Alerts */}
      <div className="flex justify-center">
        <PriceAlerts 
          pickup={pickup}
          dropoff={dropoff}
          currentPrice={lowestPrice}
          service={sortedEstimates[0]?.provider}
          vehicleType={sortedEstimates[0]?.serviceName}
        />
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        estimate={selectedRide}
        pickup={pickup}
        dropoff={dropoff}
      />
    </div>
  );
}