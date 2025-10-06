import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Repeat } from "lucide-react";
import NumberDetailModal from "@/components/NumberDetailModal";

export default function RepeatsPage() {
  const { gameType, repeats, stats, isLoading } = useLotteryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("occurrences-desc");
  const [selectedRepeat, setSelectedRepeat] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNumberClick = (repeat: any) => {
    setSelectedRepeat(repeat);
    setIsModalOpen(true);
  };

  // Filter and sort repeats
  const filteredRepeats = repeats
    .filter(repeat => {
      if (searchTerm && !repeat.number.includes(searchTerm)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "occurrences-desc":
          return b.occurrences - a.occurrences;
        case "occurrences-asc":
          return a.occurrences - b.occurrences;
        case "number":
          return a.number.localeCompare(b.number);
        default:
          return 0;
      }
    });

  const topRepeats = filteredRepeats.slice(0, 10);
  const weeklyRepeats = repeats.filter(r => r.patternType === 'weekly');
  const consecutiveRepeats = repeats.filter(r => r.patternType === 'consecutive');
  const sameDayRepeats = repeats.filter(r => r.patternType === 'same_day');

  const getPatternTypeColor = (patternType: string) => {
    switch (patternType) {
      case 'weekly': return 'bg-blue-600';
      case 'consecutive': return 'bg-purple-600';
      case 'same_day': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  const getPatternTypeLabel = (patternType: string) => {
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
                data-testid="input-search-repeats"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occurrences-desc">Occurrences (High to Low)</SelectItem>
                <SelectItem value="occurrences-asc">Occurrences (Low to High)</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Repeat Patterns */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            Top 10 Longest Repeat Patterns
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
                {topRepeats.map((repeat, index) => (
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
                      <span className="text-lg font-semibold text-purple-600 stat-number" data-testid={`text-occurrences-${repeat.number}`}>
                        {repeat.occurrences} hits
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground" data-testid={`text-date-${repeat.number}`}>
                      {repeat.dateRange}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getPatternTypeColor(repeat.patternType)}`} data-testid={`status-${repeat.number}`}>
                        {getPatternTypeLabel(repeat.patternType)}
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
            Recent Repeats Preview
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
            {filteredRepeats.slice(0, 40).map(repeat => (
              <div
                key={repeat.id}
                onClick={() => handleNumberClick(repeat)}
                className={`number-card p-3 rounded text-center font-bold stat-number cursor-pointer transition-all border ${
                  repeat.patternType === 'weekly' 
                    ? 'bg-blue-600/20 border-blue-600 hover:bg-blue-600 hover:text-white' 
                    : repeat.patternType === 'consecutive'
                    ? 'bg-purple-600/20 border-purple-600 hover:bg-purple-600 hover:text-white'
                    : 'bg-pink-600/20 border-pink-600 hover:bg-pink-600 hover:text-white'
                }`}
                data-testid={`card-repeat-${repeat.number}`}
              >
                {repeat.number}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Showing {Math.min(40, filteredRepeats.length)} of {filteredRepeats.length} repeats
            </p>
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
