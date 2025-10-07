// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  draws = /* @__PURE__ */ new Map();
  gaps = /* @__PURE__ */ new Map();
  streaks = /* @__PURE__ */ new Map();
  repeats = /* @__PURE__ */ new Map();
  watchNumbers = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeSampleData();
  }
  initializeSampleData() {
    this.initializeWatchPatterns("pick4");
    this.initializeWatchPatterns("pick3");
    this.initializeGaps("pick3");
    this.initializeGaps("pick4");
    this.initializeStreaks("pick3");
    this.initializeStreaks("pick4");
    this.initializeRepeats("pick3");
    this.initializeRepeats("pick4");
  }
  initializeWatchPatterns(gameType) {
    const patterns = gameType === "pick4" ? ["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"] : ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"];
    patterns.forEach((pattern) => {
      const id = randomUUID();
      const watchItem = {
        id,
        gameType,
        pattern,
        hasHit: Math.random() > 0.3,
        // 70% chance of being hit
        lastHitDate: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1e3)) : null,
        drawType: Math.random() > 0.5 ? "midday" : "evening",
        daysSince: Math.floor(Math.random() * 1e3)
      };
      this.watchNumbers.set(id, watchItem);
    });
  }
  initializeGaps(gameType) {
    const maxNumber = gameType === "pick4" ? 9999 : 999;
    for (let i = 0; i <= Math.min(100, maxNumber); i++) {
      const number = gameType === "pick4" ? i.toString().padStart(4, "0") : i.toString().padStart(3, "0");
      const id = randomUUID();
      const daysSince = Math.floor(Math.random() * 1e3);
      const gap = {
        id,
        gameType,
        number,
        lastHitDate: daysSince === 0 ? null : new Date(Date.now() - daysSince * 24 * 60 * 60 * 1e3),
        daysSinceHit: daysSince,
        status: daysSince > 600 ? "critical" : daysSince > 400 ? "high" : daysSince > 200 ? "medium" : "low",
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.gaps.set(id, gap);
    }
  }
  initializeStreaks(gameType) {
    const streakCount = Math.floor(Math.random() * 15) + 10;
    for (let i = 0; i < streakCount; i++) {
      const number = gameType === "pick4" ? Math.floor(Math.random() * 1e4).toString().padStart(4, "0") : Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
      const hitCount = Math.floor(Math.random() * 10) + 3;
      const daysActive = Math.floor(Math.random() * 30) + 1;
      const frequency = `${hitCount} hits in ${daysActive} days`;
      const status = hitCount >= 8 ? "hot" : hitCount >= 5 ? "warm" : "cooling";
      const id = randomUUID();
      const streak = {
        id,
        gameType,
        number,
        hitCount,
        periodDays: daysActive,
        frequency,
        isActive: true,
        status,
        lastHit: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1e3)),
        // within last 3 days
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.streaks.set(id, streak);
    }
  }
  initializeRepeats(gameType) {
    const repeatCount = Math.floor(Math.random() * 20) + 15;
    const patternTypes = ["consecutive", "same_day", "weekly"];
    for (let i = 0; i < repeatCount; i++) {
      const number = gameType === "pick4" ? Math.floor(Math.random() * 1e4).toString().padStart(4, "0") : Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const occurrences = Math.floor(Math.random() * 5) + 2;
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const endDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1e3);
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      const description = patternType === "consecutive" ? "Back-to-back draws" : patternType === "same_day" ? "Repeated on same day (Midday & Evening)" : "Within 7 days";
      const id = randomUUID();
      const repeat = {
        id,
        gameType,
        number,
        patternType,
        occurrences,
        dateRange,
        description,
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1e3)
      };
      this.repeats.set(id, repeat);
    }
  }
  async createDraw(insertDraw) {
    const id = randomUUID();
    const draw = {
      ...insertDraw,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      fireball: insertDraw.fireball ?? null
    };
    this.draws.set(id, draw);
    await this.updateGapAnalysis(insertDraw.gameType);
    await this.updateStreakAnalysis(insertDraw.gameType);
    await this.updateRepeatAnalysis(insertDraw.gameType);
    await this.updateWatchAnalysis(insertDraw.gameType);
    return draw;
  }
  async getDraws(gameType, limit = 100) {
    return Array.from(this.draws.values()).filter((draw) => draw.gameType === gameType).sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()).slice(0, limit);
  }
  async getGaps(gameType) {
    return Array.from(this.gaps.values()).filter((gap) => gap.gameType === gameType).sort((a, b) => b.daysSinceHit - a.daysSinceHit);
  }
  async updateGapAnalysis(gameType) {
  }
  async getStreaks(gameType) {
    return Array.from(this.streaks.values()).filter((streak) => streak.gameType === gameType && streak.isActive).sort((a, b) => b.hitCount - a.hitCount);
  }
  async updateStreakAnalysis(gameType) {
  }
  async getRepeats(gameType) {
    return Array.from(this.repeats.values()).filter((repeat) => repeat.gameType === gameType).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async updateRepeatAnalysis(gameType) {
  }
  async getWatchNumbers(gameType) {
    return Array.from(this.watchNumbers.values()).filter((watch) => watch.gameType === gameType).sort((a, b) => a.pattern.localeCompare(b.pattern));
  }
  async updateWatchAnalysis(gameType) {
  }
  async getGameStats(gameType) {
    const gaps = await this.getGaps(gameType);
    const streaks = await this.getStreaks(gameType);
    const repeats = await this.getRepeats(gameType);
    const longestDrought = gaps[0] || { number: "0000", daysSinceHit: 0 };
    const hottestStreak = streaks[0] || { number: "0000", frequency: "0 hits" };
    return {
      totalNumbers: gameType === "pick4" ? 1e4 : 1e3,
      totalGaps: gaps.length,
      activeStreaks: streaks.length,
      recentRepeats: repeats.length,
      longestDrought: {
        number: longestDrought.number,
        days: longestDrought.daysSinceHit
      },
      hottestStreak: {
        number: hottestStreak.number,
        frequency: hottestStreak.frequency
      }
    };
  }
  calculateROI(params) {
    const { gameType, betAmount, withFireball, playsPerDay, timePeriod } = params;
    const fireballCost = betAmount;
    const costPerPlay = withFireball ? betAmount * 2 : betAmount;
    const dailyCost = costPerPlay * playsPerDay;
    const totalSpend = dailyCost * timePeriod;
    const straightPayout = gameType === "pick4" ? 5e3 : 500;
    const fireballPayout = gameType === "pick4" ? 750 : 100;
    const totalPayout = withFireball ? (straightPayout + fireballPayout) * betAmount : straightPayout * betAmount;
    const netProfit = totalPayout - totalSpend;
    const breakEvenDays = Math.ceil(totalPayout / dailyCost);
    return {
      costPerPlay,
      dailyCost,
      totalSpend,
      payout: totalPayout,
      netProfit,
      breakEvenDays
    };
  }
  async searchNumbers(gameType, query) {
    const gaps = await this.getGaps(gameType);
    const streaks = await this.getStreaks(gameType);
    const repeats = await this.getRepeats(gameType);
    const searchTerm = query.toLowerCase();
    return {
      gaps: gaps.filter((gap) => gap.number.includes(searchTerm)),
      streaks: streaks.filter((streak) => streak.number.includes(searchTerm)),
      repeats: repeats.filter((repeat) => repeat.number.includes(searchTerm))
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var lotteryDraws = pgTable("lottery_draws", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  // 'pick3' or 'pick4'
  drawType: varchar("draw_type", { length: 10 }).notNull(),
  // 'midday' or 'evening'
  number: varchar("number", { length: 4 }).notNull(),
  drawDate: timestamp("draw_date").notNull(),
  fireball: varchar("fireball", { length: 1 }),
  createdAt: timestamp("created_at").defaultNow()
});
var gapAnalysis = pgTable("gap_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  lastHitDate: timestamp("last_hit_date"),
  daysSinceHit: integer("days_since_hit").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // 'critical', 'high', 'medium', 'low'
  updatedAt: timestamp("updated_at").defaultNow()
});
var streakAnalysis = pgTable("streak_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  hitCount: integer("hit_count").notNull(),
  periodDays: integer("period_days").notNull(),
  frequency: text("frequency").notNull(),
  // "1 hit/5 days"
  lastHit: timestamp("last_hit").notNull(),
  status: varchar("status", { length: 10 }).notNull(),
  // 'hot', 'warm', 'cooling'
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow()
});
var repeatAnalysis = pgTable("repeat_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  patternType: varchar("pattern_type", { length: 20 }).notNull(),
  // 'weekly', 'consecutive', 'same_day'
  occurrences: integer("occurrences").notNull(),
  dateRange: text("date_range").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var quadTripleWatch = pgTable("quad_triple_watch", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  pattern: varchar("pattern", { length: 4 }).notNull(),
  // '0000', '1111', etc.
  hasHit: boolean("has_hit").notNull().default(false),
  lastHitDate: timestamp("last_hit_date"),
  drawType: varchar("draw_type", { length: 10 }),
  daysSince: integer("days_since").default(0)
});
var insertLotteryDrawSchema = createInsertSchema(lotteryDraws).omit({
  id: true,
  createdAt: true
});
var insertGapAnalysisSchema = createInsertSchema(gapAnalysis).omit({
  id: true,
  updatedAt: true
});
var insertStreakAnalysisSchema = createInsertSchema(streakAnalysis).omit({
  id: true,
  updatedAt: true
});
var insertRepeatAnalysisSchema = createInsertSchema(repeatAnalysis).omit({
  id: true,
  createdAt: true
});
var insertQuadTripleWatchSchema = createInsertSchema(quadTripleWatch).omit({
  id: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/gaps/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const gaps = await storage.getGaps(gameType);
      res.json(gaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/streaks/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const streaks = await storage.getStreaks(gameType);
      res.json(streaks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/repeats/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const repeats = await storage.getRepeats(gameType);
      res.json(repeats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/watch/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const watchNumbers = await storage.getWatchNumbers(gameType);
      res.json(watchNumbers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/stats/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const stats = await storage.getGameStats(gameType);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/calculate-roi", async (req, res) => {
    try {
      const roiParams = req.body;
      const result = storage.calculateROI(roiParams);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/search/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const { q: query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await storage.searchNumbers(gameType, query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/draws", async (req, res) => {
    try {
      const drawData = insertLotteryDrawSchema.parse(req.body);
      const draw = await storage.createDraw(drawData);
      res.json(draw);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid draw data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/draws/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit) || 100;
      const draws = await storage.getDraws(gameType, limit);
      res.json(draws);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/THE-CHEATS/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
