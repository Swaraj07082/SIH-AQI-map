"use client";
import { MapContainer, TileLayer, Circle, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import L, { LatLngTuple } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect, useState } from "react";
import Legend from "./Legend";

// Define the bounds for Delhi
const delhiBounds = L.latLngBounds(
  L.latLng(28.4048, 76.8398), // South-West corner of Delhi
  L.latLng(28.8831, 77.3516)  // North-East corner of Delhi
);

// Dummy AQI data with locations
const aqiData = [
  { location: [28.6139, 77.2090], aqi: 70 },  // Example: Central Delhi
  { location: [28.7041, 77.1025], aqi: 150 }, // Example: North Delhi
  { location: [28.4595, 77.0266], aqi: 220 }, // Example: South-West Delhi
  { location: [28.4089, 77.3178], aqi: 300 }, // Example: East Delhi
];

// Define AQI color logic based on value
const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon";
};

// SearchField component
const SearchField = ({ setZoomLocation }: { setZoomLocation: (position: LatLngTuple) => void }) => {
  const map = useMap();

  useEffect(() => {
    // Check if window is defined to ensure client-side execution
    if (typeof window !== "undefined") {
      const provider = new OpenStreetMapProvider();

      const searchControl = new (GeoSearchControl as any)({
        provider,
        style: 'bar', // 'bar' for a search bar, 'button' for a search button
        showMarker: false, // Do not show a marker on search
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Enter address or location',
      });

      map.addControl(searchControl);

      map.on('geosearch/showlocation', (result: any) => {
        const { x: lng, y: lat } = result.location;

        // Check if the result is within Delhi bounds
        const isInDelhi = delhiBounds.contains(L.latLng(lat, lng));

        if (isInDelhi) {
          setZoomLocation([lat, lng] as LatLngTuple);
          map.setView([lat, lng], 14); // Zoom to the location
        } else {
          alert("Location is outside Delhi bounds");
        }
      });

      return () => {
        map.removeControl(searchControl);
      };
    }
  }, [map, setZoomLocation]);

  return null;
};

// Legend component


// Main component
export default function MapComponent() {
  const delhiCenter: LatLngTuple = [28.6139, 77.2090]; // Center of Delhi
  const [zoomLocation, setZoomLocation] = useState<LatLngTuple | null>(null);

  return (
    <>
      <MapContainer 
        center={delhiCenter} 
        zoom={11} 
        maxBounds={delhiBounds} 
        minZoom={10} 
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render AQI circles */}
        {aqiData.map((data, index) => (
          <Circle 
            key={index}
            center={data.location as LatLngTuple} // Convert location to LatLngTuple
            radius={1000} // 1000 meters radius
            pathOptions={{ 
              color: getAQIColor(data.aqi), 
              fillColor: getAQIColor(data.aqi), 
              fillOpacity: 0.5 
            }}
          />
        ))}

        {/* SearchField component to handle location search */}
        <SearchField setZoomLocation={setZoomLocation} />

        {/* Legend component */}
        <Legend/>
      </MapContainer>
    </>
  );
}
