import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

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

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: varchar("username").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User authentication schemas
export const userLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userSignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users);
export const upsertUserSchema = insertUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;
export type Location = z.infer<typeof locationSchema>;
export type RideEstimate = z.infer<typeof rideEstimateSchema>;
export type TripRequest = z.infer<typeof tripRequestSchema>;
export type RideComparisonResponse = z.infer<typeof rideComparisonResponseSchema>;
export type RecentLocation = z.infer<typeof recentLocationSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
