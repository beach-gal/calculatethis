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

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // bcrypt hashed password
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
  fields: jsonb("fields"),
  resultLabel: text("result_label"),
  resultUnit: text("result_unit"),
  creatorName: varchar("creator_name"),
  active: integer("active").default(1),
  featured: integer("featured").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ad codes table for ad rotation management
export const adCodes = pgTable("ad_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(), // e.g., 'leaderboard', 'sidebar', 'rectangle'
  code: text("code").notNull(),
  active: integer("active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings table for site configuration
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: integer("used").default(0),
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

export const insertAdCodeSchema = createInsertSchema(adCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type CalculatorUsage = typeof calculatorUsage.$inferSelect;
export type InsertCalculatorUsage = z.infer<typeof insertCalculatorUsageSchema>;
export type Calculator = typeof calculators.$inferSelect;
export type InsertCalculator = z.infer<typeof insertCalculatorSchema>;
export type AdCode = typeof adCodes.$inferSelect;
export type InsertAdCode = z.infer<typeof insertAdCodeSchema>;
export type AdminUser = typeof adminUsers.$inferSelect & {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
