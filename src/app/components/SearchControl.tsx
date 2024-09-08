import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

interface GeoSearchResult {
    location: {
      x: number; // Longitude
      y: number; // Latitude
    };
  }
export default function SearchControl()  {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      retainZoomLevel: true,
      animateZoom: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (event: any) => {
      const result = event as GeoSearchResult;
      const { x: lng, y: lat } = result.location;

      map.setView([lat, lng], 14); // Zoom to the location
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};
