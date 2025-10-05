import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import NumberDetailModal from "@/components/NumberDetailModal";

export default function StreaksPage() {
  const { gameType, streaks, stats, isLoading } = useLotteryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("hits-desc");
  const [selectedStreak, setSelectedStreak] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNumberClick = (streak: any) => {
    setSelectedStreak(streak);
    setIsModalOpen(true);
  };

  // Filter and sort streaks
  const filteredStreaks = streaks
    .filter(streak => {
      if (searchTerm && !streak.number.includes(searchTerm)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hits-desc":
          return b.hitCount - a.hitCount;
        case "hits-asc":
          return a.hitCount - b.hitCount;
        case "number":
          return a.number.localeCompare(b.number);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-green-600';
      case 'warm': return 'bg-yellow-600';
      case 'cooling': return 'bg-orange-600';
      default: return 'bg-gray-600';
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
      <div className="bg-green-600 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-streaks-title">STREAKS</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-streaks-subtitle">Hot numbers on fire</p>
          <div className="text-5xl md:text-6xl font-bold stat-number mb-2" data-testid="text-active-streaks">
            {stats?.activeStreaks || 0}
          </div>
          <p className="text-lg opacity-90">Active hot streaks</p>
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

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-streaks"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hits-desc">Hits (High to Low)</SelectItem>
                <SelectItem value="hits-asc">Hits (Low to High)</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Historical Analysis */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            All Streaks Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Hits</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Period</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Frequency</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Last Hit</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStreaks.map((streak, index) => (
                  <tr 
                    key={streak.id} 
                    onClick={() => handleNumberClick(streak)}
                    className="hover:bg-muted transition-colors cursor-pointer" 
                    data-testid={`row-streak-${streak.number}`}
                  >
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
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

      {/* Recent Streaks Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Recent Streaks Preview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {filteredStreaks.slice(0, 40).map((streak) => (
              <div
                key={streak.id}
                onClick={() => handleNumberClick(streak)}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all border-2 ${
                  getStatusColor(streak.status)
                } text-white font-bold hover:scale-105`}
                data-testid={`box-streak-${streak.number}`}
              >
                {streak.number}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">Showing {Math.min(filteredStreaks.length, 40)} of {filteredStreaks.length} hot streaks</p>
        </CardContent>
      </Card>

      {/* Number Detail Modal */}
      {selectedStreak && (
        <NumberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          number={selectedStreak.number}
          type="streak"
          data={selectedStreak}
        />
      )}
    </div>
  );
}
