import express from "express";
import { createServer } from "@vercel/node"; // optional if using express directly

const app = express();

// Example route for your AI calculator builder
app.post("/api/generate-calculator", async (req, res) => {
  try {
    const result = await runYourAI(req.body); // replace with your actual logic
    res.json(result);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Vercel expects a default export
export default app;
