import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { students } from "./Student";

export const grades = pgTable("Grade", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id").references(() => students.id),
  subject: varchar("subject", { length: 255 }),
  score: integer("score"),
  exam_date: varchar("exam_date", { length: 255 }),
});
