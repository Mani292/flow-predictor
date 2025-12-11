import React from 'react';
import { CongestionLevel } from '@/types/traffic';
import { cn } from '@/lib/utils';

interface CongestionBadgeProps {
  level: CongestionLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

const CongestionBadge: React.FC<CongestionBadgeProps> = ({ 
  level, 
  size = 'md',
  showPulse = false 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const levelClasses = {
    Low: 'bg-congestion-low/20 text-congestion-low border-congestion-low/50',
    Medium: 'bg-congestion-medium/20 text-congestion-medium border-congestion-medium/50',
    High: 'bg-congestion-high/20 text-congestion-high border-congestion-high/50',
  };

  const glowClasses = {
    Low: 'shadow-[0_0_10px_hsl(var(--congestion-low)/0.3)]',
    Medium: 'shadow-[0_0_10px_hsl(var(--congestion-medium)/0.3)]',
    High: 'shadow-[0_0_10px_hsl(var(--congestion-high)/0.3)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-300',
        sizeClasses[size],
        levelClasses[level],
        glowClasses[level],
        showPulse && 'animate-pulse-glow'
      )}
    >
      <span className={cn(
        'w-2 h-2 rounded-full',
        level === 'Low' && 'bg-congestion-low',
        level === 'Medium' && 'bg-congestion-medium',
        level === 'High' && 'bg-congestion-high'
      )} />
      {level}
    </span>
  );
};

export default CongestionBadge;
