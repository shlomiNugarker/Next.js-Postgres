import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { offers } from "./Offer"; // assuming you have an Offer model

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(), // unique identifier for the trade
  offer_id_1: integer("offer_id_1").references(() => offers.id), // first offer identifier
  offer_id_2: integer("offer_id_2").references(() => offers.id), // second offer identifier
  status: varchar("status", { length: 20 }).default("in_process"), // trade status (e.g., "completed", "in process", "pending")
  created_at: varchar("created_at", { length: 255 }).default("now()"), // trade creation date
});
