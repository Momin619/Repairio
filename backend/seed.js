import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import RepairItem from "./model/repairItem.js";
import crypto from "crypto";

const MONGO_URI =
  "mongodb+srv://dbUser:dbUserPassword@repairio.dwekq6b.mongodb.net/test?retryWrites=true&w=majority";

const SELLER_ID = "6984de96298719b4279955a3";

const YEAR = 2026;
const START_MONTH = 0; // January (0-based)
const TOTAL_MONTHS = 6; // Jan → Jun

async function seed() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Connected to DB:", conn.connection.name);

    // Optional: clear old data

    const items = [];

    for (let m = 0; m < TOTAL_MONTHS; m++) {
      const month = START_MONTH + m;
      const daysInMonth = new Date(YEAR, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const createdAt = new Date(
          YEAR,
          month,
          day,
          faker.number.int({ min: 8, max: 20 }),
          faker.number.int({ min: 0, max: 59 }),
        );

        const completedAt = new Date(
          createdAt.getTime() +
            faker.number.int({ min: 1, max: 5 }) * 60 * 60 * 1000,
        );

        items.push({
          itemName: faker.commerce.productName(),
          problem: faker.lorem.sentence(),
          repairCost: faker.number.int({ min: 500, max: 15000 }),
          customer: {
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            phone: faker.phone.number("03#########"),
          },
          images: [],
          status: "completed",
          createdAt,
          completedAt,
          sellerId: new mongoose.Types.ObjectId(SELLER_ID),
          trackingToken: crypto.randomBytes(16).toString("hex"), // add unique token here
        });
      }
    }

    await RepairItem.insertMany(items);
    console.log(`Inserted ${items.length} repair items`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seed();
// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
// import RepairItem from "./model/repairItem.js";
// import crypto from "crypto";

// const MONGO_URI =
//   "mongodb+srv://dbUser:dbUserPassword@repairio.dwekq6b.mongodb.net/test?retryWrites=true&w=majority";

// const SELLER_ID = "6984de96298719b4279955a3";

// // Total number of items you want to seed
// const TOTAL_ITEMS = 20; // <-- change this to whatever small number you want

// async function seed() {
//   try {
//     const conn = await mongoose.connect(MONGO_URI);
//     console.log("Connected to DB:", conn.connection.name);

//     // Optional: clear old data
//     const items = [];

//     for (let i = 0; i < TOTAL_ITEMS; i++) {
//       const createdAt = faker.date.between({
//         from: new Date(2026, 0, 1),
//         to: new Date(2026, 5, 30),
//       });

//       const completedAt = new Date(
//         createdAt.getTime() +
//           faker.number.int({ min: 1, max: 5 }) * 60 * 60 * 1000,
//       );

//       items.push({
//         itemName: faker.commerce.productName(),
//         problem: faker.lorem.sentence(),
//         repairCost: faker.number.int({ min: 500, max: 15000 }),
//         customer: {
//           name: `${faker.person.firstName()} ${faker.person.lastName()}`,
//           phone: faker.phone.number("03#########"),
//         },
//         images: [], // add URLs if you want
//         status: "in-repair",
//         createdAt,
//         completedAt,
//         sellerId: new mongoose.Types.ObjectId(SELLER_ID),
//         trackingToken: crypto.randomBytes(16).toString("hex"), // unique token
//       });
//     }

//     await RepairItem.insertMany(items);
//     console.log(`Inserted ${items.length} repair items`);

//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//   } catch (err) {
//     console.error("Error seeding data:", err);
//     process.exit(1);
//   }
// }

// seed();
