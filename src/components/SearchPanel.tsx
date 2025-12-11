import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  onSearch: (origin: string, destination: string) => void;
  isLoading?: boolean;
  className?: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, isLoading, className }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) {
      onSearch(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-congestion-low" />
        <Input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Start location..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 h-11"
        />
      </div>
      
      {/* Connection line */}
      <div className="flex items-center gap-3 px-3">
        <div className="w-4 flex flex-col items-center">
          <div className="w-0.5 h-2 bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <div className="w-0.5 h-2 bg-border" />
        </div>
        <span className="text-xs text-muted-foreground">to</span>
      </div>
      
      <div className="relative">
        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 h-11"
        />
      </div>
      
      <Button 
        type="submit" 
        variant="glow" 
        className="w-full h-11"
        disabled={!origin.trim() || !destination.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing Routes...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Find Best Route
          </>
        )}
      </Button>
    </form>
  );
};

export default SearchPanel;
