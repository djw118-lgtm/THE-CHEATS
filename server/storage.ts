import {
  type LotteryDraw,
  type InsertLotteryDraw,
  type GapAnalysis,
  type InsertGapAnalysis,
  type StreakAnalysis,
  type InsertStreakAnalysis,
  type RepeatAnalysis,
  type InsertRepeatAnalysis,
  type QuadTripleWatch,
  type InsertQuadTripleWatch,
  type GameStats,
  type ROICalculation,
  type ROIParams
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Lottery draws
  createDraw(draw: InsertLotteryDraw): Promise<LotteryDraw>;
  getDraws(gameType: string, limit?: number): Promise<LotteryDraw[]>;
  
  // Gap analysis
  getGaps(gameType: string): Promise<GapAnalysis[]>;
  updateGapAnalysis(gameType: string): Promise<void>;
  
  // Streak analysis
  getStreaks(gameType: string): Promise<StreakAnalysis[]>;
  updateStreakAnalysis(gameType: string): Promise<void>;
  
  // Repeat analysis
  getRepeats(gameType: string): Promise<RepeatAnalysis[]>;
  updateRepeatAnalysis(gameType: string): Promise<void>;
  
  // Quad/Triple watch
  getWatchNumbers(gameType: string): Promise<QuadTripleWatch[]>;
  updateWatchAnalysis(gameType: string): Promise<void>;
  
  // Stats
  getGameStats(gameType: string): Promise<GameStats>;
  
  // ROI Calculator
  calculateROI(params: ROIParams): ROICalculation;
  
  // Search
  searchNumbers(gameType: string, query: string): Promise<{
    gaps: GapAnalysis[];
    streaks: StreakAnalysis[];
    repeats: RepeatAnalysis[];
  }>;
}

export class MemStorage implements IStorage {
  private draws: Map<string, LotteryDraw> = new Map();
  private gaps: Map<string, GapAnalysis> = new Map();
  private streaks: Map<string, StreakAnalysis> = new Map();
  private repeats: Map<string, RepeatAnalysis> = new Map();
  private watchNumbers: Map<string, QuadTripleWatch> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize Pick 4 patterns (0000-9999)
    this.initializeWatchPatterns('pick4');
    // Initialize Pick 3 patterns (000-999)  
    this.initializeWatchPatterns('pick3');
    
    // Initialize gap analysis for both games
    this.initializeGaps('pick3');
    this.initializeGaps('pick4');
    
    // Initialize streaks for both games
    this.initializeStreaks('pick3');
    this.initializeStreaks('pick4');
    
