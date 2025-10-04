import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

interface MapProps {
  onLocationChange?: (location: { lat: number; lng: number }) => void;
}

const Map = ({ onLocationChange }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([-46.6333, -23.5505]); // Default: São Paulo

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserLocation(newLocation);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // User needs to add their token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: userLocation,
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add user location marker
    marker.current = new mapboxgl.Marker({ color: '#00f5ff' })
      .setLngLat(userLocation)
      .addTo(map.current);

    // Notify parent of location
    if (onLocationChange) {
      onLocationChange({ lat: userLocation[1], lng: userLocation[0] });
    }

    return () => {
      map.current?.remove();
    };
  }, [userLocation, onLocationChange]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map.current) return;

    try {
      // Geocoding with Mapbox
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Update map view
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 2000,
        });

        // Update marker
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        }

        // Notify parent
        if (onLocationChange) {
          onLocationChange({ lat, lng });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Pesquisar localização..."
            className="pl-9 bg-card/95 backdrop-blur-sm border-primary/20"
          />
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          size="icon"
          className="border-primary/20 bg-card/95 backdrop-blur-sm hover:bg-primary/10"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
};

export default Map;
