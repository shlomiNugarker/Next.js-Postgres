import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { schools } from "./School";

export const students = pgTable("Student", {
  id: serial("id").primaryKey(),
  school_id: integer("school_id").references(() => schools.id), // שימוש במפתח זר מטבלת schools
  name: varchar("name", { length: 255 }),
  grade: varchar("grade", { length: 10 }),
});
