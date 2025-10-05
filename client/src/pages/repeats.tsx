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
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Repeat className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-repeats-title">REPEATS</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-repeats-subtitle">Numbers hitting multiple times</p>
          <div className="text-6xl md:text-8xl font-bold stat-number mb-2" data-testid="text-recent-repeats">
            {stats?.recentRepeats || 0}
          </div>
          <p className="text-xl opacity-90">Recent repeat patterns</p>
        </div>
      </div>

      {/* Categorized Repeats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Within 7 Days */}
        <Card className="border-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <i className="fas fa-calendar-week"></i>
                Within 7 Days
              </h3>
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {weeklyRepeats.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Numbers that repeated within a week</p>
            <div className="space-y-2">
              {weeklyRepeats.slice(0, 3).map(repeat => (
                <div 
                  key={repeat.id} 
                  onClick={() => handleNumberClick(repeat)}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted transition-colors rounded px-2"
                >
                  <span className="text-lg font-bold stat-number" data-testid={`text-weekly-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground">{repeat.occurrences} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back-to-Back */}
        <Card className="border-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                <i className="fas fa-link"></i>
                Back-to-Back
              </h3>
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {consecutiveRepeats.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Consecutive draw repeats</p>
            <div className="space-y-2">
              {consecutiveRepeats.slice(0, 3).map(repeat => (
                <div 
                  key={repeat.id} 
                  onClick={() => handleNumberClick(repeat)}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted transition-colors rounded px-2"
                >
                  <span className="text-lg font-bold stat-number" data-testid={`text-consecutive-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground">{repeat.occurrences} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Same Day */}
        <Card className="border-pink-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2">
                <i className="fas fa-calendar-day"></i>
                Same Day
              </h3>
              <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {sameDayRepeats.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Repeated on same day (Midday & Evening)</p>
            <div className="space-y-2">
              {sameDayRepeats.slice(0, 3).map(repeat => (
                <div 
                  key={repeat.id} 
                  onClick={() => handleNumberClick(repeat)}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted transition-colors rounded px-2"
                >
                  <span className="text-lg font-bold stat-number" data-testid={`text-sameday-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground">{repeat.occurrences} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Repeat Patterns Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Repeat className="w-6 h-6 text-primary" />
            Recent Repeat Patterns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Pattern</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Occurrences</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date Range</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {repeats.slice(0, 20).map(repeat => {
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
