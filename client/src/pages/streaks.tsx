import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";

export default function StreaksPage() {
  const { gameType, streaks, stats, isLoading } = useLotteryData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-green-600';
      case 'warm': return 'bg-yellow-600';
      case 'cooling': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot': return 'fas fa-fire';
      case 'warm': return 'fas fa-temperature-high';
      case 'cooling': return 'fas fa-snowflake';
      default: return 'fas fa-thermometer-half';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading streaks data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Stats */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <i className="fas fa-fire text-4xl md:text-5xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-streaks-title">STREAKS</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-streaks-subtitle">Hot numbers on fire</p>
          <div className="text-6xl md:text-8xl font-bold stat-number mb-2" data-testid="text-active-streaks">
            {stats?.activeStreaks || 0}
          </div>
          <p className="text-xl opacity-90">Active hot streaks</p>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Quick Stats</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Hottest Streak</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-hottest-streak">
                {stats?.hottestStreak ? (
                  <>
                    {stats.hottestStreak.number} - <span className="text-green-600">{stats.hottestStreak.frequency}</span>
                  </>
                ) : (
                  'No active streaks'
                )}
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground mb-1">Most Recent Hot Number</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-recent-hot">
                {streaks[0]?.number || 'None'} - {streaks[0]?.frequency || 'No data'}
              </p>
            </div>
            <div className="border-l-4 border-yellow-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Cooling Down</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-cooling">
                {streaks.find(s => s.status === 'cooling')?.number || 'None'} - {streaks.find(s => s.status === 'cooling')?.frequency || 'No data'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Streaks */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-fire text-green-600"></i>
            Active Hot Streaks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streaks.slice(0, 9).map(streak => (
              <div 
                key={streak.id} 
                className={`bg-muted rounded-lg p-4 border transition-all number-card hover:border-${streak.status === 'hot' ? 'green' : 'yellow'}-600`}
                data-testid={`card-streak-${streak.number}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold stat-number" data-testid={`text-streak-number-${streak.number}`}>
                    {streak.number}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 text-white ${getStatusColor(streak.status)}`}>
                    <i className={`${getStatusIcon(streak.status)} text-xs`}></i>
                    {streak.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hits:</span>
                    <span className="font-bold" data-testid={`text-hits-${streak.number}`}>{streak.hitCount} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span className="font-bold" data-testid={`text-period-${streak.number}`}>{streak.periodDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className={`font-bold ${streak.status === 'hot' ? 'text-green-600' : 'text-yellow-600'}`} data-testid={`text-frequency-${streak.number}`}>
                      {streak.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Hit:</span>
                    <span className="font-bold" data-testid={`text-last-hit-${streak.number}`}>
                      {new Date(streak.lastHit).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-primary"></i>
            All Streaks Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Hits</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Period</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Frequency</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Last Hit</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {streaks.map(streak => (
                  <tr key={streak.id} className="hover:bg-muted transition-colors" data-testid={`row-streak-${streak.number}`}>
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold stat-number" data-testid={`text-table-number-${streak.number}`}>
                        {streak.number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-green-600" data-testid={`text-table-hits-${streak.number}`}>
                        {streak.hitCount} times
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold" data-testid={`text-table-period-${streak.number}`}>
                        {streak.periodDays} days
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold" data-testid={`text-table-frequency-${streak.number}`}>
                        {streak.frequency}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground" data-testid={`text-table-last-hit-${streak.number}`}>
                      {new Date(streak.lastHit).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getStatusColor(streak.status)}`} data-testid={`status-table-${streak.number}`}>
                        {streak.isActive ? streak.status.charAt(0).toUpperCase() + streak.status.slice(1) : 'Ended'}
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
