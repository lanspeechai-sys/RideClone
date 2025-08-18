import { useState } from "react";
import { Bell, BellOff, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface PriceAlertsProps {
  currentLowPrice: number;
  currentHighPrice: number;
}

export function PriceAlerts({ currentLowPrice, currentHighPrice }: PriceAlertsProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(currentLowPrice * 0.9));
  const { toast } = useToast();

  const handleToggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Price alerts disabled" : "Price alerts enabled",
      description: alertsEnabled 
        ? "You'll no longer receive price notifications"
        : `You'll get notified when prices drop below $${targetPrice}`,
    });
  };

  const handleSetPriceAlert = (price: number) => {
    setTargetPrice(price);
    if (!alertsEnabled) {
      setAlertsEnabled(true);
    }
    toast({
      title: "Price alert set",
      description: `You'll be notified when rides cost less than $${price}`,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {alertsEnabled ? (
            <Bell className="w-5 h-5 text-accent" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
          <h3 className="font-semibold text-primary">Price Alerts</h3>
        </div>
        <Switch
          checked={alertsEnabled}
          onCheckedChange={handleToggleAlerts}
          data-testid="switch-price-alerts"
        />
      </div>

      {alertsEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Alert when below</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ${targetPrice}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPriceAlert(Math.round(currentLowPrice * 0.8))}
              className="text-xs px-3 py-2"
              data-testid="button-alert-20-off"
            >
              20% off (${Math.round(currentLowPrice * 0.8)})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPriceAlert(Math.round(currentLowPrice * 0.9))}
              className="text-xs px-3 py-2"
              data-testid="button-alert-10-off"
            >
              10% off (${Math.round(currentLowPrice * 0.9)})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPriceAlert(Math.round(currentLowPrice - 2))}
              className="text-xs px-3 py-2"
              data-testid="button-alert-2-less"
            >
              $2 less
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}