import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLotteryDrawSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get gaps data
  app.get("/api/gaps/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const gaps = await storage.getGaps(gameType);
      res.json(gaps);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get streaks data
  app.get("/api/streaks/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const streaks = await storage.getStreaks(gameType);
      res.json(streaks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get repeats data
  app.get("/api/repeats/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const repeats = await storage.getRepeats(gameType);
      res.json(repeats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get watch numbers
  app.get("/api/watch/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const watchNumbers = await storage.getWatchNumbers(gameType);
      res.json(watchNumbers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get game stats
  app.get("/api/stats/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const stats = await storage.getGameStats(gameType);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Calculate ROI
  app.post("/api/calculate-roi", async (req, res) => {
    try {
      const roiParams = req.body;
      const result = storage.calculateROI(roiParams);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Search numbers
  app.get("/api/search/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const results = await storage.searchNumbers(gameType, query);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add lottery draw
  app.post("/api/draws", async (req, res) => {
    try {
      const drawData = insertLotteryDrawSchema.parse(req.body);
      const draw = await storage.createDraw(drawData);
      res.json(draw);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid draw data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get recent draws
  app.get("/api/draws/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      const draws = await storage.getDraws(gameType, limit);
      res.json(draws);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
