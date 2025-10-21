import {
  users,
  calculatorUsage,
  calculators,
  adCodes,
  adminUsers,
  settings,
  type User,
  type UpsertUser,
  type CalculatorUsage,
  type InsertCalculatorUsage,
  type Calculator,
  type InsertCalculator,
  type AdCode,
  type InsertAdCode,
  type AdminUser,
  type InsertAdminUser,
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Calculator operations
  getCalculators(): Promise<Calculator[]>;
  getCalculatorBySlug(slug: string): Promise<Calculator | undefined>;
  createCalculator(calculator: InsertCalculator): Promise<Calculator>;
  getFeaturedCalculators(limit?: number): Promise<Calculator[]>;
  toggleFeatured(id: string): Promise<Calculator>;
  
  // Usage tracking operations
  recordCalculatorUsage(usage: InsertCalculatorUsage): Promise<CalculatorUsage>;
  getUserCalculatorHistory(userId: string, limit?: number): Promise<CalculatorUsage[]>;
  getCalculatorStats(calculatorName: string): Promise<number>;
  
  // Admin operations - Ad codes
  getAdCodes(): Promise<AdCode[]>;
  getAdCodeById(id: string): Promise<AdCode | undefined>;
  createAdCode(adCode: InsertAdCode): Promise<AdCode>;
  updateAdCode(id: string, adCode: Partial<InsertAdCode>): Promise<AdCode>;
  deleteAdCode(id: string): Promise<void>;
  getActiveAdsByLocation(location: string): Promise<AdCode[]>;
  
  // Admin operations - Admin users
  getAdminUsers(): Promise<AdminUser[]>;
  isAdmin(userId: string): Promise<boolean>;
  addAdmin(userId: string): Promise<AdminUser>;
  removeAdmin(userId: string): Promise<void>;
  
  // Admin operations - Settings
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<Setting>;
  getAllSettings(): Promise<Setting[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as UpsertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Calculator operations
  async getCalculators(): Promise<Calculator[]> {
    return await db.select().from(calculators).where(eq(calculators.active, 1));
  }

  async getCalculatorBySlug(slug: string): Promise<Calculator | undefined> {
    const [calculator] = await db
      .select()
      .from(calculators)
      .where(and(eq(calculators.slug, slug), eq(calculators.active, 1)));
    return calculator;
  }

  async createCalculator(calculator: InsertCalculator): Promise<Calculator> {
    const [newCalculator] = await db
      .insert(calculators)
      .values(calculator)
      .returning();
    return newCalculator;
  }

  async getFeaturedCalculators(limit = 6): Promise<Calculator[]> {
    return await db
      .select()
      .from(calculators)
      .where(and(eq(calculators.featured, 1), eq(calculators.active, 1)))
      .orderBy(desc(calculators.createdAt))
      .limit(limit);
  }

  async toggleFeatured(id: string): Promise<Calculator> {
    const calculator = await db.select().from(calculators).where(eq(calculators.id, id));
    if (!calculator[0]) {
      throw new Error("Calculator not found");
    }
    const newFeaturedValue = calculator[0].featured === 1 ? 0 : 1;
    const [updated] = await db
      .update(calculators)
      .set({ featured: newFeaturedValue })
      .where(eq(calculators.id, id))
      .returning();
    return updated;
  }

  // Usage tracking operations
  async recordCalculatorUsage(usage: InsertCalculatorUsage): Promise<CalculatorUsage> {
    const [newUsage] = await db
      .insert(calculatorUsage)
      .values(usage)
      .returning();
    return newUsage;
  }

  async getUserCalculatorHistory(userId: string, limit = 50): Promise<CalculatorUsage[]> {
    return await db
      .select()
      .from(calculatorUsage)
      .where(eq(calculatorUsage.userId, userId))
      .orderBy(desc(calculatorUsage.createdAt))
      .limit(limit);
  }

  async getCalculatorStats(calculatorName: string): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(calculatorUsage)
      .where(eq(calculatorUsage.calculatorName, calculatorName));
    return Number(result[0]?.count || 0);
  }

  // Admin operations - Ad codes
  async getAdCodes(): Promise<AdCode[]> {
    return await db.select().from(adCodes).orderBy(desc(adCodes.createdAt));
  }

  async getAdCodeById(id: string): Promise<AdCode | undefined> {
    const [adCode] = await db.select().from(adCodes).where(eq(adCodes.id, id));
    return adCode;
  }

  async createAdCode(adCode: InsertAdCode): Promise<AdCode> {
    const [newAdCode] = await db.insert(adCodes).values(adCode).returning();
    return newAdCode;
  }

  async updateAdCode(id: string, adCode: Partial<InsertAdCode>): Promise<AdCode> {
    const [updatedAdCode] = await db
      .update(adCodes)
      .set({ ...adCode, updatedAt: new Date() })
      .where(eq(adCodes.id, id))
      .returning();
    return updatedAdCode;
  }

  async deleteAdCode(id: string): Promise<void> {
    await db.delete(adCodes).where(eq(adCodes.id, id));
  }

  async getActiveAdsByLocation(location: string): Promise<AdCode[]> {
    return await db
      .select()
      .from(adCodes)
      .where(and(eq(adCodes.location, location), eq(adCodes.active, 1)))
      .orderBy(adCodes.createdAt);
  }

  // Admin operations - Admin users
  async getAdminUsers(): Promise<AdminUser[]> {
    const results = await db
      .select({
        id: adminUsers.id,
        userId: adminUsers.userId,
        createdAt: adminUsers.createdAt,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(adminUsers)
      .leftJoin(users, eq(adminUsers.userId, users.id))
      .orderBy(desc(adminUsers.createdAt));
    
    return results.map(r => ({
      id: r.id,
      userId: r.userId,
      createdAt: r.createdAt,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
    })) as AdminUser[];
  }

  async isAdmin(userId: string): Promise<boolean> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId));
    return !!admin;
  }

  async addAdmin(userId: string): Promise<AdminUser> {
    const [newAdmin] = await db
      .insert(adminUsers)
      .values({ userId })
      .returning();
    return newAdmin;
  }

  async removeAdmin(userId: string): Promise<void> {
    await db.delete(adminUsers).where(eq(adminUsers.userId, userId));
  }

  // Admin operations - Settings
  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting?.value;
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return setting;
  }

  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }
}

export const storage = new DatabaseStorage();
