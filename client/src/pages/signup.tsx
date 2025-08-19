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
import { Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const signupMutation = useSignup();
  const { searchData } = useSearchContext();
  const [, setLocation] = useLocation();

  const form = useForm<UserSignup>({
    resolver: zodResolver(userSignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: UserSignup) => {
    try {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 gradient-secondary rounded-2xl shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Join RideCompare
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account to start comparing rides
          </p>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
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
                        <FormLabel className="text-primary font-semibold">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
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
                            placeholder="Doe"
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          className="h-11 border-2 focus:border-primary focus:ring-primary/20"
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
                      <FormLabel className="text-primary font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="h-11 border-2 focus:border-primary focus:ring-primary/20"
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
                      <FormLabel className="text-primary font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="h-11 border-2 focus:border-primary focus:ring-primary/20 pr-12"
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
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 gradient-secondary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  disabled={signupMutation.isPending}
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
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