import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLotteryData } from "@/hooks/use-lottery-data";
import type { ROIParams, ROICalculation } from "@shared/schema";

export default function CalculatorPage() {
  const { gameType, setGameType } = useLotteryData();
  const [betAmount, setBetAmount] = useState(1.00);
  const [withFireball, setWithFireball] = useState(false);
  const [playsPerDay, setPlaysPerDay] = useState(2);
  const [timePeriod, setTimePeriod] = useState(30);
  const [results, setResults] = useState<ROICalculation | null>(null);

  const calculateROI = async () => {
    const params: ROIParams = {
      gameType,
      betAmount,
      withFireball,
      playsPerDay,
      timePeriod,
    };

    try {
      const response = await fetch('/api/calculate-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate ROI');
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('ROI calculation failed:', error);
    }
  };

  useEffect(() => {
    calculateROI();
  }, [gameType, betAmount, withFireball, playsPerDay, timePeriod]);

  const getTimePeriodLabel = (days: number) => {
    if (days === 7) return '1 Week';
    if (days === 14) return '2 Weeks';
    if (days === 30) return '1 Month';
    if (days === 60) return '2 Months';
    if (days === 90) return '3 Months';
    if (days === 180) return '6 Months';
    if (days === 365) return '1 Year';
    return `${days} Days`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            ROI Calculator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Your Playing Strategy</h3>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Game Type</label>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setGameType('pick3')}
                    className={`flex-1 py-2 rounded font-semibold transition-all ${
                      gameType === 'pick3'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:text-primary'
                    }`}
                    data-testid="button-calc-pick3"
                  >
                    Pick 3
                  </button>
                  <button
                    onClick={() => setGameType('pick4')}
                    className={`flex-1 py-2 rounded font-semibold transition-all ${
                      gameType === 'pick4'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:text-primary'
                    }`}
                    data-testid="button-calc-pick4"
                  >
                    Pick 4
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Bet Amount ($)</label>
                <Select value={betAmount.toString()} onValueChange={(value) => setBetAmount(parseFloat(value))}>
                  <SelectTrigger className="w-full" data-testid="select-bet-amount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.50">$0.50</SelectItem>
                    <SelectItem value="1.00">$1.00</SelectItem>
                    <SelectItem value="2.00">$2.00</SelectItem>
                    <SelectItem value="5.00">$5.00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fireball"
                    checked={withFireball}
                    onCheckedChange={(checked) => setWithFireball(checked as boolean)}
                    data-testid="checkbox-fireball"
                  />
                  <label htmlFor="fireball" className="font-semibold cursor-pointer">
                    With Fireball (+${betAmount.toFixed(2)})
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Plays Per Day</label>
                <Select value={playsPerDay.toString()} onValueChange={(value) => setPlaysPerDay(parseInt(value))}>
                  <SelectTrigger className="w-full" data-testid="select-plays-per-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Evening only)</SelectItem>
                    <SelectItem value="2">2 (Midday & Evening)</SelectItem>
                    <SelectItem value="3">3 (Extra play)</SelectItem>
                    <SelectItem value="4">4 (Double both)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Time Period (Days)</label>
                <Select value={timePeriod.toString()} onValueChange={(value) => setTimePeriod(parseInt(value))}>
                  <SelectTrigger className="w-full" data-testid="select-time-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 Week</SelectItem>
                    <SelectItem value="14">2 Weeks</SelectItem>
                    <SelectItem value="30">1 Month</SelectItem>
                    <SelectItem value="60">2 Months</SelectItem>
                    <SelectItem value="90">3 Months</SelectItem>
                    <SelectItem value="180">6 Months</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Financial Breakdown</h3>
              
              {results && (
                <>
                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Cost Per Play</p>
                    <p className="text-2xl font-bold stat-number" data-testid="text-cost-per-play">
                      ${results.costPerPlay.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Daily Cost</p>
                    <p className="text-2xl font-bold stat-number" data-testid="text-daily-cost">
                      ${results.dailyCost.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-red-600/20 rounded-lg p-4 border-2 border-red-600">
                    <p className="text-sm text-red-300 mb-1">Total Spend ({getTimePeriodLabel(timePeriod)})</p>
                    <p className="text-3xl font-bold stat-number text-red-600" data-testid="text-total-spend">
                      ${results.totalSpend.toFixed(2)}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold mb-3 text-muted-foreground">If You Win Straight:</p>
                    
                    <div className="bg-green-600/20 rounded-lg p-4 border-2 border-green-600 mb-3">
                      <p className="text-sm text-green-300 mb-1">Payout</p>
                      <p className="text-3xl font-bold stat-number text-green-600" data-testid="text-payout">
                        ${results.payout.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4 border border-border mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                      <p className="text-2xl font-bold stat-number" data-testid="text-net-profit">
                        ${results.netProfit.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Break Even Point</p>
                      <p className="text-2xl font-bold stat-number" data-testid="text-break-even">
                        {results.breakEvenDays.toLocaleString()} days
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">(if playing same amount daily)</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30">
            <h4 className="font-bold mb-2">Understanding Your Odds</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Pick 3 Straight: 1 in 1,000 chance per play</li>
              <li>• Pick 4 Straight: 1 in 10,000 chance per play</li>
              <li>• Fireball increases your winning combinations but costs extra</li>
              <li>• Playing more frequently doesn't increase odds per play</li>
              <li>• Set a budget and play responsibly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
