export type CongestionLevel = 'Low' | 'Medium' | 'High';

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: string;
  currentTravelTime: number; // in minutes
  predictedTravelTime: number; // in minutes
  congestionLevel: CongestionLevel;
  confidence: number; // 0-100
  coordinates?: { lat: number; lng: number }[];
}

export interface PredictionResult {
  routeId: string;
  routeName: string;
  currentTravelTime: number;
  predictedTravelTime: number;
  congestionLevel: CongestionLevel;
  confidence: number;
  timeSaved: number;
  optimalDepartureSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  congestionLevel: CongestionLevel;
  estimatedTime: number;
}

export interface SearchLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export interface AlternativeRoute {
  id: string;
  summary: string;
  distance: string;
  currentTime: number;
  predictedTime: number;
  congestionLevel: CongestionLevel;
  isFastest: boolean;
  color: string;
}
