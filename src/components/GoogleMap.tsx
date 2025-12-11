import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, TrafficLayer, DirectionsRenderer } from '@react-google-maps/api';
import { cn } from '@/lib/utils';
import { AlternativeRoute } from '@/types/traffic';

const GOOGLE_MAPS_API_KEY = 'AIzaSyASV5MZplRuWUjLWNu4UCtj8krKDzQ8yjo';

// Suppress Google Maps billing error console warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Google Maps') || args[0]?.includes?.('InvalidKeyMapError')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b9e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d3d5c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
];

interface GoogleMapViewProps {
  className?: string;
  directions?: google.maps.DirectionsResult[];
  selectedDirectionIndex?: number;
  onMapLoad?: (map: google.maps.Map) => void;
  showTraffic?: boolean;
  origin?: string;
  destination?: string;
  alternativeRoutes?: AlternativeRoute[];
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  className,
  directions = [],
  selectedDirectionIndex = 0,
  onMapLoad,
  showTraffic = true,
  alternativeRoutes = [],
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    onMapLoad?.(mapInstance);
  }, [onMapLoad]);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds when directions change
  useEffect(() => {
    if (map && directions.length > 0 && directions[0]?.routes?.[0]?.bounds) {
      const bounds = directions[0].routes[0].bounds;
      map.fitBounds(bounds);
    }
  }, [map, directions]);

  if (loadError) {
    return (
      <div className={cn('flex items-center justify-center bg-card rounded-2xl border border-border/50', className)}>
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">Map unavailable</p>
          <p className="text-xs text-muted-foreground/70">Traffic predictions still work without the map</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={cn('flex items-center justify-center bg-card rounded-2xl', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-2xl overflow-hidden', className)}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={handleMapLoad}
        onUnmount={handleMapUnmount}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {showTraffic && <TrafficLayer />}
        
        {directions.map((direction, index) => (
          <DirectionsRenderer
            key={index}
            directions={direction}
            options={{
              polylineOptions: {
                strokeColor: index === selectedDirectionIndex ? '#4ade80' : '#3b82f6',
                strokeWeight: index === selectedDirectionIndex ? 6 : 4,
                strokeOpacity: index === selectedDirectionIndex ? 1 : 0.5,
              },
              suppressMarkers: index !== selectedDirectionIndex,
            }}
          />
        ))}
      </GoogleMap>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Traffic Density</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-low" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-medium" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-congestion-high" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>

      {/* Info badge */}
      <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">Live Traffic Data</p>
        <p className="text-sm font-semibold text-primary">Google Maps API</p>
      </div>
    </div>
  );
};

export default GoogleMapView;
