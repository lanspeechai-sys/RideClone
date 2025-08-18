import { Menu, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
  onMenuClick?: () => void;
  showNotifications?: boolean;
}

export function AppHeader({ title, onMenuClick, showNotifications = false }: AppHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-100 relative"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={onMenuClick}
              data-testid="button-menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}