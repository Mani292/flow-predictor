import React from 'react';
import { Activity, Menu } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-primary/20 glow-primary">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              {/* Pulse indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-congestion-low rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Flow Predictor</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">ML-Powered Traffic Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Analytics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Settings
            </Button>
          </nav>

          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
