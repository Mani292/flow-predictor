import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Route, PredictionResult, AlternativeRoute, CongestionLevel } from '@/types/traffic';
import { mockRoutes, generateTimeSlots } from '@/data/mockRoutes';

interface TrafficContextType {
  routes: Route[];
  selectedRoute: Route | null;
  predictionResult: PredictionResult | null;
  alternativeRoutes: AlternativeRoute[];
  directionsResults: google.maps.DirectionsResult[];
  isLoading: boolean;
  searchOrigin: string;
  searchDestination: string;
  selectRoute: (routeId: string) => void;
  getPrediction: (routeId: string) => Promise<void>;
  searchRoutes: (origin: string, destination: string) => Promise<void>;
  setDirectionsResults: (results: google.maps.DirectionsResult[]) => void;
  setAlternativeRoutes: (routes: AlternativeRoute[]) => void;
  clearSelection: () => void;
}

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export const TrafficProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<AlternativeRoute[]>([]);
  const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');

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
    setSearchOrigin(origin);
    setSearchDestination(destination);
    setIsLoading(true);
    // The actual directions fetching will be handled by the component using Google Maps API
    setIsLoading(false);
  };

  const clearSelection = () => {
    setSelectedRoute(null);
    setPredictionResult(null);
    setAlternativeRoutes([]);
    setDirectionsResults([]);
    setSearchOrigin('');
    setSearchDestination('');
  };

  return (
    <TrafficContext.Provider
      value={{
        routes,
        selectedRoute,
        predictionResult,
        alternativeRoutes,
        directionsResults,
        isLoading,
        searchOrigin,
        searchDestination,
        selectRoute,
        getPrediction,
        searchRoutes,
        setDirectionsResults,
        setAlternativeRoutes,
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
