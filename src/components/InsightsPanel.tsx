import React from 'react';
import { TimeSlot } from '@/types/traffic';
import CongestionBadge from './CongestionBadge';
import { Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  timeSlots: TimeSlot[];
  className?: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ timeSlots, className }) => {
  const optimalSlots = timeSlots.filter(slot => slot.congestionLevel === 'Low');
  
  return (
    <div className={cn('glass rounded-2xl p-6 animate-slide-up', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Optimal Departure Times</h3>
          <p className="text-xs text-muted-foreground">Based on historical patterns</p>
        </div>
      </div>

      {/* Best times highlight */}
      {optimalSlots.length > 0 && (
        <div className="mb-6 p-4 bg-congestion-low/10 border border-congestion-low/30 rounded-xl">
          <p className="text-sm text-congestion-low font-medium mb-2">Recommended Departure</p>
          <div className="flex flex-wrap gap-2">
            {optimalSlots.slice(0, 4).map((slot, i) => (
              <span 
                key={i}
                className="px-3 py-1.5 bg-congestion-low/20 text-congestion-low text-sm font-mono rounded-lg"
              >
                {slot.time}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Full timeline */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {timeSlots.map((slot, index) => (
          <div 
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50',
              slot.congestionLevel === 'Low' && 'bg-congestion-low/5',
            )}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm">{slot.time}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono">
                ~{slot.estimatedTime} min
              </span>
              <CongestionBadge level={slot.congestionLevel} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
