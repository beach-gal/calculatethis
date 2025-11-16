import express from "express";
import { createServerlessHandler } from "@vercel/node"; // optional helper

const app = express();

// Define your routes
app.get("/generate", (req, res) => {
  res.json({ message: "AI calculator generated!" });
});

// Export as a serverless handler
export default app;
