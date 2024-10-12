import { pgTable, serial, integer, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./User"; // assuming you have a User model

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(), // unique identifier for the message
  sender_id: integer("sender_id").references(() => users.id), // sender's user_id
  recipient_id: integer("recipient_id").references(() => users.id), // recipient's user_id
  content: text("content").notNull(), // message content
  sent_at: varchar("sent_at", { length: 255 }).default("now()"), // message sent date
});
