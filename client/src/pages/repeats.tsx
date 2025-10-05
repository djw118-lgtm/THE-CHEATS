import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Repeat } from "lucide-react";
import NumberDetailModal from "@/components/NumberDetailModal";

export default function RepeatsPage() {
  const { gameType, repeats, stats, isLoading } = useLotteryData();
  const [selectedRepeat, setSelectedRepeat] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNumberClick = (repeat: any) => {
    setSelectedRepeat(repeat);
    setIsModalOpen(true);
  };

  const weeklyRepeats = repeats.filter(r => r.patternType === 'weekly');
  const consecutiveRepeats = repeats.filter(r => r.patternType === 'consecutive');
  const sameDayRepeats = repeats.filter(r => r.patternType === 'same_day');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading repeats data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Stats */}
      <div className="bg-purple-600 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Repeat className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-repeats-title">REPEATS</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-repeats-subtitle">Numbers hitting multiple times</p>
          <div className="text-5xl md:text-6xl font-bold stat-number mb-2" data-testid="text-recent-repeats">
            {stats?.recentRepeats || 0}
          </div>
          <p className="text-lg opacity-90">Recent repeat patterns</p>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Quick Stats</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Within 7 Days</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-weekly">
                {weeklyRepeats.length} patterns
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Back-to-Back</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-consecutive">
                {consecutiveRepeats.length} patterns
              </p>
            </div>
            <div className="border-l-4 border-pink-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Same Day</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-sameday">
                {sameDayRepeats.length} patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Repeat Patterns Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            Recent Repeat Patterns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Pattern</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Occurrences</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date Range</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {repeats.slice(0, 20).map((repeat, index) => {
                  const getPatternTypeColor = () => {
                    switch (repeat.patternType) {
                      case 'weekly': return 'bg-blue-600';
                      case 'consecutive': return 'bg-purple-600';
                      case 'same_day': return 'bg-pink-600';
                      default: return 'bg-gray-600';
                    }
                  };

                  const getPatternTypeLabel = () => {
                    switch (repeat.patternType) {
                      case 'weekly': return 'Within 7 Days';
                      case 'consecutive': return 'Back-to-Back';
                      case 'same_day': return 'Same Day';
                      default: return 'Unknown';
                    }
                  };

                  return (
                    <tr 
                      key={repeat.id} 
                      onClick={() => handleNumberClick(repeat)}
                      className="hover:bg-muted transition-colors cursor-pointer" 
                      data-testid={`row-repeat-${repeat.number}`}
                    >
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xl font-bold stat-number" data-testid={`text-number-${repeat.number}`}>
                          {repeat.number}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {repeat.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-blue-600" data-testid={`text-occurrences-${repeat.number}`}>
                          {repeat.occurrences} hits
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground" data-testid={`text-daterange-${repeat.number}`}>
                        {repeat.dateRange}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getPatternTypeColor()}`} data-testid={`type-${repeat.number}`}>
                          {getPatternTypeLabel()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Number Detail Modal */}
      {selectedRepeat && (
        <NumberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          number={selectedRepeat.number}
          type="repeat"
          data={selectedRepeat}
        />
      )}
    </div>
  );
}
