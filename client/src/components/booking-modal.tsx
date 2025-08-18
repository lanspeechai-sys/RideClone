import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RideEstimate, Location } from "@shared/schema";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideEstimate | null;
  pickup: Location | null;
  dropoff: Location | null;
}

export function BookingModal({ isOpen, onClose, ride, pickup, dropoff }: BookingModalProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  if (!ride || !pickup || !dropoff) return null;

  const handleBookRide = async () => {
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsBooking(false);
    setIsBooked(true);
    
    toast({
      title: "Ride booked successfully!",
      description: `Your ${ride.serviceName} will arrive in ${ride.arrivalTime}`,
    });

    // Close modal after showing success
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 3000);
  };

  const getProviderLogo = (provider: string) => {
    const logos = {
      uber: { bg: "bg-black", text: "UBER" },
      bolt: { bg: "bg-green-600", text: "BOLT" },
      yango: { bg: "bg-yellow-500", text: "YANGO" },
    };
    return logos[provider as keyof typeof logos] || { bg: "bg-gray-600", text: provider.toUpperCase() };
  };

  const logo = getProviderLogo(ride.provider);

  if (isBooked) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Ride Booked!
            </h3>
            <p className="text-gray-600 mb-4">
              Your {ride.serviceName} will arrive in {ride.arrivalTime}
            </p>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                You'll receive updates about your driver's location and arrival time.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Confirm Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Ride Service */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${logo.bg} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-xs">{logo.text}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary">{ride.serviceName}</h4>
              <p className="text-sm text-gray-600">{ride.description}</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{ride.arrivalTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{ride.capacity} seats</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                ${ride.price.toFixed(2)}
              </div>
              {ride.category === "premium" && (
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Pickup</p>
                <p className="text-xs text-gray-600 truncate">{pickup.address}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Drop-off</p>
                <p className="text-xs text-gray-600 truncate">{dropoff.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Payment</span>
            </div>
            <span className="text-sm font-medium text-primary">•••• 1234</span>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base fare</span>
              <span className="text-primary">${(ride.price * 0.8).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service fee</span>
              <span className="text-primary">${(ride.price * 0.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-primary">${(ride.price * 0.05).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-primary">Total</span>
              <span className="text-primary">${ride.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            data-testid="button-cancel-booking"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookRide}
            disabled={isBooking}
            className="flex-1 bg-primary hover:bg-primary/90"
            data-testid="button-confirm-booking"
          >
            {isBooking ? "Booking..." : "Book Ride"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}