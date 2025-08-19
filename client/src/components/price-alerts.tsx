import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellRing, Trash2, TrendingDown, DollarSign } from "lucide-react";
import type { Location } from "@shared/schema";

interface PriceAlert {
  id: string;
  pickup: Location;
  dropoff: Location;
  targetPrice: number;
  service: string;
  vehicleType: string;
  isActive: boolean;
  createdAt: Date;
}

interface PriceAlertsProps {
  pickup: Location | null;
  dropoff: Location | null;
  currentPrice?: number;
  service?: string;
  vehicleType?: string;
}

export function PriceAlerts({ pickup, dropoff, currentPrice, service, vehicleType }: PriceAlertsProps) {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [targetPrice, setTargetPrice] = useState("");
  const { toast } = useToast();

  const handleCreateAlert = () => {
    if (!pickup || !dropoff || !targetPrice || !service || !vehicleType) {
      toast({
        title: "Missing information",
        description: "Please complete a ride search first to set up price alerts",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price amount",
        variant: "destructive",
      });
      return;
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      pickup,
      dropoff,
      targetPrice: price,
      service,
      vehicleType,
      isActive: true,
      createdAt: new Date(),
    };

    setAlerts(prev => [newAlert, ...prev]);
    setTargetPrice("");
    toast({
      title: "Price alert created!",
      description: `You'll be notified when ${service} ${vehicleType} drops to $${price}`,
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert deleted",
      description: "Price alert has been removed",
    });
  };

  const suggestedPrice = currentPrice ? Math.floor(currentPrice * 0.9) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
          data-testid="button-price-alerts"
        >
          <Bell className="w-4 h-4" />
          Price Alerts
          {alerts.filter(a => a.isActive).length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {alerts.filter(a => a.isActive).length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            Price Alerts
          </DialogTitle>
          <DialogDescription>
            Get notified when ride prices drop to your target amount
          </DialogDescription>
        </DialogHeader>

        {pickup && dropoff && (
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Create New Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <span>From: <strong>{pickup.address}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>To: <strong>{dropoff.address}</strong></span>
                </div>
              </div>

              {currentPrice && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Current Price:</span>
                  <span className="font-bold text-lg">${currentPrice}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="target-price">Target Price ($)</Label>
                <div className="flex gap-2">
                  <Input
                    id="target-price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Enter target price"
                    type="number"
                    step="0.01"
                    data-testid="input-target-price"
                  />
                  {suggestedPrice > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTargetPrice(suggestedPrice.toString())}
                      className="text-xs whitespace-nowrap"
                      data-testid="button-suggested-price"
                    >
                      ${suggestedPrice}
                    </Button>
                  )}
                </div>
                {suggestedPrice > 0 && (
                  <p className="text-xs text-gray-500">
                    Suggestion: ${suggestedPrice} (10% below current price)
                  </p>
                )}
              </div>

              <Button
                onClick={handleCreateAlert}
                className="w-full"
                data-testid="button-create-alert"
              >
                <Bell className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        )}

        {alerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Your Alerts ({alerts.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-600 mb-1">
                          {alert.pickup.address} → {alert.dropoff.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="font-bold">${alert.targetPrice}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.service} {alert.vehicleType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => toggleAlert(alert.id)}
                          data-testid={`switch-alert-${alert.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={() => deleteAlert(alert.id)}
                          data-testid={`button-delete-alert-${alert.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Created {alert.createdAt.toLocaleDateString()}
                      </span>
                      {alert.isActive ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Paused</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && !pickup && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Search for rides first to create price alerts</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}