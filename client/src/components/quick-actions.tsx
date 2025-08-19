import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Home, Briefcase } from "lucide-react";
import type { Location } from "@shared/schema";

interface QuickActionsProps {
  onLocationSelect: (location: Location, isPickup?: boolean) => void;
}

const quickLocations: Array<{
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  location: Location;
  type: "home" | "work" | "favorite";
}> = [
  {
    name: "Home",
    icon: Home,
    location: {
      address: "Home",
      latitude: 40.7128 + Math.random() * 0.1,
      longitude: -74.0060 + Math.random() * 0.1,
    },
    type: "home",
  },
  {
    name: "Work",
    icon: Briefcase,
    location: {
      address: "Work",
      latitude: 40.7128 + Math.random() * 0.1,
      longitude: -74.0060 + Math.random() * 0.1,
    },
    type: "work",
  },
  {
    name: "Airport",
    icon: MapPin,
    location: {
      address: "JFK Airport",
      latitude: 40.6413,
      longitude: -73.7781,
    },
    type: "favorite",
  },
  {
    name: "Central Park",
    icon: Star,
    location: {
      address: "Central Park, New York",
      latitude: 40.7829,
      longitude: -73.9654,
    },
    type: "favorite",
  },
];

export function QuickActions({ onLocationSelect }: QuickActionsProps) {
  return (
    <Card className="mx-4 mb-4 glass-effect border-0 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Quick Locations</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLocations.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-10 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 justify-start"
              onClick={() => onLocationSelect(item.location)}
              data-testid={`quick-location-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}