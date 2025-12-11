import React, { useState } from 'react';
import { useTraffic } from '@/context/TrafficContext';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import RouteCard from '@/components/RouteCard';
import SearchPanel from '@/components/SearchPanel';
import PredictionCard from '@/components/PredictionCard';
import InsightsPanel from '@/components/InsightsPanel';
import AlternativeRouteList from '@/components/AlternativeRouteList';
import StatsBar from '@/components/StatsBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

type ViewMode = 'home' | 'prediction' | 'search-results';

const Index: React.FC = () => {
  const { 
    routes, 
    selectedRoute, 
    predictionResult, 
    alternativeRoutes,
    isLoading, 
    selectRoute, 
    getPrediction, 
    searchRoutes,
    clearSelection 
  } = useTraffic();
  
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  const handleRouteClick = async (routeId: string) => {
    selectRoute(routeId);
    await getPrediction(routeId);
    setViewMode('prediction');
  };

  const handleSearch = async (origin: string, destination: string) => {
    await searchRoutes(origin, destination);
    setViewMode('search-results');
  };

  const handleBack = () => {
    clearSelection();
    setViewMode('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back button for non-home views */}
          {viewMode !== 'home' && (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Routes
            </Button>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Analyzing traffic patterns...</p>
              </div>
            </div>
          )}

          {/* Home View */}
          {viewMode === 'home' && (
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="text-center py-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="gradient-text">Predict Traffic</span>
                  <br />
                  <span className="text-foreground">Before It Happens</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Powered by Random Forest machine learning model. Get accurate congestion predictions 
                  and optimize your commute with data-driven insights.
                </p>
              </div>

              {/* Stats */}
              <StatsBar routes={routes} />

              {/* Main Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Map & Search */}
                <div className="lg:col-span-2 space-y-4">
                  <MapView 
                    routes={routes} 
                    selectedRouteId={selectedRoute?.id}
                    onRouteClick={handleRouteClick}
                    className="h-[400px] md:h-[500px]"
                  />
                  
                  {/* Search Panel */}
                  <div className="glass rounded-xl p-4">
                    <h2 className="text-sm font-medium text-muted-foreground mb-4">Smart Route Search</h2>
                    <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
                  </div>
                </div>

                {/* Routes List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Monitored Routes</h2>
                    <span className="text-xs text-muted-foreground">{routes.length} routes</span>
                  </div>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {routes.map((route, index) => (
                      <div 
                        key={route.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <RouteCard 
                          route={route} 
                          onClick={() => handleRouteClick(route.id)}
                          isSelected={selectedRoute?.id === route.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prediction View */}
          {viewMode === 'prediction' && predictionResult && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PredictionCard prediction={predictionResult} />
              </div>
              <div className="space-y-6">
                <InsightsPanel timeSlots={predictionResult.optimalDepartureSlots} />
              </div>
            </div>
          )}

          {/* Search Results View */}
          {viewMode === 'search-results' && alternativeRoutes.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapView 
                  alternativeRoutes={alternativeRoutes}
                  className="h-[400px] md:h-[500px]"
                />
              </div>
              <div>
                <AlternativeRouteList routes={alternativeRoutes} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Flow Predictor • ML-Powered Traffic Intelligence • Random Forest Classifier
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
