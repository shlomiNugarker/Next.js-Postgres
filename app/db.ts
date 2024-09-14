import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { schools } from "models/School";
import { students } from "models/Student";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client: postgres.Sql<{}>;
let db: PostgresJsDatabase<Record<string, never>>;

initialize();

async function initialize() {
  try {
    await connectToDatabase();
    await ensureAllTablesExists();
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

export async function createUser(email: string, password: string) {
  try {
    const users = await ensureUsersTableExists();
    let salt = genSaltSync(10);
    let hash = hashSync(password, salt);

    return await db.insert(users).values({ email, password: hash });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function ensureAllTablesExists() {
  await ensureUsersTableExists();
  await ensureSchoolsTableExists();
  await ensureStudentsTableExists();
  await ensureGradesTableExists();
}

async function ensureUsersTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(64),
        password VARCHAR(64)
      );`;
  }

  const table = pgTable("User", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 64 }),
    password: varchar("password", { length: 64 }),
  });

  return table;
}

async function ensureSchoolsTableExists() {
  try {
    const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'School'
      );`;

    if (!result[0].exists) {
      await client`
      CREATE TABLE "School" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL
        );`;
    }

    const table = pgTable("School", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }),
      city: varchar("city", { length: 255 }),
    });

    return table;
  } catch (error) {
    console.error("Error creating School table:", error);
  }
}

async function ensureStudentsTableExists() {
  try {
    const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Student'
    );`;

    if (!result[0].exists) {
      await client`
      CREATE TABLE "Student" (
        id SERIAL PRIMARY KEY,
        school_id INT REFERENCES "School"(id),
        name VARCHAR(255),
        grade VARCHAR(10)
      );`;
    }

    const table = pgTable("Student", {
      id: serial("id").primaryKey(),
      school_id: integer("school_id").references(() => schools.id),
      name: varchar("name", { length: 255 }),
      grade: varchar("grade", { length: 10 }),
    });

    return table;
  } catch (error) {
    console.error("Error creating Student table:", error);
  }
}

async function ensureGradesTableExists() {
  try {
    const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Grade'
    );`;

    if (!result[0].exists) {
      await client`
      CREATE TABLE "Grade" (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES "Student"(id),
        subject VARCHAR(255),
        score INT,
        exam_date DATE
      );`;
    }

    const table = pgTable("Grade", {
      id: serial("id").primaryKey(),
      student_id: integer("student_id").references(() => students.id),
      subject: varchar("subject", { length: 255 }),
      score: integer("score"),
      exam_date: varchar("exam_date", { length: 255 }),
    });

    return table;
  } catch (error) {
    console.error("Error creating Grade table:", error);
  }
}
