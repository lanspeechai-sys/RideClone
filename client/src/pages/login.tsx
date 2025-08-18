import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/useAuth";
import { userLoginSchema, type UserLogin } from "@shared/schema";
import { Eye, EyeOff, Sparkles, Zap } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserLogin) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Welcome back! 🎉",
        description: "You've successfully logged in to RideCompare.",
      });
      // Navigation will be handled by the App component based on auth state
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const fillDemoCredentials = () => {
    form.setValue("username", "demo");
    form.setValue("password", "demo123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 gradient-primary rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to compare rides and save money
          </p>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
              Sign In
            </CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Demo Credentials Alert */}
            <Alert className="mb-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
              <Zap className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Demo credentials:</strong> username: <code className="bg-amber-100 px-1 rounded">demo</code>, password: <code className="bg-amber-100 px-1 rounded">demo123</code>
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2 text-amber-700 font-semibold hover:text-amber-800"
                  onClick={fillDemoCredentials}
                  type="button"
                  data-testid="button-fill-demo"
                >
                  Use Demo
                </Button>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className="h-12 border-2 focus:border-primary focus:ring-primary/20"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-12 border-2 focus:border-primary focus:ring-primary/20 pr-12"
                            data-testid="input-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
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
                  className="w-full h-12 gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup">
                  <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:text-primary/80">
                    Create account
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