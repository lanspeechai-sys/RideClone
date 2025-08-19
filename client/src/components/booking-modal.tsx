import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, DollarSign, User, Phone, CreditCard, CheckCircle } from "lucide-react";
import type { RideEstimate, Location } from "@shared/schema";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: RideEstimate | null;
  pickup: Location | null;
  dropoff: Location | null;
}

export function BookingModal({ open, onOpenChange, estimate, pickup, dropoff }: BookingModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!passengerName || !passengerPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep("confirmation");
      toast({
        title: "Ride booked successfully!",
        description: "Your driver will arrive in approximately " + estimate?.arrivalTime + " minutes",
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Unable to book your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setPassengerName("");
    setPassengerPhone("");
    setPaymentMethod("");
    onOpenChange(false);
  };

  if (!estimate || !pickup || !dropoff) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Book Your Ride
          </DialogTitle>
          <DialogDescription>
            Complete your booking details below
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-6">
            {/* Ride Summary */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {estimate.provider === "uber" && (
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                  )}
                  {estimate.provider === "bolt" && (
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                  )}
                  {estimate.provider === "yango" && (
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Y</span>
                    </div>
                  )}
                  {estimate.serviceName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{pickup.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{dropoff.address}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">ETA:</span>
                    <Badge variant="secondary">{estimate.arrivalTime} min</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-primary">${estimate.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Passenger Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="passenger-name">Full Name</Label>
                  <Input
                    id="passenger-name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Enter your full name"
                    data-testid="input-passenger-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="passenger-phone">Phone Number</Label>
                  <Input
                    id="passenger-phone"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    data-testid="input-passenger-phone"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleBooking}
                disabled={isBooking}
                className="flex-1"
                data-testid="button-confirm-booking"
              >
                {isBooking ? "Booking..." : "Book Ride"}
              </Button>
            </div>
          </div>
        )}

        {step === "confirmation" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Ride Booked Successfully!</h3>
              <p className="text-gray-600">Your driver will arrive in approximately <strong>{estimate.arrivalTime} minutes</strong></p>
            </div>

            <Card className="text-left">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono font-semibold">RC{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{estimate.provider.toUpperCase()} {estimate.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold">${estimate.price}</span>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleClose} className="w-full" data-testid="button-close-confirmation">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}