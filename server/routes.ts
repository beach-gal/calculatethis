import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCalculatorUsageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Calculator routes
  app.get('/api/calculators', async (req, res) => {
    try {
      const calculators = await storage.getCalculators();
      res.json(calculators);
    } catch (error) {
      console.error("Error fetching calculators:", error);
      res.status(500).json({ message: "Failed to fetch calculators" });
    }
  });

  app.get('/api/calculators/:slug', async (req, res) => {
    try {
      const calculator = await storage.getCalculatorBySlug(req.params.slug);
      if (!calculator) {
        return res.status(404).json({ message: "Calculator not found" });
      }
      res.json(calculator);
    } catch (error) {
      console.error("Error fetching calculator:", error);
      res.status(500).json({ message: "Failed to fetch calculator" });
    }
  });

  // Usage tracking routes (protected)
  app.post('/api/calculator-usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const usageData = insertCalculatorUsageSchema.parse({
        ...req.body,
        userId,
      });
      
      const usage = await storage.recordCalculatorUsage(usageData);
      res.json(usage);
    } catch (error) {
      console.error("Error recording calculator usage:", error);
      res.status(500).json({ message: "Failed to record usage" });
    }
  });

  app.get('/api/my-calculator-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserCalculatorHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching calculator history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }

      const calculators = await storage.getCalculators();
      const filtered = calculators.filter(calc => 
        calc.name.toLowerCase().includes(query.toLowerCase()) ||
        calc.description?.toLowerCase().includes(query.toLowerCase()) ||
        calc.category.toLowerCase().includes(query.toLowerCase())
      );
      
      res.json(filtered);
    } catch (error) {
      console.error("Error searching calculators:", error);
      res.status(500).json({ message: "Failed to search calculators" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
