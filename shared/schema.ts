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

export type Location = z.infer<typeof locationSchema>;
export type RideEstimate = z.infer<typeof rideEstimateSchema>;
export type TripRequest = z.infer<typeof tripRequestSchema>;
export type RideComparisonResponse = z.infer<typeof rideComparisonResponseSchema>;
