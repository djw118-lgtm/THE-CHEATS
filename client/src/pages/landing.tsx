import { useState } from "react";
import { Link } from "wouter";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { TrendingDown, TrendingUp, Repeat } from "lucide-react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setGameType } = useLotteryData();

  const handleGameTypeAndNavigate = (gameType: 'pick3' | 'pick4', path: string) => {
    setGameType(gameType);
    // Navigation will happen via Link component
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full space-y-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight" data-testid="text-hero-title">
            THE CHEAT
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl" data-testid="text-hero-subtitle">
            The Cliff Notes for the Lottery
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 md:p-10 text-primary-foreground shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-hero-callout">
            Not Just What Hit Today, But What Hasn't Hit
          </h2>
          <p className="text-xl md:text-2xl mb-2 opacity-95" data-testid="text-hero-description">
            Not just history, but GAPS, STREAKS, and REPEATS
          </p>
          <p className="text-lg md:text-xl italic opacity-90" data-testid="text-hero-tagline">
            Something players can argue over - with FACTS instead of memory
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 md:p-10 border border-border shadow-xl">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center" data-testid="text-features-title">
            What THE CHEAT Tracks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingDown className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2" data-testid="text-feature-gaps-title">GAPS</h4>
              <p className="text-foreground" data-testid="text-feature-gaps-description">Numbers that haven't hit</p>
              <p className="text-muted-foreground text-sm mt-1" data-testid="text-feature-gaps-subtitle">(the droughts)</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2" data-testid="text-feature-streaks-title">STREAKS</h4>
              <p className="text-foreground" data-testid="text-feature-streaks-description">Numbers hitting frequently</p>
              <p className="text-muted-foreground text-sm mt-1" data-testid="text-feature-streaks-subtitle">(the hot numbers)</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Repeat className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2" data-testid="text-feature-repeats-title">REPEATS</h4>
              <p className="text-foreground" data-testid="text-feature-repeats-description">Numbers hitting multiple times</p>
              <p className="text-muted-foreground text-sm mt-1" data-testid="text-feature-repeats-subtitle">(back-to-back, same day)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gaps" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-gaps">
              THE GAPS
            </button>
          </Link>
          <Link href="/streaks" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-streaks">
              THE STREAKS
            </button>
          </Link>
          <Link href="/repeats" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-repeats">
              THE REPEATS
            </button>
          </Link>
          <Link href="/watch" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-watch">
              QUAD WATCH
            </button>
          </Link>
          <Link href="/calculator" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-calculator">
              CALCULATOR
            </button>
          </Link>
          <Link href="/gaps" onClick={() => setGameType('pick3')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-pick3">
              PICK 3
            </button>
          </Link>
          <Link href="/gaps" onClick={() => setGameType('pick4')}>
            <button className="w-full bg-card border-2 border-border rounded-lg p-4 text-foreground hover:border-primary hover:bg-muted transition-all font-semibold" data-testid="button-pick4">
              PICK 4
            </button>
          </Link>
          <button className="bg-primary border-2 border-primary rounded-lg p-4 text-primary-foreground hover:bg-accent transition-all font-bold" data-testid="button-upgrade-landing">
            UPGRADE
          </button>
        </div>

        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xl"></i>
            <input
              type="text"
              placeholder="SEARCH NUMBERS"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-card border-2 border-border rounded-xl text-foreground text-lg placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
