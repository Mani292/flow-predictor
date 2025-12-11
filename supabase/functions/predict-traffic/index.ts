import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Random Forest prediction simulation based on traffic patterns
// In production, this would call your actual ML model API
function predictCongestion(hour: number, dayType: string, routeId: string): {
  congestionLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  predictedTravelTime: number;
  currentTravelTime: number;
} {
  // Feature weights simulating Random Forest importance
  const hourWeight = getHourWeight(hour);
  const dayWeight = dayType === 'weekend' ? 0.6 : 1.0;
  const routeWeight = getRouteWeight(routeId);
  
  // Calculate congestion score (0-1)
  const congestionScore = (hourWeight * 0.5 + dayWeight * 0.2 + routeWeight * 0.3);
  
  // Add some randomness to simulate model variance
  const variance = (Math.random() - 0.5) * 0.15;
  const finalScore = Math.max(0, Math.min(1, congestionScore + variance));
  
  // Determine congestion level
  let congestionLevel: 'Low' | 'Medium' | 'High';
  if (finalScore < 0.4) {
    congestionLevel = 'Low';
  } else if (finalScore < 0.7) {
    congestionLevel = 'Medium';
  } else {
    congestionLevel = 'High';
  }
  
  // Calculate confidence (higher for typical patterns)
  const confidence = 75 + Math.random() * 20;
  
  // Base travel times vary by route
  const baseTravelTime = getBaseTravelTime(routeId);
  const congestionMultiplier = 1 + (finalScore * 0.8);
  const currentTravelTime = Math.round(baseTravelTime * congestionMultiplier);
  
  // ML prediction usually predicts slightly better routing
  const optimizationFactor = 0.85 + Math.random() * 0.1;
  const predictedTravelTime = Math.round(currentTravelTime * optimizationFactor);
  
  return {
    congestionLevel,
    confidence: Math.round(confidence * 10) / 10,
    predictedTravelTime,
    currentTravelTime,
  };
}

function getHourWeight(hour: number): number {
  // Rush hours have highest congestion
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 0.9;
  }
  // Mid-day moderate
  if (hour >= 10 && hour <= 16) {
    return 0.5;
  }
  // Night/early morning low
  return 0.2;
}

function getRouteWeight(routeId: string): number {
  // Different routes have different baseline congestion
  const routeWeights: Record<string, number> = {
    'route-1': 0.7, // Highway 101 - busy
    'route-2': 0.5, // Downtown - moderate
    'route-3': 0.8, // Industrial Blvd - heavy trucks
    'route-4': 0.4, // Coastal Highway - scenic, less traffic
  };
  return routeWeights[routeId] || 0.5;
}

function getBaseTravelTime(routeId: string): number {
  const baseTimes: Record<string, number> = {
    'route-1': 25,
    'route-2': 18,
    'route-3': 35,
    'route-4': 22,
  };
  return baseTimes[routeId] || 20;
}

function generateOptimalSlots(hour: number, dayType: string): Array<{
  time: string;
  congestionLevel: 'Low' | 'Medium' | 'High';
  estimatedTime: number;
}> {
  const slots = [];
  const baseHour = hour;
  
  for (let offset = -2; offset <= 4; offset++) {
    const slotHour = (baseHour + offset + 24) % 24;
    const prediction = predictCongestion(slotHour, dayType, 'route-1');
    
    const timeStr = `${slotHour.toString().padStart(2, '0')}:00`;
    slots.push({
      time: timeStr,
      congestionLevel: prediction.congestionLevel,
      estimatedTime: prediction.predictedTravelTime,
    });
  }
  
  // Sort by estimated time to show best options first
  return slots.sort((a, b) => a.estimatedTime - b.estimatedTime);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { route_id, hour, day_type } = await req.json();
    
    console.log(`Predicting traffic for route: ${route_id}, hour: ${hour}, day: ${day_type}`);
    
    // Validate inputs
    if (!route_id) {
      return new Response(
        JSON.stringify({ error: 'route_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const currentHour = hour ?? new Date().getHours();
    const currentDayType = day_type ?? (new Date().getDay() === 0 || new Date().getDay() === 6 ? 'weekend' : 'weekday');
    
    // Get prediction from ML model simulation
    const prediction = predictCongestion(currentHour, currentDayType, route_id);
    
    // Generate optimal departure slots
    const optimalSlots = generateOptimalSlots(currentHour, currentDayType);
    
    const response = {
      route_id,
      ...prediction,
      timeSaved: prediction.currentTravelTime - prediction.predictedTravelTime,
      optimalDepartureSlots: optimalSlots,
      model: 'Random Forest Classifier v1.0',
      timestamp: new Date().toISOString(),
    };
    
    console.log('Prediction result:', response);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Prediction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Prediction failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
