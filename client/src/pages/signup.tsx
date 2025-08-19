import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSignup } from "@/hooks/useAuth";
import { useSearchContext } from "@/contexts/SearchContext";
import { userSignupSchema, type UserSignup } from "@shared/schema";
import { useCountry, COUNTRIES, type Country } from "@/contexts/CountryContext";
import { checkLocationPermission, getCurrentLocation } from "@/lib/geolocation";
import { Eye, EyeOff, UserPlus, Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  const signupMutation = useSignup();
  const { searchData } = useSearchContext();
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [, setLocation] = useLocation();

  const form = useForm<UserSignup>({
    resolver: zodResolver(userSignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      country: selectedCountry.code,
    },
  });

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const permission = await checkLocationPermission();
      if (permission === 'denied') {
        toast({
          title: "Location access denied",
          description: "Please enable location access in your browser settings",
          variant: "destructive",
        });
        return;
      }

      const position = await getCurrentLocation();
      toast({
        title: "Location detected",
        description: `Found your location (${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)})`,
      });
      
      // Here you could add logic to detect country from coordinates
      // For now, we'll just show the success message
    } catch (error: any) {
      toast({
        title: "Location access failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const onSubmit = async (data: UserSignup) => {
    try {
      // Sync the country selection to context
      const selectedCountryObj = COUNTRIES.find(c => c.code === data.country) || selectedCountry;
      setSelectedCountry(selectedCountryObj);
      
      await signupMutation.mutateAsync(data);
      toast({
        title: "Account created!",
        description: searchData ? "Welcome! Continuing your ride search..." : "Welcome to RideCompare! You're now logged in.",
      });
      // Redirect to home page to restore search context
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error?.message || "Unable to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-page p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-primary rounded-2xl shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Join RideCompare
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account to start comparing rides
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="input-modern h-11"
                            data-testid="input-first-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="input-modern h-11"
                            data-testid="input-last-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          className="input-modern h-11"
                          data-testid="input-username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="input-modern h-11"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="input-modern h-11 pr-12"
                            data-testid="input-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country Selection */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Country/Region
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-country">
                        <FormControl>
                          <SelectTrigger className="input-modern h-11">
                            <SelectValue placeholder="Select your country">
                              {field.value && (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{COUNTRIES.find(c => c.code === field.value)?.flag}</span>
                                  <span>{COUNTRIES.find(c => c.code === field.value)?.name}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="card-modern">
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code} data-testid={`option-${country.code}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                                <span className="text-muted-foreground">({country.currency})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Permission */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Enable Location Access</p>
                          <p className="text-sm text-blue-700">
                            Get better ride estimates and automatic location detection
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="border-blue-200 text-blue-700 hover:bg-blue-100"
                        data-testid="button-location-permission"
                      >
                        {isGettingLocation ? "Getting..." : "Allow"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="btn-primary w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={signupMutation.isPending}
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login">
                  <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:text-primary/80">
                    Sign in
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}