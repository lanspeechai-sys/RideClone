import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RideEstimate } from "@shared/schema";

interface FareTrackerProps {
  currentEstimates: RideEstimate[];
  previousEstimates: RideEstimate[] | null;
}

export function FareTracker({ currentEstimates, previousEstimates }: FareTrackerProps) {
  const [fareChanges, setFareChanges] = useState<Array<{
    id: string;
    serviceName: string;
    change: number;
    changePercent: number;
    trend: "up" | "down" | "same";
  }>>([]);

  useEffect(() => {
    if (!previousEstimates || previousEstimates.length === 0) return;

    const changes = currentEstimates.map(current => {
      const previous = previousEstimates.find(p => p.id === current.id);
      if (!previous) return null;

      const change = current.price - previous.price;
      const changePercent = Math.round((change / previous.price) * 100);
      
      let trend: "up" | "down" | "same" = "same";
      if (change > 0.5) trend = "up";
      else if (change < -0.5) trend = "down";

      return {
        id: current.id,
        serviceName: current.serviceName,
        change,
        changePercent,
        trend,
      };
    }).filter(Boolean) as Array<{
      id: string;
      serviceName: string;
      change: number;
      changePercent: number;
      trend: "up" | "down" | "same";
    }>;

    setFareChanges(changes.filter(c => c.trend !== "same"));
  }, [currentEstimates, previousEstimates]);

  if (fareChanges.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mx-4">
      <h4 className="font-semibold text-primary mb-3 text-sm">Price Updates</h4>
      
      <div className="space-y-2">
        {fareChanges.slice(0, 3).map(change => {
          const TrendIcon = change.trend === "up" ? TrendingUp : 
                           change.trend === "down" ? TrendingDown : Minus;
          const trendColor = change.trend === "up" ? "text-red-600" : 
                           change.trend === "down" ? "text-green-600" : "text-gray-500";
          const bgColor = change.trend === "up" ? "bg-red-50 border-red-200" : 
                         change.trend === "down" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200";

          return (
            <div
              key={change.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${bgColor}`}
              data-testid={`fare-change-${change.id}`}
            >
              <div className="flex items-center space-x-3">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <div>
                  <div className="text-sm font-medium text-primary">
                    {change.serviceName}
                  </div>
                  <div className={`text-xs ${trendColor}`}>
                    {change.trend === "up" ? "Price increased" : "Price decreased"}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-bold ${trendColor}`}>
                  {change.change > 0 ? "+" : ""}${change.change.toFixed(2)}
                </div>
                <div className={`text-xs ${trendColor}`}>
                  ({change.change > 0 ? "+" : ""}{change.changePercent}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fareChanges.length > 3 && (
        <div className="mt-3 text-center">
          <Badge variant="secondary" className="text-xs">
            +{fareChanges.length - 3} more changes
          </Badge>
        </div>
      )}
    </div>
  );
}