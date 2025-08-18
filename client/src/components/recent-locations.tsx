import { Clock, Home, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Location } from "@shared/schema";

interface RecentLocationsProps {
  onLocationSelect: (location: Location) => void;
}

export function RecentLocations({ onLocationSelect }: RecentLocationsProps) {
  // Mock recent locations - in real app, this would come from local storage or API
  const recentLocations = [
    {
      id: "home",
      address: "Home",
      type: "home" as const,
      icon: Home,
      description: "123 Main St, New York, NY",
      latitude: 40.7589,
      longitude: -73.9851,
    },
    {
      id: "work",
      address: "Work",
      type: "work" as const,
      icon: Briefcase,
      description: "456 Business Ave, New York, NY",
      latitude: 40.7505,
      longitude: -73.9934,
    },
    {
      id: "recent1",
      address: "Central Park",
      type: "recent" as const,
      icon: MapPin,
      description: "Central Park, New York, NY",
      latitude: 40.7829,
      longitude: -73.9654,
    },
    {
      id: "recent2",
      address: "Times Square",
      type: "recent" as const,
      icon: Clock,
      description: "Times Square, New York, NY",
      latitude: 40.7580,
      longitude: -73.9855,
    },
  ];

  const handleLocationClick = (location: any) => {
    onLocationSelect({
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-2">
      <h3 className="font-semibold text-primary mb-3 text-sm">Quick locations</h3>
      <div className="space-y-2">
        {recentLocations.map((location) => {
          const IconComponent = location.icon;
          return (
            <Button
              key={location.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => handleLocationClick(location)}
              data-testid={`button-location-${location.id}`}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 bg-gray-100 rounded-full">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-primary text-sm">
                    {location.address}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {location.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}