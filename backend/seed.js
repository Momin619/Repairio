import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import RepairItem from "./model/repairItem.js"; // adjust path

const MONGO_URI =
  "mongodb+srv://dbUser:dbUserPassword@repairio.dwekq6b.mongodb.net/test?retryWrites=true&w=majority";
const conn = await mongoose.connect(MONGO_URI);
console.log("Connected to DB:", conn.connection.name); // logs Repairio or test

const SELLER_ID = "69770d2e0db4aefd95ce5aad";
const NUM_ITEMS = 100;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const items = [];

    for (let i = 0; i < NUM_ITEMS; i++) {
      const createdAt = faker.date.past({ years: 0.5 }); // last 6 months
      const completedAt = faker.date.between({
        from: createdAt,
        to: new Date(),
      });

      items.push({
        itemName: faker.commerce.productName(),
        problem: faker.lorem.sentence(),
        customer: {
          name: `${faker.person.firstName()} ${faker.person.lastName()}`,
          phone: faker.phone.number("03#########"),
        },
        images: [],
        status: "completed",
        createdAt,
        completedAt,
        sellerId: new mongoose.Types.ObjectId(SELLER_ID), // ✅ fixed
      });
    }

    await RepairItem.insertMany(items);
    console.log(`Inserted ${NUM_ITEMS} repair items`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

seed();
