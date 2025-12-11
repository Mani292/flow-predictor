import React from 'react';
import { AlternativeRoute } from '@/types/traffic';
import CongestionBadge from './CongestionBadge';
import { Clock, Route, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlternativeRouteListProps {
  routes: AlternativeRoute[];
  onSelect?: (routeId: string) => void;
  className?: string;
}

const AlternativeRouteList: React.FC<AlternativeRouteListProps> = ({ 
  routes, 
  onSelect,
  className 
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Alternative Routes</h3>
      
      {routes.map((route, index) => {
        const timeDiff = route.currentTime - route.predictedTime;
        
        return (
          <div
            key={route.id}
            onClick={() => onSelect?.(route.id)}
            className={cn(
              'relative group rounded-xl border p-4 cursor-pointer transition-all duration-300',
              route.isFastest 
                ? 'border-congestion-low bg-congestion-low/5 glow-low' 
                : 'border-border/50 bg-card/60 hover:border-border'
            )}
            style={{ 
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Fastest badge */}
            {route.isFastest && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-congestion-low text-primary-foreground text-xs font-medium rounded-full">
                <Star className="w-3 h-3" />
                Fastest
              </div>
            )}
            
            {/* Route color indicator */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              style={{ backgroundColor: route.color }}
            />
            
            <div className="pl-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{route.summary}</span>
                </div>
                <CongestionBadge level={route.congestionLevel} size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{route.distance}</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-mono">{route.predictedTime} min</span>
                  </div>
                </div>
                
                {timeDiff !== 0 && (
                  <div className={cn(
                    'flex items-center gap-1 text-xs font-medium',
                    timeDiff > 0 ? 'text-congestion-low' : 'text-congestion-high'
                  )}>
                    <TrendingUp className={cn('w-3 h-3', timeDiff < 0 && 'rotate-180')} />
                    <span>{timeDiff > 0 ? '-' : '+'}{Math.abs(timeDiff)} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlternativeRouteList;
