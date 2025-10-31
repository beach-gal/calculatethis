import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./emailAuth";
import { insertCalculatorUsageSchema, insertAdCodeSchema, insertSettingSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "./resend";
import { calculatorsData } from "../client/src/data/calculators";

// Auth middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user.id;
    const admin = await storage.isAdmin(userId);
    
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Failed to verify admin status" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Get user from database
      const user = await storage.getUserById(userId);
      if (!user || !user.password) {
        return res.status(400).json({ message: "User not found or password not set" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await storage.updateUserPassword(userId, hashedPassword);

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.post('/api/auth/forgot-password', async (req: any, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account exists with this email, a password reset link has been sent." });
      }

      // Create reset token
      const resetToken = await storage.createPasswordResetToken(user.id);

      // Generate reset link
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken.token}`;

      // Send email with reset link
      try {
        await sendPasswordResetEmail(user.email, resetLink);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't reveal that email sending failed for security reasons
      }

      const response: any = { 
        message: "If an account exists with this email, a password reset link has been sent."
      };

      // Only include resetLink in development mode for testing
      if (process.env.NODE_ENV === 'development') {
        response.resetLink = resetLink;
      }

      res.json(response);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // One-time admin setup endpoint
  app.post('/api/make-me-admin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email;

      // Check if user is already an admin
      const isAlreadyAdmin = await storage.isAdmin(userId);
      if (isAlreadyAdmin) {
        return res.json({ message: "You are already an administrator", isAdmin: true });
      }

      // Make user an admin
      await storage.addAdmin(userId);

      res.json({ 
        message: `Successfully made ${userEmail} an administrator!`,
        isAdmin: true
      });
    } catch (error) {
      console.error("Error making user admin:", error);
      res.status(500).json({ message: "Failed to make user admin" });
    }
  });

  app.post('/api/auth/reset-password', async (req: any, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Validate token
      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      if (resetToken.used) {
        return res.status(400).json({ message: "This reset token has already been used" });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ message: "This reset token has expired" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and mark token as used
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      await storage.markResetTokenAsUsed(token);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
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

  app.get('/api/calculators/featured/list', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const calculators = await storage.getFeaturedCalculators(limit);
      res.json(calculators);
    } catch (error) {
      console.error("Error fetching featured calculators:", error);
      res.status(500).json({ message: "Failed to fetch featured calculators" });
    }
  });

  app.get('/api/calculators/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const calculator = await storage.getCalculatorBySlug(slug);
      if (!calculator) {
        return res.status(404).json({ message: "Calculator not found" });
      }
      res.json(calculator);
    } catch (error) {
      console.error("Error fetching calculator:", error);
      res.status(500).json({ message: "Failed to fetch calculator" });
    }
  });

  app.patch('/api/calculators/:id/toggle-featured', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const calculator = await storage.toggleFeatured(req.params.id);
      res.json(calculator);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: "Failed to toggle featured status" });
    }
  });

  // Seed featured calculators (admin only, one-time use)
  app.post('/api/calculators/seed-featured', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const sampleCalculators = [
        {
          name: "Pizza Party Calculator",
          slug: "pizza-party-calc-xyz123",
          category: "Other",
          description: "Calculate how many pizzas you need based on number of guests and slices per person",
          formula: "ceil((guests * slicesPerPerson) / 8)",
          fields: [
            { id: "guests", step: "1", type: "number", label: "Number of Guests", placeholder: "Enter number of guests" },
            { id: "slicesPerPerson", step: "1", type: "number", label: "Slices Per Person", placeholder: "Enter slices per person" }
          ],
          resultLabel: "Pizzas Needed",
          resultUnit: "pizzas",
          creatorName: "Mike Johnson",
          active: 1,
          featured: 1
        },
        {
          name: "Dog Years Calculator",
          slug: "dog-years-calc-abc456",
          category: "Health",
          description: "Convert your dog's age to human years based on breed size",
          formula: "(age <= 2) ? age * 10.5 : 21 + (age - 2) * 4",
          fields: [
            { id: "age", step: "1", type: "number", label: "Dog Age (years)", placeholder: "Enter dog age" }
          ],
          resultLabel: "Human Years",
          resultUnit: "years",
          creatorName: "Sarah Chen",
          active: 1,
          featured: 1
        },
        {
          name: "Perfect Tip Calculator",
          slug: "perfect-tip-calc-def789",
          category: "Finance",
          description: "Calculate the perfect tip amount and split the bill among friends",
          formula: "round((billAmount * (tipPercent / 100)) / numberOfPeople * 100) / 100",
          fields: [
            { id: "billAmount", step: "0.01", type: "number", label: "Bill Amount ($)", placeholder: "Enter bill amount" },
            { id: "tipPercent", step: "1", type: "number", label: "Tip Percentage", placeholder: "Enter tip %" },
            { id: "numberOfPeople", step: "1", type: "number", label: "Number of People", placeholder: "Enter number of people" }
          ],
          resultLabel: "Tip Per Person",
          resultUnit: "$",
          creatorName: "Alex Martinez",
          active: 1,
          featured: 1
        },
        {
          name: "Study Time Planner",
          slug: "study-time-planner-jkl345",
          category: "Other",
          description: "Calculate how many study sessions you need to prepare for an exam",
          formula: "ceil(totalPages / (pagesPerHour * hoursPerDay))",
          fields: [
            { id: "totalPages", step: "1", type: "number", label: "Total Pages", placeholder: "Enter total pages" },
            { id: "pagesPerHour", step: "1", type: "number", label: "Pages Per Hour", placeholder: "Enter pages per hour" },
            { id: "hoursPerDay", step: "1", type: "number", label: "Hours Per Day", placeholder: "Enter hours per day" }
          ],
          resultLabel: "Days Needed",
          resultUnit: "days",
          creatorName: "Taylor Kim",
          active: 1,
          featured: 1
        },
        {
          name: "Coffee Brew Ratio",
          slug: "coffee-brew-ratio-ghi012",
          category: "Other",
          description: "Calculate how many tablespoons of coffee you need based on cups of water and desired brew strength",
          formula: "round((cups * 8) / (brewStrength == 1 ? 8 : brewStrength == 2 ? 6 : 4) * 10) / 10",
          fields: [
            { id: "cups", step: "0.5", type: "number", label: "Water Amount (cups)", placeholder: "Enter number of cups" },
            { id: "brewStrength", step: "1", type: "number", label: "Brew Strength (1=Weak, 2=Medium, 3=Strong)", placeholder: "Enter 1, 2, or 3" }
          ],
          resultLabel: "Coffee Needed",
          resultUnit: "tablespoons",
          creatorName: "Jamie Lee",
          active: 1,
          featured: 1
        }
      ];

      const created = [];
      for (const calc of sampleCalculators) {
        // Check if calculator with this slug already exists
        const existing = await storage.getCalculatorBySlug(calc.slug);
        if (!existing) {
          const newCalc = await storage.createCalculator(calc);
          created.push(newCalc);
        }
      }

      res.json({ 
        message: `Successfully seeded ${created.length} featured calculators`,
        created: created.length,
        skipped: sampleCalculators.length - created.length
      });
    } catch (error) {
      console.error("Error seeding featured calculators:", error);
      res.status(500).json({ message: "Failed to seed featured calculators" });
    }
  });

  // Usage tracking routes (protected)
  app.post('/api/calculator-usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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

  // Execute custom calculator (server-side with safe mathjs evaluation)
  app.post('/api/execute-custom-calculator', async (req, res) => {
    try {
      const { formula, inputs, resultLabel, resultUnit } = req.body;
      
      if (!formula || !inputs) {
        return res.status(400).json({ message: "Formula and inputs are required" });
      }

      // Use mathjs for safe mathematical expression evaluation
      // mathjs uses AST parsing - no eval() or Function()
      const { evaluate } = await import('mathjs');
      
      // Validate inputs - convert to numbers only
      const scope: Record<string, number> = {};
      for (const [key, value] of Object.entries(inputs)) {
        const numValue = parseFloat(String(value));
        if (isNaN(numValue) || !isFinite(numValue)) {
          throw new Error(`Invalid numeric input for ${key}: ${value}`);
        }
        scope[key] = numValue;
      }

      // STRICT validation: formula must only contain allowed characters
      // Allow: numbers, math operators, comparisons, ternary operators, parentheses, function names, and field IDs
      const allowedPattern = /^[a-zA-Z0-9+\-*/()\s.,<>=?:!&|]+$/;
      if (!allowedPattern.test(formula)) {
        throw new Error('Formula contains invalid characters');
      }

      // Block ANY property access, strings, or dangerous patterns
      const strictlyProhibited = [
        /[\[\]]/,  // No array/property access
        /['"`]/,   // No strings or template literals
        /\$/,      // No template literal syntax
        /;/,       // No statement separators
        /constructor/i,
        /prototype/i,
        /__proto__/i,
        /globalThis/i,
        /process/i,
        /require/i,
        /import/i,
        /eval/i,
        /Function/i,
        /Object/i,
        /Array/i,
        /String/i,
      ];
      
      for (const pattern of strictlyProhibited) {
        if (pattern.test(formula)) {
          throw new Error('Formula contains prohibited patterns');
        }
      }

      // Evaluate with mathjs (safe AST-based parser)
      let numericResult;
      try {
        numericResult = evaluate(formula, scope);
      } catch (evalError: any) {
        throw new Error(`Formula evaluation failed: ${evalError.message}`);
      }
      
      // Ensure result is a safe number
      if (typeof numericResult !== 'number' || !isFinite(numericResult)) {
        throw new Error('Formula must return a finite number');
      }
      
      // Format result with label and unit
      let formattedResult = '';
      if (resultLabel) {
        formattedResult = `${resultLabel}: ${numericResult}`;
        if (resultUnit) {
          formattedResult += ` ${resultUnit}`;
        }
      } else {
        formattedResult = String(numericResult);
      }
      
      // Return formatted result
      res.json({ result: formattedResult });

    } catch (error: any) {
      console.error("Error executing custom calculator:", error);
      res.status(400).json({ message: error.message || "Failed to execute calculator" });
    }
  });

  // AI Custom Calculator Generation
  app.post('/api/generate-calculator', async (req, res) => {
    try {
      const { description, creatorName } = req.body;
      
      if (!description || typeof description !== 'string') {
        return res.status(400).json({ message: "Description is required" });
      }

      // Import OpenAI
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are a calculator generator. Given a user's description, generate a calculator specification in JSON format.

The JSON should have this structure:
{
  "name": "Calculator Name",
  "description": "Brief description",
  "fields": [
    { "id": "fieldName", "label": "Field Label", "type": "number", "placeholder": "Enter value", "step": "0.01" }
  ],
  "formula": "mathematical expression using field IDs as variables",
  "resultLabel": "Label describing what the result represents",
  "resultUnit": "unit of measurement for result (optional)",
  "example": "Example: Input 100, Output: Result is 100"
}

IMPORTANT RULES FOR FORMULA:
- Formula must be a SIMPLE MATHEMATICAL EXPRESSION only
- Use field IDs as variables (e.g., if field is "weight", use "weight" in formula)
- Only use: +, -, *, /, (), sqrt(), ceil(), floor(), round(), abs(), min(), max(), pow()
- NO JavaScript code, NO const/let/var, NO semicolons, NO template literals
- NO string concatenation - just return the numeric result
- Formula will be evaluated by mathjs library

Example formulas:
- "weight / (height * height)" for BMI
- "ceil((length * width * height) / 27)" for cubic yards
- "round(distance * 0.621371)" for km to miles

Rules:
- Fields should have descriptive labels with units
- Field IDs should be camelCase with no spaces
- Keep formulas simple and accurate
- Use imperial units by default (lbs, feet, inches, Fahrenheit, miles, gallons)
- Result will be displayed as: "{resultLabel}: {result} {resultUnit}"

Example:
If user says "I need a calculator for paint coverage", generate:
{
  "name": "Paint Coverage Calculator",
  "description": "Calculate how much paint you need based on room dimensions",
  "fields": [
    { "id": "length", "label": "Room Length (feet)", "type": "number", "placeholder": "Enter length", "step": "0.1" },
    { "id": "width", "label": "Room Width (feet)", "type": "number", "placeholder": "Enter width", "step": "0.1" },
    { "id": "height", "label": "Wall Height (feet)", "type": "number", "placeholder": "Enter height", "step": "0.1" }
  ],
  "formula": "ceil((2 * (length + width) * height) / 350)",
  "resultLabel": "Paint Needed",
  "resultUnit": "gallons",
  "example": "Room 12ft x 10ft x 8ft = 2 gallons"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const generatedCalculator = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Validate the generated calculator structure
      if (!generatedCalculator.name || typeof generatedCalculator.name !== 'string') {
        throw new Error('Invalid calculator: missing or invalid name');
      }
      if (!generatedCalculator.description || typeof generatedCalculator.description !== 'string') {
        throw new Error('Invalid calculator: missing or invalid description');
      }
      if (!Array.isArray(generatedCalculator.fields) || generatedCalculator.fields.length === 0) {
        throw new Error('Invalid calculator: missing or invalid fields');
      }
      if (!generatedCalculator.formula || typeof generatedCalculator.formula !== 'string') {
        throw new Error('Invalid calculator: missing or invalid formula');
      }

      // Validate each field
      for (const field of generatedCalculator.fields) {
        if (!field.id || !field.label || !field.type) {
          throw new Error('Invalid calculator: field missing required properties');
        }
        if (!['number', 'text'].includes(field.type)) {
          throw new Error('Invalid calculator: unsupported field type');
        }
      }

      // Validate formula doesn't contain obviously dangerous patterns
      const dangerousPatterns = [
        /require\s*\(/,
        /import\s+/,
        /eval\s*\(/,
        /Function\s*\(/,
        /setTimeout/,
        /setInterval/,
        /XMLHttpRequest/,
        /fetch\s*\(/,
        /window\./,
        /document\./,
        /process\./,
        /global\./,
        /__dirname/,
        /__filename/,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(generatedCalculator.formula)) {
          throw new Error('Invalid calculator: formula contains unsafe operations');
        }
      }
      
      // Generate slug from calculator name
      const baseSlug = generatedCalculator.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Make slug unique by appending random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const slug = `${baseSlug}-${randomSuffix}`;
      
      // Determine category based on description/name (simple heuristic)
      let category = 'Other';
      const lowerDesc = (generatedCalculator.description + ' ' + generatedCalculator.name).toLowerCase();
      if (lowerDesc.match(/bmi|calories|health|fitness|weight|heart/i)) {
        category = 'Health';
      } else if (lowerDesc.match(/loan|mortgage|interest|payment|investment|finance|tax|salary/i)) {
        category = 'Finance';
      } else if (lowerDesc.match(/calculate|math|formula|equation|algebra|geometry/i)) {
        category = 'Math';
      }
      
      // Save calculator to database
      const savedCalculator = await storage.createCalculator({
        name: generatedCalculator.name,
        slug,
        category,
        description: generatedCalculator.description,
        formula: generatedCalculator.formula,
        fields: generatedCalculator.fields,
        resultLabel: generatedCalculator.resultLabel || null,
        resultUnit: generatedCalculator.resultUnit || null,
        creatorName: creatorName || null,
        active: 1,
        featured: 0,
      });
      
      // Return the generated calculator with database info
      res.json({
        ...generatedCalculator,
        id: savedCalculator.id,
        slug: savedCalculator.slug,
        category: savedCalculator.category,
        creatorName: savedCalculator.creatorName,
      });
    } catch (error) {
      console.error("Error generating calculator:", error);
      res.status(500).json({ message: "Failed to generate calculator" });
    }
  });

  // Public route to fetch active ad codes by location
  app.get('/api/ad-codes/:location', async (req, res) => {
    try {
      const { location } = req.params;
      const ads = await storage.getActiveAdsByLocation(location);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  // Admin routes - Ad Codes Management
  app.get('/api/admin/ad-codes', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const adCodes = await storage.getAdCodes();
      res.json(adCodes);
    } catch (error) {
      console.error("Error fetching ad codes:", error);
      res.status(500).json({ message: "Failed to fetch ad codes" });
    }
  });

  app.post('/api/admin/ad-codes', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const adCodeData = insertAdCodeSchema.parse(req.body);
      const adCode = await storage.createAdCode(adCodeData);
      res.json(adCode);
    } catch (error) {
      console.error("Error creating ad code:", error);
      res.status(500).json({ message: "Failed to create ad code" });
    }
  });

  app.put('/api/admin/ad-codes/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const adCode = await storage.updateAdCode(id, req.body);
      res.json(adCode);
    } catch (error) {
      console.error("Error updating ad code:", error);
      res.status(500).json({ message: "Failed to update ad code" });
    }
  });

  app.delete('/api/admin/ad-codes/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAdCode(id);
      res.json({ message: "Ad code deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad code:", error);
      res.status(500).json({ message: "Failed to delete ad code" });
    }
  });

  // One-time admin setup endpoint (only works if no admins exist)
  app.post('/api/setup-first-admin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email;
      
      // Check if any admins already exist
      const existingAdmins = await storage.getAdminUsers();
      if (existingAdmins.length > 0) {
        return res.status(403).json({ 
          message: "Admin setup is disabled. Admins already exist.",
          admins: existingAdmins.length
        });
      }
      
      // No admins exist, make this user the first admin
      const admin = await storage.addAdmin(userId);
      res.json({ 
        message: `Successfully set up ${userEmail} as the first admin!`,
        admin
      });
    } catch (error) {
      console.error("Error setting up first admin:", error);
      res.status(500).json({ message: "Failed to set up admin" });
    }
  });

  // Emergency password reset (only works if no admins exist - for initial setup)
  app.post('/api/emergency-password-reset', async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      
      if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required" });
      }

      // Check if any admins already exist
      const existingAdmins = await storage.getAdminUsers();
      if (existingAdmins.length > 0) {
        return res.status(403).json({ 
          message: "Emergency reset is disabled. Admins already exist. Use the normal password reset flow.",
        });
      }

      // No admins exist, allow password reset
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found with that email" });
      }

      // Hash the new password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      await storage.updateUserPassword(user.id, hashedPassword);

      res.json({ 
        message: "Password reset successfully! You can now log in with your new password."
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Admin routes - Admin Users Management
  app.get('/api/admin/admins', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const admins = await storage.getAdminUsers();
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  app.post('/api/admin/admins', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Look up user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found with that email" });
      }
      
      const admin = await storage.addAdmin(user.id);
      res.json(admin);
    } catch (error) {
      console.error("Error adding admin:", error);
      res.status(500).json({ message: "Failed to add admin" });
    }
  });

  app.delete('/api/admin/admins/:userId', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      await storage.removeAdmin(userId);
      res.json({ message: "Admin removed successfully" });
    } catch (error) {
      console.error("Error removing admin:", error);
      res.status(500).json({ message: "Failed to remove admin" });
    }
  });

  // Admin routes - Settings Management
  app.get('/api/admin/settings', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.get('/api/settings/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const value = await storage.getSetting(key);
      res.json({ key, value });
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post('/api/admin/settings', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const setting = await storage.setSetting(settingData.key, settingData.value);
      res.json(setting);
    } catch (error) {
      console.error("Error saving setting:", error);
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  // Check if current user is admin
  app.get('/api/admin/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdminUser = await storage.isAdmin(userId);
      res.json({ isAdmin: isAdminUser });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Sitemap
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://calculatethis.org' 
        : 'http://localhost:5000';
      
      const customCalculators = await storage.getCalculators();
      
      const now = new Date().toISOString();
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `  </url>\n`;
      
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/custom-calculator</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
      
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/community-calculators</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
      
      for (const calc of calculatorsData) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/calculator/${calc.slug}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
      
      for (const calc of customCalculators) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/custom-calculator/${calc.slug}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }
      
      xml += '</urlset>';
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
