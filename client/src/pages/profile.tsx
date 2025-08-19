import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUpdateProfile, useLogout } from "@/hooks/useAuth";
import { userProfileUpdateSchema, type UserProfileUpdate } from "@shared/schema";
import { useCountry, COUNTRIES, type Country } from "@/contexts/CountryContext";
import { checkLocationPermission, getCurrentLocation } from "@/lib/geolocation";
import { User, Settings, LogOut, Save, Phone, Calendar, ArrowLeft, Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const logoutMutation = useLogout();
  const { selectedCountry, setSelectedCountry, formatPrice } = useCountry();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<UserProfileUpdate>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      profileImageUrl: user?.profileImageUrl || "",
      country: user?.country || selectedCountry.code,
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

  const onSubmit = async (data: UserProfileUpdate) => {
    try {
      // Sync the country selection to context if changed
      if (data.country && data.country !== selectedCountry.code) {
        const selectedCountryObj = COUNTRIES.find(c => c.code === data.country) || selectedCountry;
        setSelectedCountry(selectedCountryObj);
      }
      
      await updateProfileMutation.mutateAsync(data);
      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved successfully. Ride prices will now display in your local currency.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Unable to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      // Redirect to login page after successful logout
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error?.message || "Unable to logout",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  if (!user) {
    return null; // Will be handled by App.tsx authentication routing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 gradient-primary rounded-2xl shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="glass-effect border-0 shadow-xl mb-6">
          <CardHeader className="text-center pb-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-primary">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-lg">
                  @{user.username}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your first name"
                              className="h-11 border-2 focus:border-primary focus:ring-primary/20"
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
                          <FormLabel className="text-primary font-semibold">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your last name"
                              className="h-11 border-2 focus:border-primary focus:ring-primary/20"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="h-11 border-2 focus:border-primary focus:ring-primary/20"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Additional Information
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="h-11 border-2 focus:border-primary focus:ring-primary/20"
                              data-testid="input-phone"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-11 border-2 focus:border-primary focus:ring-primary/20"
                              data-testid="input-date-of-birth"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profileImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://example.com/your-photo.jpg"
                              className="h-11 border-2 focus:border-primary focus:ring-primary/20"
                              data-testid="input-profile-image"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Location & Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Location & Preferences
                  </h3>

                  <div className="space-y-4">
                    {/* Current Country Display */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">Current Location Setting</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{selectedCountry.flag}</span>
                            <span className="text-blue-700 font-medium">{selectedCountry.name}</span>
                            <span className="text-blue-600">•</span>
                            <span className="text-blue-600">Prices shown in {selectedCountry.currency}</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">
                            Ride prices: {formatPrice(25)} - {formatPrice(45)} for typical rides
                          </p>
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
                          <MapPin className="w-4 h-4 mr-2" />
                          {isGettingLocation ? "Getting..." : "Get Location"}
                        </Button>
                      </div>
                    </div>

                    {/* Country Selection */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Country/Region
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-country">
                            <FormControl>
                              <SelectTrigger className="h-11 border-2 focus:border-primary focus:ring-primary/20">
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
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country.code} value={country.code} data-testid={`option-${country.code}`}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{country.flag}</span>
                                    <span>{country.name}</span>
                                    <span className="text-gray-500">({country.currency})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          <p className="text-sm text-gray-500 mt-1">
                            Changing your country will update ride prices to local currency
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 font-semibold"
                    onClick={handleBack}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 h-12 gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}