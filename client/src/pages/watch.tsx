import { useState } from "react";
import { useLotteryData } from "@/hooks/use-lottery-data";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
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
  const topWatch = watchNumbers.slice(0, 10);
  
  const longestWait = pendingNumbers.reduce((max, current) => 
    (current.daysSince || 0) > (max.daysSince || 0) ? current : max, 
    pendingNumbers[0] || { daysSince: 0 } as any
  );

  const title = gameType === 'pick4' ? 'QUAD WATCH' : 'TRIPLE WATCH';
  const subtitle = gameType === 'pick4' ? 'Tracking quadruple digit patterns' : 'Tracking triple digit patterns';

  const getStatusColor = (hasHit: boolean) => {
    return hasHit ? 'bg-green-600' : 'bg-red-600';
  };

  const getStatusText = (hasHit: boolean) => {
    return hasHit ? 'Hit' : 'Pending';
  };

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
      <div className="bg-indigo-600 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Eye className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-watch-title">{title}</h2>
          <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-watch-subtitle">{subtitle}</p>
          <div className="text-5xl md:text-6xl font-bold stat-number mb-2" data-testid="text-total-watch">
            {watchNumbers.length}
          </div>
          <p className="text-lg opacity-90">Numbers being tracked</p>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">Quick Stats</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Longest Wait</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-longest-wait">
                {longestWait?.number || 'N/A'} - <span className="text-red-600">{longestWait?.daysSince || 0} days</span>
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground mb-1">Still Pending</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-pending">
                {pendingNumbers.length} numbers
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-muted-foreground mb-1">Recently Hit</p>
              <p className="text-2xl font-bold stat-number" data-testid="text-recent-hit">
                {hitNumbers.length} numbers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Watch Numbers */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 text-primary">
            Top 10 Watch List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Number</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Days Since</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Last Hit Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Draw Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topWatch.map((watch, index) => (
                  <tr 
                    key={watch.id} 
                    onClick={() => handleNumberClick(watch)}
                    className="hover:bg-muted transition-colors cursor-pointer" 
                    data-testid={`row-watch-${watch.number}`}
                  >
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold stat-number" data-testid={`text-number-${watch.number}`}>
                        {watch.number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-lg font-semibold stat-number ${watch.hasHit ? 'text-green-600' : 'text-red-600'}`} data-testid={`text-days-${watch.number}`}>
                        {watch.daysSince || 0} days
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground" data-testid={`text-date-${watch.number}`}>
                      {watch.lastHitDate ? new Date(watch.lastHitDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {watch.drawType || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-white rounded-full text-sm font-semibold ${getStatusColor(watch.hasHit)}`} data-testid={`status-${watch.number}`}>
                        {getStatusText(watch.hasHit)}
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
            Watch Numbers Preview
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
            {watchNumbers.map(watch => (
              <div
                key={watch.id}
                onClick={() => handleNumberClick(watch)}
                className={`number-card p-3 rounded text-center font-bold stat-number cursor-pointer transition-all border ${
                  watch.hasHit
                    ? 'bg-green-600/20 border-green-600 hover:bg-green-600 hover:text-white' 
                    : 'bg-red-600/20 border-red-600 hover:bg-red-600 hover:text-white'
                }`}
                data-testid={`card-watch-${watch.number}`}
              >
                {watch.number}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Showing all {watchNumbers.length} watch numbers
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Number Detail Modal */}
      {selectedWatch && (
        <NumberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          number={selectedWatch.number}
          type="watch"
          data={selectedWatch}
        />
      )}
    </div>
  );
}
