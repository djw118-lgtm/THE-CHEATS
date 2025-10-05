import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const lotteryDraws = pgTable("lottery_draws", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(), // 'pick3' or 'pick4'
  drawType: varchar("draw_type", { length: 10 }).notNull(), // 'midday' or 'evening'
  number: varchar("number", { length: 4 }).notNull(),
  drawDate: timestamp("draw_date").notNull(),
  fireball: varchar("fireball", { length: 1 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gapAnalysis = pgTable("gap_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  lastHitDate: timestamp("last_hit_date"),
  daysSinceHit: integer("days_since_hit").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'critical', 'high', 'medium', 'low'
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const streakAnalysis = pgTable("streak_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  hitCount: integer("hit_count").notNull(),
  periodDays: integer("period_days").notNull(),
  frequency: text("frequency").notNull(), // "1 hit/5 days"
  lastHit: timestamp("last_hit").notNull(),
  status: varchar("status", { length: 10 }).notNull(), // 'hot', 'warm', 'cooling'
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const repeatAnalysis = pgTable("repeat_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  patternType: varchar("pattern_type", { length: 20 }).notNull(), // 'weekly', 'consecutive', 'same_day'
  occurrences: integer("occurrences").notNull(),
  dateRange: text("date_range").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quadTripleWatch = pgTable("quad_triple_watch", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: varchar("game_type", { length: 10 }).notNull(),
  pattern: varchar("pattern", { length: 4 }).notNull(), // '0000', '1111', etc.
  hasHit: boolean("has_hit").notNull().default(false),
  lastHitDate: timestamp("last_hit_date"),
  drawType: varchar("draw_type", { length: 10 }),
  daysSince: integer("days_since").default(0),
});

// Insert schemas
export const insertLotteryDrawSchema = createInsertSchema(lotteryDraws).omit({
  id: true,
  createdAt: true,
});

export const insertGapAnalysisSchema = createInsertSchema(gapAnalysis).omit({
  id: true,
  updatedAt: true,
});

export const insertStreakAnalysisSchema = createInsertSchema(streakAnalysis).omit({
  id: true,
  updatedAt: true,
});

export const insertRepeatAnalysisSchema = createInsertSchema(repeatAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertQuadTripleWatchSchema = createInsertSchema(quadTripleWatch).omit({
  id: true,
});

// Types
export type LotteryDraw = typeof lotteryDraws.$inferSelect;
export type InsertLotteryDraw = z.infer<typeof insertLotteryDrawSchema>;

export type GapAnalysis = typeof gapAnalysis.$inferSelect;
export type InsertGapAnalysis = z.infer<typeof insertGapAnalysisSchema>;

export type StreakAnalysis = typeof streakAnalysis.$inferSelect;
export type InsertStreakAnalysis = z.infer<typeof insertStreakAnalysisSchema>;

export type RepeatAnalysis = typeof repeatAnalysis.$inferSelect;
export type InsertRepeatAnalysis = z.infer<typeof insertRepeatAnalysisSchema>;

export type QuadTripleWatch = typeof quadTripleWatch.$inferSelect;
export type InsertQuadTripleWatch = z.infer<typeof insertQuadTripleWatchSchema>;

// Game settings and stats
export interface GameStats {
  totalNumbers: number;
  totalGaps: number;
  activeStreaks: number;
  recentRepeats: number;
  longestDrought: {
    number: string;
    days: number;
  };
  hottestStreak: {
    number: string;
    frequency: string;
  };
}

// ROI Calculator types  
export interface ROICalculation {
  costPerPlay: number;
  dailyCost: number;
  totalSpend: number;
  payout: number;
  netProfit: number;
  breakEvenDays: number;
}

export interface ROIParams {
  gameType: 'pick3' | 'pick4';
  betAmount: number;
  withFireball: boolean;
  playsPerDay: number;
  timePeriod: number;
}
