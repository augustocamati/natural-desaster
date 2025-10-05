import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { EONETEvent } from '@/services/api';

interface MapProps {
  events?: EONETEvent[];
}

const Map = ({ events = [] }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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
          // Default to world view
          setUserLocation([-46.6333, -23.5505]);
        }
      );
    } else {
      setUserLocation([-46.6333, -23.5505]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current || !userLocation) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: userLocation || [-46.6333, -23.5505],
      zoom: userLocation ? 10 : 2,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if available
    if (userLocation) {
      new mapboxgl.Marker({ color: '#00ff9d' })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML('<p>Sua Localização</p>'))
        .addTo(map.current);
    }
  }, [userLocation]);

  // Add event markers
  useEffect(() => {
    if (!map.current || events.length === 0) return;

    // Remove existing event markers
    const markers = document.querySelectorAll('.event-marker');
    markers.forEach(marker => marker.remove());

    // Add new markers for each event
    events.forEach(event => {
      const latestGeometry = event.geometry[event.geometry.length - 1];
      if (!latestGeometry) return;

      const [lng, lat] = latestGeometry.coordinates;
      
      const markerColor = event.categories[0]?.id === 'wildfires' ? '#ff4444' :
                          event.categories[0]?.id === 'floods' ? '#4444ff' :
                          event.categories[0]?.id === 'severeStorms' ? '#ffaa00' : '#ff00ff';

      new mapboxgl.Marker({ color: markerColor })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${event.title}</h3>
                <p class="text-xs">${event.categories[0]?.title}</p>
                ${latestGeometry.magnitudeValue ? 
                  `<p class="text-xs">Magnitude: ${latestGeometry.magnitudeValue} ${latestGeometry.magnitudeUnit}</p>` 
                  : ''}
              </div>
            `)
        )
        .addTo(map.current!);
    });
  }, [events]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 2000,
        });
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
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default Map;
