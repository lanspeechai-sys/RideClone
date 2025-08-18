import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUpdateProfile, useLogout } from "@/hooks/useAuth";
import { userProfileUpdateSchema, type UserProfileUpdate } from "@shared/schema";
import { User, Settings, LogOut, Save, Phone, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const logoutMutation = useLogout();

  const form = useForm<UserProfileUpdate>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      profileImageUrl: user?.profileImageUrl || "",
    },
  });

  const onSubmit = async (data: UserProfileUpdate) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved successfully.",
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
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error?.message || "Unable to logout",
        variant: "destructive",
      });
    }
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
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
                    className="flex-1 h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
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