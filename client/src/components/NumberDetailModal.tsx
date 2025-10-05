import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Repeat, Eye } from "lucide-react";

interface NumberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: string;
  type: 'gap' | 'streak' | 'repeat' | 'watch';
  data: any;
}

export default function NumberDetailModal({ isOpen, onClose, number, type, data }: NumberDetailModalProps) {
  if (!data) return null;

  const getIcon = () => {
    switch (type) {
      case 'gap': return <TrendingDown className="w-8 h-8 text-red-600" />;
      case 'streak': return <TrendingUp className="w-8 h-8 text-green-600" />;
      case 'repeat': return <Repeat className="w-8 h-8 text-purple-600" />;
      case 'watch': return <Eye className="w-8 h-8 text-indigo-600" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'gap': return 'Gap Details';
      case 'streak': return 'Streak Details';
      case 'repeat': return 'Repeat Pattern Details';
      case 'watch': return 'Watch Details';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'gap': return 'border-red-600';
      case 'streak': return 'border-green-600';
      case 'repeat': return 'border-purple-600';
      case 'watch': return 'border-indigo-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-number-detail">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Number Display */}
          <div className="text-center py-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
            <div className="text-6xl font-bold stat-number mb-2" data-testid="text-modal-number">
              {number}
            </div>
            <p className="text-muted-foreground">
              {type === 'gap' && 'Number in Drought'}
              {type === 'streak' && 'Hot Streak Number'}
              {type === 'repeat' && 'Repeat Pattern'}
              {type === 'watch' && (data.pattern ? `${data.pattern.length === 4 ? 'Quad' : 'Triple'} Pattern` : 'Watch Pattern')}
            </p>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === 'gap' && (
              <>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Days Since Hit</p>
                    <p className="text-3xl font-bold text-red-600" data-testid="text-modal-days">
                      {data.daysSinceHit} days
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Last Hit Date</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-last-hit">
                      {data.lastHitDate ? new Date(data.lastHitDate).toLocaleDateString() : 'Never'}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="text-xl font-semibold capitalize" data-testid="text-modal-status">
                      {data.status}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Draw Type</p>
                    <p className="text-xl font-semibold capitalize" data-testid="text-modal-draw-type">
                      {data.drawType || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {type === 'streak' && (
              <>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Hit Count</p>
                    <p className="text-3xl font-bold text-green-600" data-testid="text-modal-hits">
                      {data.hitCount} times
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Period</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-period">
                      {data.periodDays} days
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                    <p className="text-xl font-semibold text-green-600" data-testid="text-modal-frequency">
                      {data.frequency}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Last Hit</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-last-hit">
                      {data.lastHit ? new Date(data.lastHit).toLocaleDateString() : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="text-xl font-semibold capitalize" data-testid="text-modal-status">
                      {data.status}
                      {data.status === 'hot' && <span className="ml-2 text-sm">🔥</span>}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {type === 'repeat' && (
              <>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pattern Type</p>
                    <p className="text-xl font-semibold capitalize" data-testid="text-modal-pattern-type">
                      {data.patternType?.replace('_', ' ')}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Occurrences</p>
                    <p className="text-3xl font-bold text-purple-600" data-testid="text-modal-occurrences">
                      {data.occurrences} hits
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()} md:col-span-2`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Date Range</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-date-range">
                      {data.dateRange}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()} md:col-span-2`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-description">
                      {data.description}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {type === 'watch' && (
              <>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className={`text-xl font-semibold ${data.hasHit ? 'text-green-600' : 'text-red-600'}`} data-testid="text-modal-status">
                      {data.hasHit ? 'Hit' : 'Pending'}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Days Since Last</p>
                    <p className="text-3xl font-bold" data-testid="text-modal-days-since">
                      {data.daysSince || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Last Hit Date</p>
                    <p className="text-xl font-semibold" data-testid="text-modal-last-hit-date">
                      {data.lastHitDate ? new Date(data.lastHitDate).toLocaleDateString() : 'Never'}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${getColor()}`}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Draw Type</p>
                    <p className="text-xl font-semibold capitalize" data-testid="text-modal-draw-type">
                      {data.drawType || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
