import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchProvider } from "@/contexts/SearchContext";
import { SearchHistoryProvider } from "@/contexts/SearchHistoryContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-semibold">Loading RideCompare...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - accessible to all users */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      
      {/* Protected routes - only for authenticated users */}
      {isAuthenticated && (
        <Route path="/profile" component={Profile} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CountryProvider>
        <SearchHistoryProvider>
          <SearchProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </SearchProvider>
        </SearchHistoryProvider>
      </CountryProvider>
    </QueryClientProvider>
  );
}

export default App;
