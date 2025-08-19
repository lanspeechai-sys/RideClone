import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { RideEstimate } from "@shared/schema";

interface FareTrackerProps {
  currentEstimates: RideEstimate[];
  previousEstimates: RideEstimate[];
}

interface PriceChange {
  service: string;
  vehicleType: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "same";
}

export function FareTracker({ currentEstimates, previousEstimates }: FareTrackerProps) {
  const calculatePriceChanges = (): PriceChange[] => {
    const changes: PriceChange[] = [];

    currentEstimates.forEach(current => {
      const previous = previousEstimates.find(
        prev => prev.provider === current.provider && prev.serviceName === current.serviceName
      );

      if (previous) {
        const change = current.price - previous.price;
        const changePercent = (change / previous.price) * 100;
        
        changes.push({
          service: current.provider,
          vehicleType: current.serviceName,
          currentPrice: current.price,
          previousPrice: previous.price,
          change,
          changePercent,
          trend: change > 0 ? "up" : change < 0 ? "down" : "same"
        });
      }
    });

    return changes;
  };

  const priceChanges = calculatePriceChanges();
  const hasChanges = priceChanges.some(change => change.trend !== "same");

  if (!hasChanges) {
    return null;
  }

  return (
    <Card className="mx-4 mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Price Changes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {priceChanges.map((change) => (
          <div
            key={`${change.service}-${change.vehicleType}`}
            className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {change.service.toUpperCase()} {change.vehicleType}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-bold">${change.currentPrice}</div>
                <div className="text-xs text-gray-500">
                  was ${change.previousPrice}
                </div>
              </div>

              {change.trend === "up" && (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +${Math.abs(change.change).toFixed(2)}
                </Badge>
              )}

              {change.trend === "down" && (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -${Math.abs(change.change).toFixed(2)}
                </Badge>
              )}

              {change.trend === "same" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Minus className="w-3 h-3" />
                  No change
                </Badge>
              )}
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-600 text-center pt-2 border-t">
          Prices may fluctuate based on demand and availability
        </div>
      </CardContent>
    </Card>
  );
}