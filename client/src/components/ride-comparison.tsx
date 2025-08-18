import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "./booking-modal";
import { PriceAlerts } from "./price-alerts";
import type { RideEstimate, Location } from "@shared/schema";

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
  const sortedEstimates = [...estimates].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "time":
        return parseInt(a.arrivalTime) - parseInt(b.arrivalTime);
      case "rating":
        return a.category === "premium" ? -1 : 1;
      default:
        return 0;
    }
  });

  const getProviderLogo = (provider: string) => {
    const logos = {
      uber: { bg: "bg-black", text: "UBER" },
      bolt: { bg: "bg-green-600", text: "BOLT" },
      yango: { bg: "bg-yellow-500", text: "YANGO" },
    };
    return logos[provider as keyof typeof logos] || { bg: "bg-gray-600", text: provider.toUpperCase() };
  };

  const handleBookRide = (ride: RideEstimate) => {
    setSelectedRide(ride);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRide(null);
  };

  const lowestPrice = Math.min(...estimates.map(e => e.price));
  const highestPrice = Math.max(...estimates.map(e => e.price));

  return (
    <>
      <section className="mt-4 px-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Available Rides</h3>
        
        <div className="space-y-3">
          {sortedEstimates.map((ride) => {
            const logo = getProviderLogo(ride.provider);
            const isLowestPrice = ride.price === lowestPrice;
            
            return (
              <div
                key={ride.id}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 ${
                  isLowestPrice 
                    ? "border-green-200 bg-green-50 ring-2 ring-green-100" 
                    : "border-gray-100 hover:shadow-md cursor-pointer"
                }`}
                data-testid={`card-ride-${ride.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${logo.bg} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{logo.text}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary" data-testid={`text-service-${ride.id}`}>
                        {ride.serviceName}
                      </h4>
                      <p className="text-sm text-gray-600" data-testid={`text-description-${ride.id}`}>
                        {ride.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500" data-testid={`text-arrival-${ride.id}`}>
                          {ride.arrivalTime}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500" data-testid={`text-capacity-${ride.id}`}>
                          {ride.capacity} seats
                        </span>
                        {ride.rating && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-yellow-600 font-medium" data-testid={`text-rating-${ride.id}`}>
                              ⭐ {ride.rating.toFixed(1)}
                            </span>
                          </>
                        )}
                        {ride.category === "premium" && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <Badge variant="secondary" className="text-xs text-accent font-medium">
                              Premium
                            </Badge>
                          </>
                        )}
                      </div>
                      {ride.surge && ride.surge > 1.0 && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          🔥 {ride.surge.toFixed(1)}x surge pricing
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="space-y-1">
                      <div className={`text-lg font-bold ${isLowestPrice ? "text-green-700" : "text-primary"}`} data-testid={`text-price-${ride.id}`}>
                        ${ride.price.toFixed(2)}
                        {isLowestPrice && (
                          <span className="ml-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">
                            BEST
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500" data-testid={`text-price-range-${ride.id}`}>
                        {ride.priceRange}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBookRide(ride)}
                      className={`w-full text-xs py-2 ${
                        isLowestPrice 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                      data-testid={`button-book-${ride.id}`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Price Filters */}
      <section className="mt-6 px-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-primary mb-3">Filter Options</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "price" ? "default" : "secondary"}
              size="sm"
              onClick={() => onSortChange("price")}
              className="px-3 py-2 rounded-full text-sm font-medium"
              data-testid="button-filter-price"
            >
              Price: Low to High
            </Button>
            <Button
              variant={sortBy === "time" ? "default" : "secondary"}
              size="sm"
              onClick={() => onSortChange("time")}
              className="px-3 py-2 rounded-full text-sm font-medium"
              data-testid="button-filter-time"
            >
              Fastest First
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "secondary"}
              size="sm"
              onClick={() => onSortChange("rating")}
              className="px-3 py-2 rounded-full text-sm font-medium"
              data-testid="button-filter-rating"
            >
              Highly Rated
            </Button>
          </div>
        </div>
      </section>

      {/* Price Alerts */}
      <PriceAlerts 
        currentLowPrice={lowestPrice} 
        currentHighPrice={highestPrice} 
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        ride={selectedRide}
        pickup={pickup}
        dropoff={dropoff}
      />
    </>
  );
}
