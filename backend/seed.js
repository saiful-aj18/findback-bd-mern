require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Item = require("./models/Item");

const run = async () => {
  await connectDB();
  console.log("Seeding database...");

  await User.deleteMany({});
  await Item.deleteMany({});

  const admin = await User.create({
    fullName: "Admin User",
    email: "admin@findbackbd.com",
    phone: "+8801700000000",
    password: "admin123",
    role: "admin",
  });

  const rifat = await User.create({
    fullName: "Rifat Hasan",
    email: "rifat@example.com",
    phone: "+8801712345678",
    password: "password123",
    rating: 4.8,
    ratingCount: 12,
  });

  const arafat = await User.create({
    fullName: "Arafat Rahman",
    email: "arafat@example.com",
    phone: "+8801812345678",
    password: "password123",
    rating: 4.5,
    ratingCount: 6,
  });

  await Item.create([
    {
      user: rifat._id,
      type: "found",
      category: "Mobile",
      name: "iPhone 13",
      description: "Black iPhone 13 with a blue case. Found near Dhanmondi 27 bus stop.",
      location: { address: "Dhanmondi, Dhaka", lat: 23.7461, lng: 90.3742 },
      status: "Open",
    },
    {
      user: arafat._id,
      type: "lost",
      category: "Bag",
      name: "Black Backpack",
      description: "Lost near University campus, has a laptop and notebooks inside.",
      location: { address: "University Area, Dhaka", lat: 23.7275, lng: 90.3925 },
      status: "Open",
    },
    {
      user: rifat._id,
      type: "lost",
      category: "Wallet",
      name: "Blue Wallet",
      description: "Lost near Gulshan, contains NID card and some cash.",
      location: { address: "Gulshan, Dhaka", lat: 23.7925, lng: 90.4078 },
      status: "Open",
    },
    {
      user: arafat._id,
      type: "found",
      category: "Keys",
      name: "Keys",
      description: "Found a bunch of keys with a red keychain near Mirpur.",
      location: { address: "Mirpur, Dhaka", lat: 23.8223, lng: 90.3654 },
      status: "Open",
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: admin@findbackbd.com / admin123");
  console.log("User login: rifat@example.com / password123");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
