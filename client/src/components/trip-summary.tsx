import { TrendingDown, Clock, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RideComparisonResponse } from "@shared/schema";

interface TripSummaryProps {
  data: RideComparisonResponse;
}

export function TripSummary({ data }: TripSummaryProps) {
  const lowestPrice = Math.min(...data.estimates.map(e => e.price));
  const highestPrice = Math.max(...data.estimates.map(e => e.price));
  const avgPrice = data.estimates.reduce((sum, e) => sum + e.price, 0) / data.estimates.length;
  const savings = highestPrice - lowestPrice;
  const savingsPercent = Math.round((savings / highestPrice) * 100);

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="bg-white mt-2 shadow-sm rounded-xl overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary">Trip Overview</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {data.estimates.length} options found
          </Badge>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-primary" data-testid="text-distance">
                {formatDistance(data.tripDistance)}
              </p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-primary" data-testid="text-duration">
                {formatDuration(data.tripDuration)}
              </p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>
        </div>

        {/* Price Analysis */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-primary mb-3">Price Analysis</h4>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-700" data-testid="text-lowest-price">
                ${lowestPrice.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">Lowest</div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-700" data-testid="text-average-price">
                ${avgPrice.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600">Average</div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-700" data-testid="text-highest-price">
                ${highestPrice.toFixed(2)}
              </div>
              <div className="text-xs text-red-600">Highest</div>
            </div>
          </div>

          {savings > 2 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">
                  Save up to <strong>${savings.toFixed(2)} ({savingsPercent}%)</strong> by choosing the lowest price
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Provider Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-primary mb-3">Provider Summary</h4>
          
          <div className="space-y-2">
            {["uber", "bolt", "yango"].map(provider => {
              const providerRides = data.estimates.filter(e => e.provider === provider);
              if (providerRides.length === 0) return null;
              
              const minPrice = Math.min(...providerRides.map(e => e.price));
              const maxPrice = Math.max(...providerRides.map(e => e.price));
              
              const getProviderInfo = (p: string) => {
                const info = {
                  uber: { name: "Uber", bg: "bg-black", color: "text-black" },
                  bolt: { name: "Bolt", bg: "bg-green-600", color: "text-green-600" },
                  yango: { name: "Yango", bg: "bg-yellow-500", color: "text-yellow-600" },
                };
                return info[p as keyof typeof info];
              };

              const info = getProviderInfo(provider);
              
              return (
                <div key={provider} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${info.bg} rounded flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">
                        {info.name.substring(0, 1)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-primary">{info.name}</div>
                      <div className="text-xs text-gray-500">
                        {providerRides.length} option{providerRides.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${info.color}`}>
                      {minPrice === maxPrice ? (
                        `$${minPrice.toFixed(2)}`
                      ) : (
                        `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}