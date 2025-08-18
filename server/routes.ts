import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import passport from 'passport';
import { tripRequestSchema, type RideComparisonResponse, userLoginSchema, userSignupSchema, userProfileUpdateSchema } from "@shared/schema";
import { setupAuth, requireAuth, requireNoAuth } from "./auth";
import { storage } from "./storage";

const UBER_SERVER_TOKEN = process.env.UBER_SERVER_TOKEN || process.env.VITE_UBER_SERVER_TOKEN || "";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const { username, password } = userLoginSchema.parse(req.body);
      
      passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication error' });
        }
        if (!user) {
          return res.status(401).json({ error: info.message || 'Invalid credentials' });
        }
        
        req.logIn(user, (err: any) => {
          if (err) {
            return res.status(500).json({ error: 'Login error' });
          }
          return res.json({ 
            message: 'Login successful',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
            }
          });
        });
      })(req, res, next);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = userSignupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Create new user
      const newUser = await storage.createUser(userData);
      
      // Auto-login after signup
      req.logIn(newUser, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Signup successful but login failed' });
        }
        return res.json({ 
          message: 'Signup successful',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            profileImageUrl: newUser.profileImageUrl,
          }
        });
      });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request data' });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      return res.json({ message: 'Logout successful' });
    });
  });

  app.get("/api/auth/user", requireAuth, (req, res) => {
    const user = req.user as any;
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      profileImageUrl: user.profileImageUrl,
    });
  });

  app.put("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const updateData = userProfileUpdateSchema.parse(req.body);
      
      // Convert dateOfBirth string to Date if provided
      const processedUpdateData = {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
      };
      
      const updatedUser = await storage.updateUser(user.id, processedUpdateData);
      
      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          dateOfBirth: updatedUser.dateOfBirth,
          profileImageUrl: updatedUser.profileImageUrl,
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request data' });
    }
  });

  // Get ride price estimates
  app.post("/api/rides/compare", async (req, res) => {
    try {
      const request = tripRequestSchema.parse(req.body);
      
      // Calculate distance and duration
      const distance = calculateDistance(
        request.pickup.latitude,
        request.pickup.longitude,
        request.dropoff.latitude,
        request.dropoff.longitude
      );
      
      const duration = Math.round(distance * 0.25); // Rough estimate: 4 km/h average speed
      
      // Get Uber estimates
      const uberEstimates = await getUberEstimates(request);
      
      // Get mock estimates for Bolt and Yango
      const boltEstimates = getMockBoltEstimates(distance, duration);
      const yangoEstimates = getMockYangoEstimates(distance, duration);
      
      const response: RideComparisonResponse = {
        tripDistance: distance,
        tripDuration: duration,
        estimates: [...uberEstimates, ...boltEstimates, ...yangoEstimates],
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error comparing rides:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get ride estimates"
      });
    }
  });

  // Geocoding endpoint for location search
  app.get("/api/geocode", async (req, res) => {
    try {
      const { address } = req.query;
      if (!address || typeof address !== "string") {
        return res.status(400).json({ message: "Address parameter is required" });
      }
      
      // Mock geocoding - in real app you'd use Google Maps API or similar
      const mockResults = [
        {
          address: address,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        }
      ];
      
      res.json(mockResults);
    } catch (error) {
      res.status(500).json({ message: "Geocoding failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function getUberEstimates(request: any) {
  if (!UBER_SERVER_TOKEN) {
    console.warn("No Uber API token provided, using mock data");
    return getMockUberEstimates(3200, 12);
  }

  try {
    const response = await fetch(
      `https://api.uber.com/v1.2/estimates/price?start_latitude=${request.pickup.latitude}&start_longitude=${request.pickup.longitude}&end_latitude=${request.dropoff.latitude}&end_longitude=${request.dropoff.longitude}`,
      {
        headers: {
          Authorization: `Token ${UBER_SERVER_TOKEN}`,
          "Accept-Language": "en_US",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Uber API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.prices?.map((price: any, index: number) => ({
      id: `uber-${index}`,
      provider: "uber" as const,
      serviceName: price.localized_display_name || price.display_name,
      description: getUberDescription(price.display_name),
      price: price.high_estimate || parseFloat(price.estimate?.replace(/[^0-9.]/g, "") || "0"),
      priceRange: price.estimate || `$${price.low_estimate}-${price.high_estimate}`,
      currency: price.currency_code || "USD",
      arrivalTime: `${Math.floor(Math.random() * 5) + 2} min away`,
      capacity: 4,
      category: getUberCategory(price.display_name),
      estimatedDuration: price.duration || 12,
      distance: price.distance || 3200,
    })) || [];
  } catch (error) {
    console.error("Uber API error:", error);
    return getMockUberEstimates(3200, 12);
  }
}

function getMockUberEstimates(distance: number, duration: number) {
  const basePrice = Math.round((distance / 1000) * 3.5 + 5);
  const surge = Math.random() > 0.7 ? 1.2 + Math.random() * 0.8 : 1.0; // 30% chance of surge
  
  return [
    {
      id: "uber-x",
      provider: "uber" as const,
      serviceName: "UberX",
      description: "Affordable everyday rides",
      price: Math.round(basePrice * surge),
      priceRange: `$${Math.round(basePrice * surge) - 1}-${Math.round(basePrice * surge) + 2}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 4) + 2} min away`,
      capacity: 4,
      category: "economy" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.7 + Math.random() * 0.3,
      eta: Math.floor(Math.random() * 4) + 2,
    },
    {
      id: "uber-comfort",
      provider: "uber" as const,
      serviceName: "Uber Comfort",
      description: "Newer cars, extra space",
      price: Math.round(basePrice * 1.35 * surge),
      priceRange: `$${Math.round(basePrice * 1.25 * surge)}-${Math.round(basePrice * 1.5 * surge)}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 3) + 3} min away`,
      capacity: 4,
      category: "premium" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.8 + Math.random() * 0.2,
      eta: Math.floor(Math.random() * 3) + 3,
    },
  ];
}

function getMockBoltEstimates(distance: number, duration: number) {
  const basePrice = Math.round((distance / 1000) * 3.2 + 4.5);
  const surge = Math.random() > 0.8 ? 1.1 + Math.random() * 0.4 : 1.0; // 20% chance of surge
  
  return [
    {
      id: "bolt-standard",
      provider: "bolt" as const,
      serviceName: "Bolt",
      description: "Fast & affordable",
      price: Math.round(basePrice * surge),
      priceRange: `$${Math.round(basePrice * surge) - 1}-${Math.round(basePrice * surge) + 2}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 4) + 4} min away`,
      capacity: 4,
      category: "economy" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.5 + Math.random() * 0.4,
      eta: Math.floor(Math.random() * 4) + 4,
    },
    {
      id: "bolt-comfort",
      provider: "bolt" as const,
      serviceName: "Bolt Comfort",
      description: "More comfortable rides",
      price: Math.round(basePrice * 1.25 * surge),
      priceRange: `$${Math.round(basePrice * 1.15 * surge)}-${Math.round(basePrice * 1.35 * surge)}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 3) + 5} min away`,
      capacity: 4,
      category: "premium" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.6 + Math.random() * 0.3,
      eta: Math.floor(Math.random() * 3) + 5,
    },
  ];
}

function getMockYangoEstimates(distance: number, duration: number) {
  const basePrice = Math.round((distance / 1000) * 3.0 + 4);
  const surge = Math.random() > 0.85 ? 1.05 + Math.random() * 0.3 : 1.0; // 15% chance of surge
  
  return [
    {
      id: "yango-economy",
      provider: "yango" as const,
      serviceName: "Economy",
      description: "Budget-friendly option",
      price: Math.round(basePrice * surge),
      priceRange: `$${Math.round(basePrice * surge) - 1}-${Math.round(basePrice * surge) + 2}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 5) + 6} min away`,
      capacity: 4,
      category: "economy" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.3 + Math.random() * 0.5,
      eta: Math.floor(Math.random() * 5) + 6,
    },
    {
      id: "yango-comfort",
      provider: "yango" as const,
      serviceName: "Comfort",
      description: "More comfort for your journey",
      price: Math.round(basePrice * 1.3 * surge),
      priceRange: `$${Math.round(basePrice * 1.2 * surge)}-${Math.round(basePrice * 1.4 * surge)}`,
      currency: "USD",
      arrivalTime: `${Math.floor(Math.random() * 4) + 7} min away`,
      capacity: 4,
      category: "premium" as const,
      estimatedDuration: duration,
      distance,
      surge: surge > 1.0 ? surge : undefined,
      rating: 4.4 + Math.random() * 0.4,
      eta: Math.floor(Math.random() * 4) + 7,
    },
  ];
}

function getUberDescription(displayName: string): string {
  const descriptions: Record<string, string> = {
    "UberX": "Affordable everyday rides",
    "UberXL": "Larger vehicles for groups",
    "Uber Comfort": "Newer cars, extra space",
    "UberBLACK": "Premium rides with professional drivers",
    "UberSUV": "Premium SUVs for larger groups",
  };
  
  return descriptions[displayName] || "Ride with Uber";
}

function getUberCategory(displayName: string): "economy" | "premium" | "luxury" {
  if (displayName.includes("BLACK") || displayName.includes("SUV")) {
    return "luxury";
  }
  if (displayName.includes("Comfort") || displayName.includes("XL")) {
    return "premium";
  }
  return "economy";
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
