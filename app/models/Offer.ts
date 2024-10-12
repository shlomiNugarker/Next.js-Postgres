import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./User";

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id), // Reference to users table
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Product or Service
  image_url: varchar("image_url"), // Optional URL for image
  status: varchar("status", { length: 20 }).default("available"), // Available/Exchanged
  estimated_value: decimal("estimated_value", { precision: 10, scale: 2 }), // Estimated value of the offer
  created_at: timestamp("created_at").defaultNow(), // Timestamp for creation date, defaults to NOW()
});
