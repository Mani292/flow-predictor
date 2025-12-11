import React from 'react';
import { Route, AlternativeRoute } from '@/types/traffic';
import { cn } from '@/lib/utils';

interface MapViewProps {
  routes?: Route[];
  alternativeRoutes?: AlternativeRoute[];
  selectedRouteId?: string;
  onRouteClick?: (routeId: string) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  routes = [], 
  alternativeRoutes = [],
  selectedRouteId,
  onRouteClick,
  className 
}) => {
  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden', className)}>
      {/* Map background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Radial glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_70%)]" />
      </div>

      {/* Simulated route lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
        {/* Background routes */}
        {routes.map((route, index) => {
          const isSelected = route.id === selectedRouteId;
          const yOffset = 100 + index * 60;
          
          // Determine color based on congestion
          let strokeColor = 'hsl(var(--congestion-low))';
          if (route.congestionLevel === 'Medium') strokeColor = 'hsl(var(--congestion-medium))';
          if (route.congestionLevel === 'High') strokeColor = 'hsl(var(--congestion-high))';
          
          return (
            <g 
              key={route.id} 
              onClick={() => onRouteClick?.(route.id)}
              className="cursor-pointer"
            >
              {/* Glow effect for selected route */}
              {isSelected && (
                <path
                  d={`M 50 ${yOffset} Q 150 ${yOffset - 30} 250 ${yOffset + 20} T 450 ${yOffset - 10} T 550 ${yOffset}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="blur(8px)"
                />
              )}
              
              {/* Main route line */}
              <path
                d={`M 50 ${yOffset} Q 150 ${yOffset - 30} 250 ${yOffset + 20} T 450 ${yOffset - 10} T 550 ${yOffset}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isSelected ? 5 : 3}
                strokeLinecap="round"
                opacity={isSelected ? 1 : 0.6}
                className="transition-all duration-300 hover:opacity-100"
              />
              
              {/* Start point */}
              <circle
                cx="50"
                cy={yOffset}
                r={isSelected ? 8 : 6}
                fill="hsl(var(--background))"
                stroke={strokeColor}
                strokeWidth="3"
                className="transition-all duration-300"
              />
              
              {/* End point */}
              <circle
                cx="550"
                cy={yOffset}
                r={isSelected ? 8 : 6}
                fill={strokeColor}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Alternative routes from search */}
        {alternativeRoutes.map((route, index) => {
          const yOffset = 120 + index * 80;
          const isFastest = route.isFastest;
          
          return (
            <g key={route.id}>
              {/* Glow for fastest route */}
              {isFastest && (
                <path
                  d={`M 80 ${yOffset} Q 180 ${yOffset - 40} 300 ${yOffset + 30} T 520 ${yOffset}`}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="blur(10px)"
                />
              )}
              
              <path
                d={`M 80 ${yOffset} Q 180 ${yOffset - 40} 300 ${yOffset + 30} T 520 ${yOffset}`}
                fill="none"
                stroke={route.color}
                strokeWidth={isFastest ? 6 : 4}
                strokeLinecap="round"
                strokeDasharray={isFastest ? "0" : "12 8"}
                opacity={isFastest ? 1 : 0.7}
                className="transition-all duration-300"
              />
              
              {/* Points */}
              <circle cx="80" cy={yOffset} r="6" fill="hsl(var(--background))" stroke={route.color} strokeWidth="3" />
              <circle cx="520" cy={yOffset} r="6" fill={route.color} />
            </g>
          );
        })}
      </svg>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Traffic Density</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-low" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-medium" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-high" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>

      {/* Floating info badge */}
      <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">ML-Powered Predictions</p>
        <p className="text-sm font-semibold text-primary">Random Forest Model</p>
      </div>
    </div>
  );
};

export default MapView;
