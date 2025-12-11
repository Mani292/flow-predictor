import { Route, TimeSlot, CongestionLevel } from '@/types/traffic';

export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Downtown Express',
    origin: 'Central Station',
    destination: 'Business District',
    distance: '12.5 km',
    currentTravelTime: 35,
    predictedTravelTime: 28,
    congestionLevel: 'Low',
    confidence: 87,
  },
  {
    id: 'route-2',
    name: 'Highway 101 North',
    origin: 'South Terminal',
    destination: 'Tech Park',
    distance: '18.2 km',
    currentTravelTime: 42,
    predictedTravelTime: 55,
    congestionLevel: 'High',
    confidence: 92,
  },
  {
    id: 'route-3',
    name: 'Riverside Drive',
    origin: 'West End',
    destination: 'University Campus',
    distance: '8.7 km',
    currentTravelTime: 22,
    predictedTravelTime: 26,
    congestionLevel: 'Medium',
    confidence: 78,
  },
  {
    id: 'route-4',
    name: 'Airport Connector',
    origin: 'City Center',
    destination: 'International Airport',
    distance: '25.3 km',
    currentTravelTime: 38,
    predictedTravelTime: 32,
    congestionLevel: 'Low',
    confidence: 94,
  },
  {
    id: 'route-5',
    name: 'Industrial Loop',
    origin: 'Harbor District',
    destination: 'Manufacturing Zone',
    distance: '15.8 km',
    currentTravelTime: 28,
    predictedTravelTime: 40,
    congestionLevel: 'High',
    confidence: 85,
  },
];

export const generateTimeSlots = (routeId: string): TimeSlot[] => {
  const levels: CongestionLevel[] = ['Low', 'Medium', 'High'];
  const times = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  
  // Simulate rush hour patterns
  return times.map((time, index) => {
    let congestionLevel: CongestionLevel;
    let estimatedTime: number;
    
    // Morning rush (7-9 AM)
    if (index >= 1 && index <= 3) {
      congestionLevel = index === 2 ? 'High' : 'Medium';
      estimatedTime = 35 + Math.floor(Math.random() * 20);
    }
    // Evening rush (4-6 PM)
    else if (index >= 10 && index <= 12) {
      congestionLevel = index === 11 ? 'High' : 'Medium';
      estimatedTime = 38 + Math.floor(Math.random() * 22);
    }
    // Off-peak
    else {
      congestionLevel = 'Low';
      estimatedTime = 18 + Math.floor(Math.random() * 10);
    }
    
    return {
      time,
      congestionLevel,
      estimatedTime,
    };
  });
};

export const getRouteById = (id: string): Route | undefined => {
  return mockRoutes.find(route => route.id === id);
};
