import {
  users,
  calculatorUsage,
  calculators,
  type User,
  type UpsertUser,
  type CalculatorUsage,
  type InsertCalculatorUsage,
  type Calculator,
  type InsertCalculator,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Calculator operations
  getCalculators(): Promise<Calculator[]>;
  getCalculatorBySlug(slug: string): Promise<Calculator | undefined>;
  createCalculator(calculator: InsertCalculator): Promise<Calculator>;
  
  // Usage tracking operations
  recordCalculatorUsage(usage: InsertCalculatorUsage): Promise<CalculatorUsage>;
  getUserCalculatorHistory(userId: string, limit?: number): Promise<CalculatorUsage[]>;
  getCalculatorStats(calculatorName: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
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
}

export const storage = new DatabaseStorage();
