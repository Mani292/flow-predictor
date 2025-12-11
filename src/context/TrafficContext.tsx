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
    
    const route = routes.find(r => r.id === routeId);
    if (!route) {
      setIsLoading(false);
      return;
    }

    try {
      const currentHour = new Date().getHours();
      const dayType = new Date().getDay() === 0 || new Date().getDay() === 6 ? 'weekend' : 'weekday';
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict-traffic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          route_id: routeId,
          hour: currentHour,
          day_type: dayType,
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction API failed');
      }

      const data = await response.json();
      
      setPredictionResult({
        routeId: route.id,
        routeName: route.name,
        currentTravelTime: data.currentTravelTime,
        predictedTravelTime: data.predictedTravelTime,
        congestionLevel: data.congestionLevel,
        confidence: data.confidence,
        timeSaved: data.timeSaved,
        optimalDepartureSlots: data.optimalDepartureSlots,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback to mock data if API fails
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
