import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Route, PredictionResult, AlternativeRoute, CongestionLevel } from '@/types/traffic';
import { mockRoutes, generateTimeSlots } from '@/data/mockRoutes';

interface TrafficContextType {
  routes: Route[];
  selectedRoute: Route | null;
  predictionResult: PredictionResult | null;
  alternativeRoutes: AlternativeRoute[];
  isLoading: boolean;
  selectRoute: (routeId: string) => void;
  getPrediction: (routeId: string) => Promise<void>;
  searchRoutes: (origin: string, destination: string) => Promise<void>;
  clearSelection: () => void;
}

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export const TrafficProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<AlternativeRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setSelectedRoute(route);
    }
  };

  const getPrediction = async (routeId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const route = routes.find(r => r.id === routeId);
    if (route) {
      const timeSlots = generateTimeSlots(routeId);
      const timeSaved = route.currentTravelTime - route.predictedTravelTime;
      
      setPredictionResult({
        routeId: route.id,
        routeName: route.name,
        currentTravelTime: route.currentTravelTime,
        predictedTravelTime: route.predictedTravelTime,
        congestionLevel: route.congestionLevel,
        confidence: route.confidence,
        timeSaved,
        optimalDepartureSlots: timeSlots,
      });
    }
    
    setIsLoading(false);
  };

  const searchRoutes = async (origin: string, destination: string) => {
    setIsLoading(true);
    
    // Simulate API call for route alternatives
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const colors = ['#4ade80', '#3b82f6', '#f59e0b', '#ef4444'];
    const levels: CongestionLevel[] = ['Low', 'Medium', 'High'];
    
    const alternatives: AlternativeRoute[] = [
      {
        id: 'alt-1',
        summary: `via Highway 101`,
        distance: '15.2 km',
        currentTime: 32,
        predictedTime: 25,
        congestionLevel: 'Low',
        isFastest: true,
        color: colors[0],
      },
      {
        id: 'alt-2',
        summary: `via Downtown`,
        distance: '12.8 km',
        currentTime: 28,
        predictedTime: 35,
        congestionLevel: 'Medium',
        isFastest: false,
        color: colors[1],
      },
      {
        id: 'alt-3',
        summary: `via Industrial Blvd`,
        distance: '18.5 km',
        currentTime: 38,
        predictedTime: 42,
        congestionLevel: 'High',
        isFastest: false,
        color: colors[2],
      },
    ];
    
    setAlternativeRoutes(alternatives);
    setIsLoading(false);
  };

  const clearSelection = () => {
    setSelectedRoute(null);
    setPredictionResult(null);
    setAlternativeRoutes([]);
  };

  return (
    <TrafficContext.Provider
      value={{
        routes,
        selectedRoute,
        predictionResult,
        alternativeRoutes,
        isLoading,
        selectRoute,
        getPrediction,
        searchRoutes,
        clearSelection,
      }}
    >
      {children}
    </TrafficContext.Provider>
  );
};

export const useTraffic = () => {
  const context = useContext(TrafficContext);
  if (!context) {
    throw new Error('useTraffic must be used within a TrafficProvider');
  }
  return context;
};
