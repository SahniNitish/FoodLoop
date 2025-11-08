import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFoodListingSchema, insertSensorDataSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Food Listings Routes
  
  // Get all available food listings
  app.get("/api/food-listings", async (req, res) => {
    try {
      const listings = await storage.getAvailableFoodListings();
      res.json(listings);
    } catch (error) {
      console.error("Error fetching food listings:", error);
      res.status(500).json({ error: "Failed to fetch food listings" });
    }
  });

  // Get single food listing
  app.get("/api/food-listings/:id", async (req, res) => {
    try {
      const listing = await storage.getFoodListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Food listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error fetching food listing:", error);
      res.status(500).json({ error: "Failed to fetch food listing" });
    }
  });

  // Create new food listing with image upload
  app.post("/api/food-listings", upload.single("image"), async (req, res) => {
    try {
      const data = {
        ...req.body,
        pickupTimeStart: new Date(req.body.pickupTimeStart),
        pickupTimeEnd: new Date(req.body.pickupTimeEnd),
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        freshnessScore: parseInt(req.body.freshnessScore) || 85,
        qualityScore: parseInt(req.body.qualityScore) || 85,
        defectsDetected: req.body.defectsDetected ? JSON.parse(req.body.defectsDetected) : [],
        aiAnalysis: req.body.aiAnalysis ? JSON.parse(req.body.aiAnalysis) : null,
      };

      if (req.file) {
        data.imageUrl = `/uploads/${req.file.filename}`;
      }

      const validated = insertFoodListingSchema.parse(data);
      const listing = await storage.createFoodListing(validated);
      res.status(201).json(listing);
    } catch (error: any) {
      console.error("Error creating food listing:", error);
      res.status(400).json({ error: error.message || "Failed to create food listing" });
    }
  });

  // Update food listing (e.g., claim food)
  app.patch("/api/food-listings/:id", async (req, res) => {
    try {
      // Only allow updating specific fields to prevent uncontrolled updates
      const allowedUpdates = ["status"];
      const updates: any = {};
      
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      const updated = await storage.updateFoodListing(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Food listing not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating food listing:", error);
      res.status(500).json({ error: "Failed to update food listing" });
    }
  });

  // Delete food listing
  app.delete("/api/food-listings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFoodListing(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Food listing not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting food listing:", error);
      res.status(500).json({ error: "Failed to delete food listing" });
    }
  });

  // Sensor Data Routes
  
  // Get sensor data for a listing
  app.get("/api/sensor-data/:listingId", async (req, res) => {
    try {
      const data = await storage.getSensorDataForListing(req.params.listingId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      res.status(500).json({ error: "Failed to fetch sensor data" });
    }
  });

  // Create sensor data reading
  app.post("/api/sensor-data", async (req, res) => {
    try {
      const validated = insertSensorDataSchema.parse(req.body);
      const data = await storage.createSensorData(validated);
      res.status(201).json(data);
    } catch (error: any) {
      console.error("Error creating sensor data:", error);
      res.status(400).json({ error: error.message || "Failed to create sensor data" });
    }
  });

  // Serve uploaded images
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  }));

  const httpServer = createServer(app);

  return httpServer;
}
