import { Menu, Settings, Bell, User, Home, Info, Mail, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { CountrySelector } from "@/components/country-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  onMenuClick?: () => void;
  showNotifications?: boolean;
}

export function AppHeader({ title, onMenuClick, showNotifications = false }: AppHeaderProps) {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const [location, setLocation] = useLocation();

  const handleProfileClick = () => {
    setLocation("/profile");
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-modern">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-md">
                <span className="text-lg font-bold text-white">R</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-xs text-muted-foreground">Compare rides, save money</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      )}
                      onClick={() => setLocation(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <CountrySelector />
            
            {showNotifications && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 rounded-full hover:bg-accent"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive shadow-sm"></span>
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full hover:bg-accent"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-9 w-9 border-2 border-border">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 card-modern">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="cursor-pointer focus:bg-accent"
                    data-testid="menu-profile"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    data-testid="menu-logout"
                  >
                    <Settings className="mr-2 h-4 w-4" />
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
                    className="h-10 w-10 rounded-full hover:bg-accent md:hidden"
                    data-testid="button-menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 card-modern">
                  {/* Mobile Navigation */}
                  {navigationItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.href}
                      onClick={() => setLocation(item.href)}
                      className="cursor-pointer focus:bg-accent md:hidden"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="md:hidden" />
                  <DropdownMenuItem 
                    onClick={() => setLocation("/login")}
                    className="cursor-pointer focus:bg-accent"
                    data-testid="menu-login"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation("/signup")}
                    className="cursor-pointer focus:bg-accent"
                    data-testid="menu-signup"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Desktop Auth Buttons */}
            {!user && (
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setLocation("/login")}
                  className="font-medium"
                  data-testid="button-login-desktop"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => setLocation("/signup")}
                  className="btn-primary font-medium"
                  data-testid="button-signup-desktop"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}