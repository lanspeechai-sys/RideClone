import { Menu, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  title: string;
  onMenuClick?: () => void;
  showNotifications?: boolean;
}

export function AppHeader({ title, onMenuClick, showNotifications = false }: AppHeaderProps) {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const [, setLocation] = useLocation();

  const handleProfileClick = () => {
    setLocation("/profile");
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <header className="glass-effect border-b-0 sticky top-0 z-50 shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/20 relative"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full text-xs shadow-sm"></span>
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="rounded-full hover:bg-white/20 h-10 w-10 p-0"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect border-0 shadow-xl">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-primary">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-profile"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                    data-testid="menu-logout"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-white/20"
                    data-testid="button-menu"
                  >
                    <Menu className="w-6 h-6 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect border-0 shadow-xl">
                  <DropdownMenuItem 
                    onClick={() => setLocation("/login")}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-login"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation("/signup")}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-signup"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setLocation("/about")}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-about"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    About Us
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation("/contact")}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-contact"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Contact Us
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation("/pricing")}
                    className="cursor-pointer hover:bg-primary/10"
                    data-testid="menu-pricing"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Pricing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}