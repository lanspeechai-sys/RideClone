import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RideEstimate } from "@shared/schema";

interface RideComparisonProps {
  estimates: RideEstimate[];
  sortBy: "price" | "time" | "rating";
  onSortChange: (sort: "price" | "time" | "rating") => void;
}

export function RideComparison({ estimates, sortBy, onSortChange }: RideComparisonProps) {
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

  return (
    <>
      <section className="mt-4 px-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Available Rides</h3>
        
        <div className="space-y-3">
          {sortedEstimates.map((ride) => {
            const logo = getProviderLogo(ride.provider);
            return (
              <div
                key={ride.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
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
                        {ride.category === "premium" && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <Badge variant="secondary" className="text-xs text-accent font-medium">
                              Premium
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary" data-testid={`text-price-${ride.id}`}>
                      ${ride.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`text-price-range-${ride.id}`}>
                      {ride.priceRange}
                    </div>
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
    </>
  );
}
