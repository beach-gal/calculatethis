import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calculator usage tracking table
export const calculatorUsage = pgTable("calculator_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  calculatorName: varchar("calculator_name").notNull(),
  calculatorType: varchar("calculator_type").notNull(),
  inputs: jsonb("inputs"),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Calculator definitions table
export const calculators = pgTable("calculators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  category: varchar("category").notNull(),
  description: text("description"),
  formula: text("formula"),
  active: integer("active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculatorUsageSchema = createInsertSchema(calculatorUsage).omit({
  id: true,
  createdAt: true,
});

export const insertCalculatorSchema = createInsertSchema(calculators).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type CalculatorUsage = typeof calculatorUsage.$inferSelect;
export type InsertCalculatorUsage = z.infer<typeof insertCalculatorUsageSchema>;
export type Calculator = typeof calculators.$inferSelect;
export type InsertCalculator = z.infer<typeof insertCalculatorSchema>;
