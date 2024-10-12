import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { messagesData, offersData, tradesData, usersData } from "./data";
import { users } from "@/app/models/User";
import { offers } from "@/app/models/Offer";
import { messages } from "@/app/models/Message";
import { trades } from "@/app/models/Trade";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client: postgres.Sql<{}>;
let db: PostgresJsDatabase<Record<string, any>>;

initialize();

export async function initialize() {
  try {
    await connectToDatabase();
    await ensureAllTablesExists();
    // await insertSampleData();
    console.log("All tables ensured.");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

async function connectToDatabase() {
  try {
    client = postgres(`${process.env.POSTGRES_URL!}?sslmode=disable`);
    db = drizzle(client);
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new Error("Unable to connect to the database");
  }
}

export async function getUser(email: string) {
  try {
    const users = await ensureUsersTableExists();
    return await db.select().from(users).where(eq(users.email, email));
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function createUser(
  email: string,
  password: string,
  username: string,
  profile_image_url?: string
) {
  try {
    const users = await ensureUsersTableExists();
    let salt = genSaltSync(10);
    let hash = hashSync(password, salt);

    return await db.insert(users).values({ email, password: hash, username });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function ensureAllTablesExists() {
  await ensureUsersTableExists();
  await ensureOffersTableExists();
  await ensureTradesTableExists();
  await ensureMessagesTableExists();
}

async function ensureUsersTableExists() {
  const result = await client`
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  );`;

  if (!result[0].exists) {
    await client`
    CREATE TABLE "users" (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) NOT NULL,
      email VARCHAR(64) NOT NULL UNIQUE,
      password VARCHAR(64) NOT NULL,
      profile_image_url TEXT, 
      created_at TIMESTAMP DEFAULT NOW()  
    );`;
  }

  const table = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 64 }).notNull(),
    email: varchar("email", { length: 64 }).notNull().unique(),
    password: varchar("password", { length: 64 }).notNull(),
    profile_image_url: varchar("profile_image_url"),
    created_at: varchar("created_at", { length: 64 }).default("now()"),
  });

  return table;
}

async function ensureOffersTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'offers'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "offers" (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,  
        status VARCHAR(20) DEFAULT 'available',
        image_url TEXT,  
        estimated_value DECIMAL(10, 2),  -- Added 'estimated_value' column with precision and scale
        created_at TIMESTAMP DEFAULT NOW()  
      );`;
  }

  const table = pgTable("offers", {
    offer_id: serial("offer_id").primaryKey(),
    user_id: integer("user_id").references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).default("זמין"),
    image_url: varchar("image_url"),
    created_at: varchar("created_at", { length: 64 }).default("now()"),
  });

  return table;
}

async function ensureTradesTableExists() {
  const tradesResult = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'trades'
    );`;

  if (!tradesResult[0].exists) {
    await client`
      CREATE TABLE "trades" (
        id SERIAL PRIMARY KEY,
        offer_id_1 INT REFERENCES offers(id),
        offer_id_2 INT REFERENCES offers(id),
        status VARCHAR(20) DEFAULT 'in_process',  
        created_at TIMESTAMP DEFAULT NOW()  
      );`;
    console.log("Trades table created.");
  } else {
    console.log("Trades table already exists.");
  }
}

async function ensureMessagesTableExists() {
  const messagesResult = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'messages'
    );`;

  if (!messagesResult[0].exists) {
    await client`
      CREATE TABLE "messages" (
        id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES users(id),  
        recipient_id INT REFERENCES users(id),  
        content TEXT NOT NULL,  
        sent_at TIMESTAMP DEFAULT NOW()  
      );`;
    console.log("Messages table created.");
  } else {
    console.log("Messages table already exists.");
  }
}

async function insertSampleData() {
  console.log("insert");

  await insertUsers();
  await insertOffers();
  await insertMessages();
  await insertTrades();
}

async function insertUsers() {
  for (const user of usersData) {
    await db.insert(users).values({
      username: user.username,
      email: user.email,
      password: user.password, // You should hash passwords in a real scenario!
      profile_image_url: user.profile_image_url,
    });
  }
  console.log("Users inserted.");
}

async function insertOffers() {
  for (const offer of offersData) {
    await db.insert(offers).values({
      user_id: offer.user_id, // Ensure this is coming from offersData
      title: offer.title,
      description: offer.description,
      category: offer.category,
      status: offer.status,
      image_url: offer.image_url,
      estimated_value: offer.estimated_value.toString(), // Cast number to string
      // No need to include created_at, PostgreSQL will set it automatically
    });
  }
  console.log("Offers inserted.");
}

async function insertMessages() {
  try {
    for (const message of messagesData) {
      await db.insert(messages).values({
        sender_id: message.sender_id,
        recipient_id: message.recipient_id,
        content: message.content,
        sent_at: new Date(message.sent_at).toISOString(),
      });
    }
    console.log("Messages inserted successfully!");
  } catch (error) {
    console.error("Error inserting messages:", error);
  }
}

async function insertTrades() {
  try {
    for (const trade of tradesData) {
      await db.insert(trades).values({
        offer_id_1: trade.offer_id_1,
        offer_id_2: trade.offer_id_2,
        status: trade.status,
        created_at: new Date(trade.created_at).toISOString(),
      });
    }
    console.log("Trades inserted successfully!");
  } catch (error) {
    console.error("Error inserting trades:", error);
  }
}
