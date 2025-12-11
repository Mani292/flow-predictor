import React from 'react';
import { Route } from '@/types/traffic';
import CongestionBadge from './CongestionBadge';
import { MapPin, Navigation, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouteCardProps {
  route: Route;
  onClick: () => void;
  isSelected?: boolean;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onClick, isSelected }) => {
  const timeDiff = route.currentTravelTime - route.predictedTravelTime;
  const isPositive = timeDiff > 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80',
        isSelected && 'border-primary bg-card/90 glow-primary'
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {route.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{route.distance}</p>
          </div>
          <CongestionBadge level={route.congestionLevel} size="sm" />
        </div>

        {/* Route details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{route.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{route.destination}</span>
          </div>
        </div>

        {/* Time comparison */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-mono">{route.predictedTravelTime} min</span>
            </div>
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isPositive ? 'text-congestion-low' : 'text-congestion-high'
            )}>
              <TrendingUp className={cn('w-3 h-3', !isPositive && 'rotate-180')} />
              <span>{isPositive ? '-' : '+'}{Math.abs(timeDiff)} min</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
