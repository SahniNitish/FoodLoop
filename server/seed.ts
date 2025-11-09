import { db } from "./db";
import { users, foodListings } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database with demo data...");

  // Clear existing data
  await db.delete(foodListings);
  await db.delete(users);

  // Create demo users
  const demoUsers = await db.insert(users).values([
    {
      username: "hope_food_bank",
      password: "demo123",
    },
    {
      username: "green_grocers_nyc",
      password: "demo123",
    },
    {
      username: "sarah_baker",
      password: "demo123",
    },
    {
      username: "marios_restaurant",
      password: "demo123",
    },
  ]).returning();

  console.log(`✅ Created ${demoUsers.length} demo users`);

  // NYC locations for diverse map coverage
  const locations = [
    { name: "Hope Food Bank - Manhattan", lat: 40.7580, lng: -73.9855, address: "456 W 42nd St, Manhattan" },
    { name: "Green Grocers - Brooklyn", lat: 40.6782, lng: -73.9442, address: "789 Bedford Ave, Brooklyn" },
    { name: "Community Kitchen - Queens", lat: 40.7282, lng: -73.7949, address: "321 Main St, Flushing" },
    { name: "Mario's Italian Restaurant - Bronx", lat: 40.8448, lng: -73.8648, address: "567 Arthur Ave, Bronx" },
    { name: "Fresh Start Market - Staten Island", lat: 40.5795, lng: -74.1502, address: "234 Bay St, Staten Island" },
    { name: "Upper East Side Bakery", lat: 40.7736, lng: -73.9566, address: "890 Lexington Ave, Manhattan" },
    { name: "Downtown Brooklyn Cafe", lat: 40.6947, lng: -73.9897, address: "123 Flatbush Ave, Brooklyn" },
    { name: "Harlem Community Center", lat: 40.8116, lng: -73.9465, address: "456 Malcolm X Blvd, Manhattan" },
  ];

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Create diverse food listings
  const listings = [];

  // NGO - Hope Food Bank listings
  listings.push({
    title: "Fresh Organic Vegetables",
    description: "Assorted fresh vegetables including carrots, broccoli, lettuce, and tomatoes. Donated from local farms, all organic and in excellent condition. Perfect for families or community meals.",
    quantity: "50 lbs",
    category: "produce",
    location: locations[0].address,
    latitude: locations[0].lat,
    longitude: locations[0].lng,
    pickupTimeStart: new Date(tomorrow.setHours(9, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(17, 0, 0)),
    freshnessScore: 95,
    qualityScore: 95,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[0].id,
    cost: "Free",
  });

  listings.push({
    title: "Whole Wheat Bread Loaves",
    description: "20 loaves of fresh whole wheat bread from local bakery donations. Baked this morning, soft and nutritious. Great for sandwiches or toast.",
    quantity: "20 loaves",
    category: "bakery",
    location: locations[0].address,
    latitude: locations[0].lat,
    longitude: locations[0].lng,
    pickupTimeStart: new Date(tomorrow.setHours(10, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(18, 0, 0)),
    freshnessScore: 90,
    qualityScore: 92,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[0].id,
    cost: "Free",
  });

  // Green Grocers - Brooklyn
  listings.push({
    title: "Mixed Fruit Basket",
    description: "Beautiful assortment of ripe fruits including apples, bananas, oranges, and pears. Slightly overripe but still delicious and nutritious. Perfect for smoothies or fresh eating.",
    quantity: "30 lbs",
    category: "produce",
    location: locations[1].address,
    latitude: locations[1].lat,
    longitude: locations[1].lng,
    pickupTimeStart: new Date(tomorrow.setHours(15, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(20, 0, 0)),
    freshnessScore: 80,
    qualityScore: 85,
    defectsDetected: ["minor bruising"],
    aiAnalysis: null,
    donorId: demoUsers[1].id,
    cost: "$5",
  });

  listings.push({
    title: "Fresh Salad Greens",
    description: "Premium mixed greens including romaine, spinach, and arugula. Harvested today from our vertical farm. Crisp, clean, and ready to eat.",
    quantity: "15 bags",
    category: "produce",
    location: locations[1].address,
    latitude: locations[1].lat,
    longitude: locations[1].lng,
    pickupTimeStart: new Date(tomorrow.setHours(14, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(19, 0, 0)),
    freshnessScore: 98,
    qualityScore: 98,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[1].id,
    cost: "$3",
  });

  // Sarah's Bakery
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  listings.push({
    title: "Artisan Sourdough Bread",
    description: "5 loaves of handcrafted sourdough bread. Made with organic flour and traditional fermentation. Slightly day-old but perfect for toasting or making croutons.",
    quantity: "5 loaves",
    category: "bakery",
    location: locations[5].address,
    latitude: locations[5].lat,
    longitude: locations[5].lng,
    pickupTimeStart: new Date(dayAfter.setHours(16, 0, 0)),
    pickupTimeEnd: new Date(dayAfter.setHours(21, 0, 0)),
    freshnessScore: 85,
    qualityScore: 90,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[2].id,
    cost: "$2 per loaf",
  });

  listings.push({
    title: "Assorted Pastries",
    description: "Mix of croissants, danishes, and muffins from this morning's batch. All made with butter and fresh ingredients. Great for breakfast or afternoon snack.",
    quantity: "24 pieces",
    category: "bakery",
    location: locations[5].address,
    latitude: locations[5].lat,
    longitude: locations[5].lng,
    pickupTimeStart: new Date(dayAfter.setHours(17, 0, 0)),
    pickupTimeEnd: new Date(dayAfter.setHours(21, 0, 0)),
    freshnessScore: 88,
    qualityScore: 92,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[2].id,
    cost: "$10 for all",
  });

  // Mario's Restaurant
  const today = new Date();
  listings.push({
    title: "Prepared Pasta Dishes",
    description: "10 servings of fresh pasta with marinara sauce. Made today with organic ingredients. Fully cooked and ready to reheat. Contains: tomatoes, basil, olive oil, pasta.",
    quantity: "10 servings",
    category: "prepared",
    location: locations[3].address,
    latitude: locations[3].lat,
    longitude: locations[3].lng,
    pickupTimeStart: new Date(today.setHours(20, 0, 0)),
    pickupTimeEnd: new Date(today.setHours(22, 0, 0)),
    freshnessScore: 92,
    qualityScore: 95,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[3].id,
    cost: "Free",
  });

  listings.push({
    title: "Fresh Mozzarella Cheese",
    description: "Homemade mozzarella cheese, made this afternoon. Soft, creamy, and perfect for caprese salad or pizza. Must be picked up today for best quality.",
    quantity: "3 lbs",
    category: "dairy",
    location: locations[3].address,
    latitude: locations[3].lat,
    longitude: locations[3].lng,
    pickupTimeStart: new Date(today.setHours(19, 30, 0)),
    pickupTimeEnd: new Date(today.setHours(22, 0, 0)),
    freshnessScore: 96,
    qualityScore: 98,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[3].id,
    cost: "$8",
  });

  // Additional listings for map diversity
  listings.push({
    title: "Canned Goods Variety Pack",
    description: "Assorted canned vegetables, beans, and soups. All unexpired with best-by dates 6+ months away. Great for food pantries or emergency supplies.",
    quantity: "40 cans",
    category: "packaged",
    location: locations[2].address,
    latitude: locations[2].lat,
    longitude: locations[2].lng,
    pickupTimeStart: new Date(tomorrow.setHours(11, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(16, 0, 0)),
    freshnessScore: 100,
    qualityScore: 95,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[0].id,
    cost: "Free",
  });

  listings.push({
    title: "Fresh Eggs - Cage Free",
    description: "5 dozen fresh cage-free eggs from local farm. Gathered this week, stored properly at proper temperature. Perfect for cooking or baking.",
    quantity: "60 eggs",
    category: "dairy",
    location: locations[4].address,
    latitude: locations[4].lat,
    longitude: locations[4].lng,
    pickupTimeStart: new Date(tomorrow.setHours(8, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(14, 0, 0)),
    freshnessScore: 94,
    qualityScore: 96,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[1].id,
    cost: "$15",
  });

  listings.push({
    title: "Rice and Pasta Mix",
    description: "Bulk dry goods including white rice, brown rice, and various pasta shapes. All sealed and unexpired. Perfect for large families or community kitchens.",
    quantity: "25 lbs total",
    category: "packaged",
    location: locations[6].address,
    latitude: locations[6].lat,
    longitude: locations[6].lng,
    pickupTimeStart: new Date(tomorrow.setHours(12, 0, 0)),
    pickupTimeEnd: new Date(tomorrow.setHours(18, 0, 0)),
    freshnessScore: 100,
    qualityScore: 100,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[0].id,
    cost: "Free",
  });

  listings.push({
    title: "Prepared Vegetarian Meals",
    description: "8 portions of vegetarian curry with rice. Made with chickpeas, vegetables, and aromatic spices. Fully cooked, ready to reheat. Vegan-friendly.",
    quantity: "8 servings",
    category: "prepared",
    location: locations[7].address,
    latitude: locations[7].lat,
    longitude: locations[7].lng,
    pickupTimeStart: new Date(today.setHours(18, 0, 0)),
    pickupTimeEnd: new Date(today.setHours(21, 0, 0)),
    freshnessScore: 90,
    qualityScore: 93,
    defectsDetected: [],
    aiAnalysis: null,
    donorId: demoUsers[3].id,
    cost: "Free",
  });

  await db.insert(foodListings).values(listings);

  console.log(`✅ Created ${listings.length} demo food listings`);
  console.log("\n📍 Demo Data Summary:");
  console.log("  - Hope Food Bank (NGO) - 4 listings");
  console.log("  - Green Grocers NYC - 3 listings");
  console.log("  - Sarah Baker - 2 listings");
  console.log("  - Mario's Restaurant - 3 listings");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\nDemo Credentials:");
  console.log("  - hope_food_bank / demo123");
  console.log("  - green_grocers_nyc / demo123");
  console.log("  - sarah_baker / demo123");
  console.log("  - marios_restaurant / demo123");
}

seed()
  .then(() => {
    console.log("✅ Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
