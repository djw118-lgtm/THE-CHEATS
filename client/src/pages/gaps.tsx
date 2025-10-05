import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown } from "lucide-react";
import NumberDetailModal from "@/components/NumberDetailModal";

export default function GapsPage() {
  const { gameType, gaps, stats, isLoading } = useLotteryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("days-desc");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [selectedGap, setSelectedGap] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNumberClick = (gap: any) => {
    setSelectedGap(gap);
    setIsModalOpen(true);
  };

  // Filter and sort gaps
  const filteredGaps = gaps
    .filter(gap => {
      if (searchTerm && !gap.number.includes(searchTerm)) return false;
      
      if (rangeFilter !== "all") {
        const num = parseInt(gap.number);
        const [min, max] = rangeFilter.split("-").map(Number);
        if (num < min || num > max) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "days-desc":
          return b.daysSinceHit - a.daysSinceHit;
        case "days-asc":
          return a.daysSinceHit - b.daysSinceHit;
        case "number":
          return a.number.localeCompare(b.number);
        default:
          return 0;
      }
    });

  const topDroughts = filteredGaps.slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading gaps data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Stats */}
      <div className="bg-red-600 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <TrendingDown className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-gaps-title">GAPS</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-gaps-subtitle">Numbers that haven't hit</p>
          <div className="text-5xl md:text-6xl font-bold stat-number mb-2" data-testid="text-total-gaps">
            {stats?.totalGaps || 0}
          </div>
          <p className="text-lg opacity-90">Total numbers in drought</p>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Quick Stats</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Longest Drought</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-longest-drought">
                {stats?.longestDrought ? (
                  <>
                    {stats.longestDrought.number} - <span className="text-red-600">{stats.longestDrought.days} days</span>
                  </>
                ) : (
                  'No data available'
                )}
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground mb-1">Average Gap</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-average-gap">
                {gaps.length > 0 ? Math.round(gaps.reduce((sum, gap) => sum + gap.daysSinceHit, 0) / gaps.length) : 0} days
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Recently Broken</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-recently-broken">
                {gaps.find(gap => gap.daysSinceHit < 30)?.number || 'None recent'}
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
                data-testid="input-search-gaps"
              />
            </div>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-range-filter">
                <SelectValue placeholder="All Ranges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                {gameType === 'pick4' ? (
                  <>
                    <SelectItem value="0-2499">0000-2499</SelectItem>
                    <SelectItem value="2500-4999">2500-4999</SelectItem>
                    <SelectItem value="5000-7499">5000-7499</SelectItem>
                    <SelectItem value="7500-9999">7500-9999</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="0-249">000-249</SelectItem>
                    <SelectItem value="250-499">250-499</SelectItem>
                    <SelectItem value="500-749">500-749</SelectItem>
                    <SelectItem value="750-999">750-999</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days-desc">Days (High to Low)</SelectItem>
                <SelectItem value="days-asc">Days (Low to High)</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top Droughts */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            Top 10 Longest Droughts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Days Since Hit</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Last Hit Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topDroughts.map((gap, index) => (
                  <tr 
                    key={gap.id} 
                    onClick={() => handleNumberClick(gap)}
                    className="hover:bg-muted transition-colors cursor-pointer" 
                    data-testid={`row-drought-${gap.number}`}
                  >
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold stat-number" data-testid={`text-number-${gap.number}`}>
                        {gap.number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-semibold text-red-600 stat-number" data-testid={`text-days-${gap.number}`}>
                        {gap.daysSinceHit} days
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground" data-testid={`text-date-${gap.number}`}>
                      {gap.lastHitDate ? new Date(gap.lastHitDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getStatusColor(gap.status)}`} data-testid={`status-${gap.number}`}>
                        {getStatusText(gap.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Number Grid Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            Recent Gaps Preview
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
            {filteredGaps.slice(0, 40).map(gap => (
              <div
                key={gap.id}
                onClick={() => handleNumberClick(gap)}
                className={`number-card p-3 rounded text-center font-bold stat-number cursor-pointer transition-all border ${
                  gap.status === 'critical' 
                    ? 'bg-red-600/20 border-red-600 hover:bg-red-600 hover:text-white' 
                    : gap.status === 'high'
                    ? 'bg-orange-600/20 border-orange-600 hover:bg-orange-600 hover:text-white'
                    : 'bg-muted border-border hover:bg-primary hover:text-primary-foreground'
                }`}
                data-testid={`card-gap-${gap.number}`}
              >
                {gap.number}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Showing {Math.min(40, filteredGaps.length)} of {filteredGaps.length} gaps
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Number Detail Modal */}
      {selectedGap && (
        <NumberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          number={selectedGap.number}
          type="gap"
          data={selectedGap}
        />
      )}
    </div>
  );
}
