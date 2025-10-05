import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import NumberDetailModal from "@/components/NumberDetailModal";

export default function WatchPage() {
  const { gameType, watchNumbers, isLoading } = useLotteryData();
  const [selectedWatch, setSelectedWatch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNumberClick = (watch: any) => {
    setSelectedWatch(watch);
    setIsModalOpen(true);
  };

  const pendingNumbers = watchNumbers.filter(n => !n.hasHit);
  const hitNumbers = watchNumbers.filter(n => n.hasHit);
  const longestWait = pendingNumbers.reduce((max, current) => 
    (current.daysSince || 0) > (max.daysSince || 0) ? current : max, 
    pendingNumbers[0] || { daysSince: 0 } as any
  );

  const title = gameType === 'pick4' ? 'QUAD WATCH' : 'TRIPLE WATCH';
  const subtitle = gameType === 'pick4' ? 'Tracking quadruple digit patterns' : 'Tracking triple digit patterns';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading watch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Stats */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <i className="fas fa-eye text-4xl md:text-5xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-watch-title">{title}</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-watch-subtitle">{subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold stat-number" data-testid="text-total-patterns">
                {watchNumbers.length}
              </div>
              <p className="text-sm opacity-90 mt-1">Total {gameType === 'pick4' ? 'Quads' : 'Triples'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold stat-number" data-testid="text-pending-patterns">
                {pendingNumbers.length}
              </div>
              <p className="text-sm opacity-90 mt-1">Still Pending</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold stat-number" data-testid="text-hit-patterns">
                {hitNumbers.length}
              </div>
              <p className="text-sm opacity-90 mt-1">Already Hit</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold stat-number" data-testid="text-longest-wait">
                {longestWait.daysSince || 0}
              </div>
              <p className="text-sm opacity-90 mt-1">Longest Wait</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Patterns Grid */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-th-large text-primary"></i>
            All {gameType === 'pick4' ? 'Quadruple' : 'Triple'} Patterns
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {watchNumbers.map(pattern => (
              <div 
                key={pattern.id}
                onClick={() => handleNumberClick(pattern)}
                className={`bg-muted rounded-lg p-4 border-2 transition-all number-card text-center cursor-pointer ${
                  pattern.hasHit 
                    ? 'border-green-600 hover:border-green-600' 
                    : 'border-border hover:border-red-600'
                }`}
                data-testid={`card-pattern-${pattern.pattern}`}
              >
                <div className="text-3xl font-bold stat-number mb-2" data-testid={`text-pattern-number-${pattern.pattern}`}>
                  {pattern.pattern}
                </div>
                <div className="text-sm text-muted-foreground mb-1" data-testid={`text-pattern-last-${pattern.pattern}`}>
                  Last: {pattern.lastHitDate ? new Date(pattern.lastHitDate).toLocaleDateString() : 'Never'}
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${
                  pattern.hasHit ? 'bg-green-600' : 'bg-red-600'
                }`} data-testid={`status-pattern-${pattern.pattern}`}>
                  {pattern.hasHit ? 'Hit' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-line text-primary"></i>
            Detailed History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Last Hit Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Days Since</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Draw Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {watchNumbers.map((pattern, index) => (
                  <tr 
                    key={pattern.id} 
                    onClick={() => handleNumberClick(pattern)}
                    className="hover:bg-muted transition-colors cursor-pointer" 
                    data-testid={`row-pattern-${pattern.pattern}`}
                  >
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold stat-number" data-testid={`text-table-pattern-${pattern.pattern}`}>
                        {pattern.pattern}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        pattern.hasHit ? 'bg-green-600' : 'bg-red-600'
                      }`} data-testid={`status-table-${pattern.pattern}`}>
                        {pattern.hasHit ? 'Hit' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${!pattern.lastHitDate ? 'text-muted-foreground' : ''}`} data-testid={`text-table-date-${pattern.pattern}`}>
                        {pattern.lastHitDate ? new Date(pattern.lastHitDate).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`${pattern.hasHit ? 'text-muted-foreground' : 'text-red-600 font-semibold'}`} data-testid={`text-table-days-${pattern.pattern}`}>
                        {pattern.daysSince ? `${pattern.daysSince} days ago` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${!pattern.drawType ? 'text-muted-foreground' : ''}`} data-testid={`text-table-draw-type-${pattern.pattern}`}>
                        {pattern.drawType ? pattern.drawType.charAt(0).toUpperCase() + pattern.drawType.slice(1) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Number Detail Modal */}
      {selectedWatch && (
        <NumberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          number={selectedWatch.pattern}
          type="watch"
          data={selectedWatch}
        />
      )}
    </div>
  );
}
