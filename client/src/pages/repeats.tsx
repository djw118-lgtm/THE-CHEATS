import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Repeat } from "lucide-react";

export default function RepeatsPage() {
  const { gameType, repeats, stats, isLoading } = useLotteryData();

  const weeklyRepeats = repeats.filter(r => r.patternType === 'weekly');
  const consecutiveRepeats = repeats.filter(r => r.patternType === 'consecutive');
  const sameDayRepeats = repeats.filter(r => r.patternType === 'same_day');

  const getPatternColor = (patternType: string) => {
    switch (patternType) {
      case 'weekly': return 'bg-blue-600';
      case 'consecutive': return 'bg-purple-600';
      case 'same_day': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  const getPatternIcon = (patternType: string) => {
    switch (patternType) {
      case 'weekly': return 'fas fa-calendar-week';
      case 'consecutive': return 'fas fa-link';
      case 'same_day': return 'fas fa-calendar-day';
      default: return 'fas fa-redo';
    }
  };

  const getPatternTitle = (patternType: string) => {
    switch (patternType) {
      case 'weekly': return 'Within 7 Days';
      case 'consecutive': return 'Back-to-Back';
      case 'same_day': return 'Same Day';
      default: return 'Unknown';
    }
  };

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

      {/* Quick Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Quick Stats</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Latest Repeat</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-latest-repeat">
                {repeats[0] ? (
                  <>
                    {repeats[0].number} - <span className="text-blue-600">{repeats[0].description}</span>
                  </>
                ) : (
                  'No recent repeats'
                )}
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Most Recent Back-to-Back</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-recent-consecutive">
                {consecutiveRepeats[0]?.number || 'None'} - {consecutiveRepeats[0]?.description || 'No data'}
              </p>
            </div>
            <div className="border-l-4 border-pink-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Same Day Double</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-same-day">
                {sameDayRepeats[0]?.number || 'None'} - {sameDayRepeats[0]?.description || 'No data'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repeat Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className={`border transition-all hover:border-blue-600`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-calendar-week text-blue-600"></i>
                Within 7 Days
              </h3>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold" data-testid="count-weekly">
                {weeklyRepeats.length}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Numbers that repeated within a week</p>
            <div className="space-y-2">
              {weeklyRepeats.slice(0, 3).map(repeat => (
                <div key={repeat.id} className="flex justify-between items-center p-2 bg-muted rounded" data-testid={`card-weekly-${repeat.number}`}>
                  <span className="font-bold stat-number" data-testid={`text-weekly-number-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground" data-testid={`text-weekly-occurrences-${repeat.number}`}>
                    {repeat.occurrences} times
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`border transition-all hover:border-purple-600`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-link text-purple-600"></i>
                Back-to-Back
              </h3>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold" data-testid="count-consecutive">
                {consecutiveRepeats.length}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Consecutive draw repeats</p>
            <div className="space-y-2">
              {consecutiveRepeats.slice(0, 3).map(repeat => (
                <div key={repeat.id} className="flex justify-between items-center p-2 bg-muted rounded" data-testid={`card-consecutive-${repeat.number}`}>
                  <span className="font-bold stat-number" data-testid={`text-consecutive-number-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground" data-testid={`text-consecutive-description-${repeat.number}`}>
                    {repeat.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`border transition-all hover:border-pink-600`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-calendar-day text-pink-600"></i>
                Same Day
              </h3>
              <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold" data-testid="count-same-day">
                {sameDayRepeats.length}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Repeated on same day (Midday & Evening)</p>
            <div className="space-y-2">
              {sameDayRepeats.slice(0, 3).map(repeat => (
                <div key={repeat.id} className="flex justify-between items-center p-2 bg-muted rounded" data-testid={`card-same-day-${repeat.number}`}>
                  <span className="font-bold stat-number" data-testid={`text-same-day-number-${repeat.number}`}>{repeat.number}</span>
                  <span className="text-sm text-muted-foreground" data-testid={`text-same-day-occurrences-${repeat.number}`}>
                    {repeat.occurrences} times
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Repeat History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-history text-primary"></i>
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
                {repeats.map(repeat => (
                  <tr key={repeat.id} className="hover:bg-muted transition-colors" data-testid={`row-repeat-${repeat.number}`}>
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold stat-number" data-testid={`text-table-number-${repeat.number}`}>
                        {repeat.number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold" data-testid={`text-table-pattern-${repeat.number}`}>
                        {repeat.description}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-blue-600" data-testid={`text-table-occurrences-${repeat.number}`}>
                        {repeat.occurrences} hits
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground" data-testid={`text-table-date-range-${repeat.number}`}>
                      {repeat.dateRange}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getPatternColor(repeat.patternType)}`} data-testid={`status-table-${repeat.number}`}>
                        {getPatternTitle(repeat.patternType)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
