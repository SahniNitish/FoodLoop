import { type User, type InsertUser, type FoodListing, type InsertFoodListing, type SensorData, type InsertSensorData, users, foodListings, sensorData } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Food Listings
  getFoodListing(id: string): Promise<FoodListing | undefined>;
  getAllFoodListings(): Promise<FoodListing[]>;
  getAvailableFoodListings(): Promise<FoodListing[]>;
  createFoodListing(listing: InsertFoodListing): Promise<FoodListing>;
  updateFoodListing(id: string, listing: Partial<FoodListing>): Promise<FoodListing | undefined>;
  deleteFoodListing(id: string): Promise<boolean>;
  
  // Sensor Data
  getSensorDataForListing(listingId: string): Promise<SensorData[]>;
  createSensorData(data: InsertSensorData): Promise<SensorData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private foodListings: Map<string, FoodListing>;
  private sensorData: Map<string, SensorData>;

  constructor() {
    this.users = new Map();
    this.foodListings = new Map();
    this.sensorData = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFoodListing(id: string): Promise<FoodListing | undefined> {
    return this.foodListings.get(id);
  }

  async getAllFoodListings(): Promise<FoodListing[]> {
    return Array.from(this.foodListings.values());
  }

  async getAvailableFoodListings(): Promise<FoodListing[]> {
    return Array.from(this.foodListings.values()).filter(
      listing => listing.status === "available"
    );
  }

  async createFoodListing(insertListing: InsertFoodListing): Promise<FoodListing> {
    const id = randomUUID();
    const listing: FoodListing = {
      ...insertListing,
      imageUrl: insertListing.imageUrl ?? null,
      defectsDetected: insertListing.defectsDetected ?? null,
      id,
      status: "available",
      createdAt: new Date(),
    };
    this.foodListings.set(id, listing);
    return listing;
  }

  async updateFoodListing(id: string, updates: Partial<FoodListing>): Promise<FoodListing | undefined> {
    const existing = this.foodListings.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.foodListings.set(id, updated);
    return updated;
  }

  async deleteFoodListing(id: string): Promise<boolean> {
    return this.foodListings.delete(id);
  }

  async getSensorDataForListing(listingId: string): Promise<SensorData[]> {
    return Array.from(this.sensorData.values()).filter(
      data => data.listingId === listingId
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const id = randomUUID();
    const data: SensorData = {
      ...insertData,
      id,
      timestamp: new Date(),
    };
    this.sensorData.set(id, data);
    return data;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getFoodListing(id: string): Promise<FoodListing | undefined> {
    const result = await db.select().from(foodListings).where(eq(foodListings.id, id)).limit(1);
    return result[0];
  }

  async getAllFoodListings(): Promise<FoodListing[]> {
    return await db.select().from(foodListings);
  }

  async getAvailableFoodListings(): Promise<FoodListing[]> {
    return await db.select().from(foodListings).where(eq(foodListings.status, "available"));
  }

  async createFoodListing(insertListing: InsertFoodListing): Promise<FoodListing> {
    const result = await db.insert(foodListings).values(insertListing).returning();
    return result[0];
  }

  async updateFoodListing(id: string, updates: Partial<FoodListing>): Promise<FoodListing | undefined> {
    const result = await db.update(foodListings)
      .set(updates)
      .where(eq(foodListings.id, id))
      .returning();
    return result[0];
  }

  async deleteFoodListing(id: string): Promise<boolean> {
    const result = await db.delete(foodListings).where(eq(foodListings.id, id)).returning();
    return result.length > 0;
  }

  async getSensorDataForListing(listingId: string): Promise<SensorData[]> {
    return await db.select().from(sensorData)
      .where(eq(sensorData.listingId, listingId))
      .orderBy(sensorData.timestamp);
  }

  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const result = await db.insert(sensorData).values(insertData).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
