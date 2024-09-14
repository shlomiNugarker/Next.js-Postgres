import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const schools = pgTable("School", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  city: varchar("city", { length: 255 }),
});