    // Initialize repeats for both games
    this.initializeRepeats('pick3');
    this.initializeRepeats('pick4');
  }

  private initializeWatchPatterns(gameType: 'pick3' | 'pick4') {
    const patterns = gameType === 'pick4' 
      ? ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999']
      : ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
    
    patterns.forEach(pattern => {
      const id = randomUUID();
      const watchItem: QuadTripleWatch = {
        id,
        gameType,
        pattern,
        hasHit: Math.random() > 0.3, // 70% chance of being hit
        lastHitDate: Math.random() > 0.3 
          ? new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
          : null,
        drawType: Math.random() > 0.5 ? 'midday' : 'evening',
        daysSince: Math.floor(Math.random() * 1000),
      };
      this.watchNumbers.set(id, watchItem);
    });
  }

  private initializeGaps(gameType: 'pick3' | 'pick4') {
    const maxNumber = gameType === 'pick4' ? 9999 : 999;
    
    // Create sample gaps for demonstration
    for (let i = 0; i <= Math.min(100, maxNumber); i++) {
      const number = gameType === 'pick4' 
        ? i.toString().padStart(4, '0')
        : i.toString().padStart(3, '0');
      
      const id = randomUUID();
      const daysSince = Math.floor(Math.random() * 1000);
      const gap: GapAnalysis = {
        id,
        gameType,
        number,
        lastHitDate: daysSince === 0 ? null : new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000),
        daysSinceHit: daysSince,
        status: daysSince > 600 ? 'critical' : daysSince > 400 ? 'high' : daysSince > 200 ? 'medium' : 'low',
        updatedAt: new Date(),
      };
      this.gaps.set(id, gap);
    }
  }

  private initializeStreaks(gameType: 'pick3' | 'pick4') {
    // Create sample streaks for demonstration
    const streakCount = Math.floor(Math.random() * 15) + 10; // 10-25 streaks
    
    for (let i = 0; i < streakCount; i++) {
      const number = gameType === 'pick4' 
        ? Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        : Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      const hitCount = Math.floor(Math.random() * 10) + 3; // 3-12 hits
      const daysActive = Math.floor(Math.random() * 30) + 1; // 1-30 days
      const frequency = `${hitCount} hits in ${daysActive} days`;
      const status = hitCount >= 8 ? 'hot' : hitCount >= 5 ? 'warm' : 'cooling';
      
      const id = randomUUID();
      const streak: StreakAnalysis = {
        id,
        gameType,
        number,
        hitCount,
        periodDays: daysActive,
        frequency,
        isActive: true,
        status,
        lastHit: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)), // within last 3 days
        updatedAt: new Date(),
      };
      this.streaks.set(id, streak);
    }
  }

  private initializeRepeats(gameType: 'pick3' | 'pick4') {
    // Create sample repeats for demonstration
    const repeatCount = Math.floor(Math.random() * 20) + 15; // 15-35 repeats
    const patternTypes = ['consecutive', 'same_day', 'weekly'] as const;
    
    for (let i = 0; i < repeatCount; i++) {
      const number = gameType === 'pick4' 
        ? Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        : Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const occurrences = Math.floor(Math.random() * 5) + 2; // 2-6 occurrences
      const daysAgo = Math.floor(Math.random() * 30) + 1; // within last 30 days
      
      const endDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      
      const description = patternType === 'consecutive' 
        ? 'Back-to-back draws'
        : patternType === 'same_day'
        ? 'Repeated on same day (Midday & Evening)'
        : 'Within 7 days';
      
      const id = randomUUID();
      const repeat: RepeatAnalysis = {
        id,
        gameType,
        number,
        patternType,
        occurrences,
        dateRange,
        description,
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      };
      this.repeats.set(id, repeat);
    }
  }

  async createDraw(insertDraw: InsertLotteryDraw): Promise<LotteryDraw> {
    const id = randomUUID();
    const draw: LotteryDraw = {
      ...insertDraw,
      id,
      createdAt: new Date(),
      fireball: insertDraw.fireball ?? null,
    };
    this.draws.set(id, draw);
    
    // Update analysis after new draw
    await this.updateGapAnalysis(insertDraw.gameType);
    await this.updateStreakAnalysis(insertDraw.gameType);
    await this.updateRepeatAnalysis(insertDraw.gameType);
    await this.updateWatchAnalysis(insertDraw.gameType);
    
    return draw;
  }

  async getDraws(gameType: string, limit = 100): Promise<LotteryDraw[]> {
    return Array.from(this.draws.values())
      .filter(draw => draw.gameType === gameType)
      .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime())
      .slice(0, limit);
  }

  async getGaps(gameType: string): Promise<GapAnalysis[]> {
    return Array.from(this.gaps.values())
      .filter(gap => gap.gameType === gameType)
      .sort((a, b) => b.daysSinceHit - a.daysSinceHit);
  }

  async updateGapAnalysis(gameType: string): Promise<void> {
    // This would analyze recent draws and update gap statistics
    // Implementation would check each number against recent draws
  }

  async getStreaks(gameType: string): Promise<StreakAnalysis[]> {
    return Array.from(this.streaks.values())
      .filter(streak => streak.gameType === gameType && streak.isActive)
      .sort((a, b) => b.hitCount - a.hitCount);
  }

  async updateStreakAnalysis(gameType: string): Promise<void> {
    // This would analyze recent draws for streak patterns
  }

  async getRepeats(gameType: string): Promise<RepeatAnalysis[]> {
    return Array.from(this.repeats.values())
      .filter(repeat => repeat.gameType === gameType)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateRepeatAnalysis(gameType: string): Promise<void> {
    // This would analyze recent draws for repeat patterns
  }

  async getWatchNumbers(gameType: string): Promise<QuadTripleWatch[]> {
    return Array.from(this.watchNumbers.values())
      .filter(watch => watch.gameType === gameType)
      .sort((a, b) => a.pattern.localeCompare(b.pattern));
  }

  async updateWatchAnalysis(gameType: string): Promise<void> {
    // This would update watch patterns based on recent draws
  }

  async getGameStats(gameType: string): Promise<GameStats> {
    const gaps = await this.getGaps(gameType);
    const streaks = await this.getStreaks(gameType);
    const repeats = await this.getRepeats(gameType);
    
    const longestDrought = gaps[0] || { number: '0000', daysSinceHit: 0 };
    const hottestStreak = streaks[0] || { number: '0000', frequency: '0 hits' };

    return {
      totalNumbers: gameType === 'pick4' ? 10000 : 1000,
      totalGaps: gaps.length,
      activeStreaks: streaks.length,
      recentRepeats: repeats.length,
      longestDrought: {
        number: longestDrought.number,
        days: longestDrought.daysSinceHit,
      },
      hottestStreak: {
        number: hottestStreak.number,
        frequency: hottestStreak.frequency,
      },
    };
  }

  calculateROI(params: ROIParams): ROICalculation {
    const { gameType, betAmount, withFireball, playsPerDay, timePeriod } = params;
    
    const fireballCost = betAmount;
    const costPerPlay = withFireball ? betAmount * 2 : betAmount;
    const dailyCost = costPerPlay * playsPerDay;
    const totalSpend = dailyCost * timePeriod;
    
    const straightPayout = gameType === 'pick4' ? 5000 : 500;
    const fireballPayout = gameType === 'pick4' ? 750 : 100;
    const totalPayout = withFireball ? 
      (straightPayout + fireballPayout) * betAmount : 
      straightPayout * betAmount;
    
    const netProfit = totalPayout - totalSpend;
    const breakEvenDays = Math.ceil(totalPayout / dailyCost);

    return {
      costPerPlay,
      dailyCost,
      totalSpend,
      payout: totalPayout,
      netProfit,
      breakEvenDays,
    };
  }

  async searchNumbers(gameType: string, query: string): Promise<{
    gaps: GapAnalysis[];
    streaks: StreakAnalysis[];
    repeats: RepeatAnalysis[];
  }> {
    const gaps = await this.getGaps(gameType);
    const streaks = await this.getStreaks(gameType);
    const repeats = await this.getRepeats(gameType);
    
    const searchTerm = query.toLowerCase();
    
    return {
      gaps: gaps.filter(gap => gap.number.includes(searchTerm)),
      streaks: streaks.filter(streak => streak.number.includes(searchTerm)),
      repeats: repeats.filter(repeat => repeat.number.includes(searchTerm)),
    };
  }
}

export const storage = new MemStorage();
