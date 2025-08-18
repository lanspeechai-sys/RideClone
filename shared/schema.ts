import { z } from "zod";

export const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
});

export const rideEstimateSchema = z.object({
  id: z.string(),
  provider: z.enum(["uber", "bolt", "yango"]),
  serviceName: z.string(),
  description: z.string(),
  price: z.number(),
  priceRange: z.string(),
  currency: z.string().default("USD"),
  arrivalTime: z.string(),
  capacity: z.number(),
  category: z.enum(["economy", "premium", "luxury"]).default("economy"),
  estimatedDuration: z.number(), // in minutes
  distance: z.number(), // in meters
  surge: z.number().optional(), // surge multiplier
  rating: z.number().optional(), // driver rating
  eta: z.number().optional(), // estimated time to pickup in minutes
});

export const tripRequestSchema = z.object({
  pickup: locationSchema,
  dropoff: locationSchema,
});

export const rideComparisonResponseSchema = z.object({
  tripDistance: z.number(),
  tripDuration: z.number(),
  estimates: z.array(rideEstimateSchema),
});

// Recent locations schema
export const recentLocationSchema = z.object({
  id: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.enum(["home", "work", "recent"]).default("recent"),
  lastUsed: z.date(),
});

// Booking request schema
export const bookingRequestSchema = z.object({
  rideId: z.string(),
  pickup: locationSchema,
  dropoff: locationSchema,
  paymentMethod: z.string().default("card"),
});

export type Location = z.infer<typeof locationSchema>;
export type RideEstimate = z.infer<typeof rideEstimateSchema>;
export type TripRequest = z.infer<typeof tripRequestSchema>;
export type RideComparisonResponse = z.infer<typeof rideComparisonResponseSchema>;
export type RecentLocation = z.infer<typeof recentLocationSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
