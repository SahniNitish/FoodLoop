import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const foodListings = pgTable("food_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  pickupTimeStart: timestamp("pickup_time_start").notNull(),
  pickupTimeEnd: timestamp("pickup_time_end").notNull(),
  freshnessScore: integer("freshness_score").notNull(),
  qualityScore: integer("quality_score").notNull(),
  defectsDetected: text("defects_detected").array(),
  aiAnalysis: jsonb("ai_analysis"),
  status: text("status").notNull().default("available"),
  donorId: varchar("donor_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const sensorData = pgTable("sensor_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFoodListingSchema = createInsertSchema(foodListings).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FoodListing = typeof foodListings.$inferSelect;
export type InsertFoodListing = z.infer<typeof insertFoodListingSchema>;
export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
