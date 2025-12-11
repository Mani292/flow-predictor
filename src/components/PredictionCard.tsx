import React from 'react';
import { PredictionResult } from '@/types/traffic';
import CongestionBadge from './CongestionBadge';
import { Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  prediction: PredictionResult;
  className?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, className }) => {
  const isImproved = prediction.timeSaved > 0;

  return (
    <div className={cn('glass rounded-2xl p-6 animate-slide-up', className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{prediction.routeName}</h2>
          <p className="text-sm text-muted-foreground mt-1">ML Prediction Result</p>
        </div>
        <CongestionBadge level={prediction.congestionLevel} size="lg" showPulse />
      </div>

      {/* Time comparison grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Current Time</span>
          </div>
          <p className="text-2xl font-bold font-mono">{prediction.currentTravelTime}</p>
          <p className="text-xs text-muted-foreground">minutes</p>
        </div>
        
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/30">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Predicted</span>
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{prediction.predictedTravelTime}</p>
          <p className="text-xs text-muted-foreground">minutes</p>
        </div>
      </div>

      {/* Time saved indicator */}
      <div className={cn(
        'rounded-xl p-4 mb-6 flex items-center justify-between',
        isImproved ? 'bg-congestion-low/10 border border-congestion-low/30' : 'bg-congestion-high/10 border border-congestion-high/30'
      )}>
        <div className="flex items-center gap-3">
          <TrendingUp className={cn(
            'w-5 h-5',
            isImproved ? 'text-congestion-low' : 'text-congestion-high rotate-180'
          )} />
          <div>
            <p className={cn(
              'font-semibold',
              isImproved ? 'text-congestion-low' : 'text-congestion-high'
            )}>
              {isImproved ? 'Time Saved' : 'Extra Time'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isImproved ? 'vs. leaving now' : 'expected delay'}
            </p>
          </div>
        </div>
        <p className={cn(
          'text-3xl font-bold font-mono',
          isImproved ? 'text-congestion-low' : 'text-congestion-high'
        )}>
          {isImproved ? '-' : '+'}{Math.abs(prediction.timeSaved)} min
        </p>
      </div>

      {/* Confidence meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Model Confidence</span>
          </div>
          <span className="text-sm font-mono font-semibold text-primary">{prediction.confidence}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-congestion-low rounded-full transition-all duration-1000"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
