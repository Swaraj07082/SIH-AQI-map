'use client'
import { MapContainer, TileLayer, Circle, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import L, { LatLngTuple } from 'leaflet';
import { useEffect, useState } from "react";
import Legend from "./Legend"; // Import your Legend component
import SearchControl from "./SearchControl";
 // Import SearchControl component

// Define the bounds for Delhi
const delhiBounds = L.latLngBounds(
  L.latLng(28.4048, 76.8398), // South-West corner of Delhi
  L.latLng(28.8831, 77.3516)  // North-East corner of Delhi
);

// Dummy AQI data with locations
const aqiData: AQIData[] = [
  { location: [28.6139, 77.2090] as LatLngTuple, aqi: 70, name: "Central Delhi" },
  { location: [28.7041, 77.1025] as LatLngTuple, aqi: 150, name: "North Delhi" },
  { location: [28.4595, 77.0266] as LatLngTuple, aqi: 220, name: "South-West Delhi" },
  { location: [28.4089, 77.3178] as LatLngTuple, aqi: 300, name: "East Delhi" },
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

// Function to calculate distance between two coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon1 - lon2) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

// Define a type for the AQI data points
interface AQIData {
  name: string;
  aqi: number;
  location: LatLngTuple;
}

// Component to handle map clicks and find the nearest AQI location
const MapClickHandler = ({ setClickedAQI }: { setClickedAQI: (data: AQIData | null) => void }) => {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;

    // Find the nearest AQI point
    let nearestAQI: AQIData | null = null;
    let minDistance = Infinity;

    aqiData.forEach((data) => {
      const distance = getDistance(lat, lng, data.location[0], data.location[1]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestAQI = data;
      }
    });

    // Show the nearest AQI point if within 5km radius
    if (minDistance <= 5000 && nearestAQI) {
      setClickedAQI(nearestAQI);
    } else {
      setClickedAQI(null); // No AQI data within range
    }
  });

  return null;
};

// Main component
export default function MapComponent() {
  const delhiCenter: LatLngTuple = [28.6139, 77.2090]; // Center of Delhi
  const [clickedAQI, setClickedAQI] = useState<AQIData | null>(null);

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
              fillOpacity: 0.5,
            }}
          />
        ))}

        {/* Render popup on click */}
        {clickedAQI && (
          <Popup position={clickedAQI.location}>
            <div>
              <strong>{clickedAQI.name}</strong><br />
              AQI: {clickedAQI.aqi}
            </div>
          </Popup>
        )}

        {/* Handle clicks to show AQI */}
        <MapClickHandler setClickedAQI={setClickedAQI} />

        {/* Search control component */}
        <SearchControl/>
        
        {/* Legend component to handle AQI legend */}
        <Legend />
      </MapContainer>
    </>
  );
}
