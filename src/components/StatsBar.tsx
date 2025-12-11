import React from 'react';
import { Route } from '@/types/traffic';
import { TrendingUp, Clock, AlertTriangle, Activity } from 'lucide-react';

interface StatsBarProps {
  routes: Route[];
}

const StatsBar: React.FC<StatsBarProps> = ({ routes }) => {
  const avgPredictedTime = Math.round(
    routes.reduce((acc, r) => acc + r.predictedTravelTime, 0) / routes.length
  );
  
  const highCongestionCount = routes.filter(r => r.congestionLevel === 'High').length;
  const avgConfidence = Math.round(
    routes.reduce((acc, r) => acc + r.confidence, 0) / routes.length
  );

  const stats = [
    {
      icon: Activity,
      label: 'Active Routes',
      value: routes.length,
      color: 'text-primary',
    },
    {
      icon: Clock,
      label: 'Avg. Travel Time',
      value: `${avgPredictedTime} min`,
      color: 'text-muted-foreground',
    },
    {
      icon: AlertTriangle,
      label: 'High Congestion',
      value: highCongestionCount,
      color: 'text-congestion-high',
    },
    {
      icon: TrendingUp,
      label: 'Model Accuracy',
      value: `${avgConfidence}%`,
      color: 'text-congestion-low',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="glass rounded-xl p-4 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-xl font-bold font-mono">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
