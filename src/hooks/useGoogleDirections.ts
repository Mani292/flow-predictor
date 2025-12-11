import { useState, useCallback } from 'react';
import { AlternativeRoute, CongestionLevel } from '@/types/traffic';

interface DirectionsResult {
  directions: google.maps.DirectionsResult[];
  alternatives: AlternativeRoute[];
}

export const useGoogleDirections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);

  const getCongestionLevel = (durationInTraffic: number, duration: number): CongestionLevel => {
    const ratio = durationInTraffic / duration;
    if (ratio <= 1.2) return 'Low';
    if (ratio <= 1.5) return 'Medium';
    return 'High';
  };

  const getRouteColor = (index: number, isFastest: boolean): string => {
    if (isFastest) return '#4ade80';
    const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  };

  const fetchDirections = useCallback(async (
    origin: string,
    destination: string
  ): Promise<DirectionsResult | null> => {
    if (!window.google) {
      setError('Google Maps not loaded');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const directionsService = new google.maps.DirectionsService();

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: google.maps.TrafficModel.BEST_GUESS,
            },
          },
          (response, status) => {
            if (status === 'OK' && response) {
              resolve(response);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          }
        );
      });

      // Process routes and create alternatives
      const routes = result.routes;
      let fastestIndex = 0;
      let fastestTime = Infinity;

      // Find fastest route
      routes.forEach((route, index) => {
        const leg = route.legs[0];
        const duration = leg.duration_in_traffic?.value || leg.duration?.value || Infinity;
        if (duration < fastestTime) {
          fastestTime = duration;
          fastestIndex = index;
        }
      });

      const alternatives: AlternativeRoute[] = routes.map((route, index) => {
        const leg = route.legs[0];
        const currentDuration = leg.duration?.value || 0;
        const trafficDuration = leg.duration_in_traffic?.value || currentDuration;
        
        // ML prediction simulation (add some variance for predicted time)
        const predictionVariance = Math.random() * 0.2 - 0.1; // -10% to +10%
        const predictedTime = Math.round((trafficDuration / 60) * (1 + predictionVariance));
        
        return {
          id: `route-${index}`,
          summary: route.summary || `Route ${index + 1}`,
          distance: leg.distance?.text || 'N/A',
          currentTime: Math.round(trafficDuration / 60),
          predictedTime,
          congestionLevel: getCongestionLevel(trafficDuration, currentDuration),
          isFastest: index === fastestIndex,
          color: getRouteColor(index, index === fastestIndex),
        };
      });

      // Create individual direction results for each route
      const directionsArray = routes.map((route) => ({
        ...result,
        routes: [route],
      }));

      setDirectionsResults(directionsArray);

      return {
        directions: directionsArray,
        alternatives,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch directions';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDirections = useCallback(() => {
    setDirectionsResults([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    directionsResults,
    fetchDirections,
    clearDirections,
  };
};
