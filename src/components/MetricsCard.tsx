import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Zap, Target } from "lucide-react";

interface MetricsCardProps {
  latency?: number;
  topScore?: number;
  avgScore?: number;
}

export const MetricsCard = ({ latency, topScore, avgScore }: MetricsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latency</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latency ? `${latency}ms` : '—'}</div>
          <p className="text-xs text-muted-foreground">
            {latency && latency < 2000 ? 'Excellent' : 'Response time'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Match</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topScore ? `${(topScore * 100).toFixed(1)}%` : '—'}
          </div>
          <p className="text-xs text-muted-foreground">
            {topScore && topScore > 0.7 ? 'Strong match' : 'Similarity score'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgScore ? `${(avgScore * 100).toFixed(1)}%` : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Top 3 average</p>
        </CardContent>
      </Card>
    </div>
  );
};
