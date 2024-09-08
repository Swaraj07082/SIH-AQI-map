'use client'
import { MapContainer, TileLayer, useMap, Circle, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import L, { LatLngTuple, LatLngBoundsExpression } from 'leaflet';
import { useEffect, useState } from "react";
import Legend from "./Legend";
import SearchControl from "./SearchControl";
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Dummy AQI data with locations around Central Delhi
const aqiData: AQIData[] = [
  { location: [28.6139, 77.2090] as LatLngTuple, aqi: 70, name: "Central Delhi" },
  { location: [28.6200, 77.2100] as LatLngTuple, aqi: 80, name: "Location 1" },
  { location: [28.6300, 77.2150] as LatLngTuple, aqi: 90, name: "Location 2" },
  { location: [28.6400, 77.2200] as LatLngTuple, aqi: 100, name: "Location 3" },
  { location: [28.6500, 77.2300] as LatLngTuple, aqi: 110, name: "Location 4" },
  { location: [28.7041, 77.1025] as LatLngTuple, aqi: 150, name: "North Delhi" },
  { location: [28.4595, 77.0266] as LatLngTuple, aqi: 220, name: "South-West Delhi" },
  { location: [28.4089, 77.3178] as LatLngTuple, aqi: 300, name: "East Delhi" },
  // Add more data as needed
];

interface AQIData {
  name: string;
  aqi: number;
  location: LatLngTuple;
}

// Define AQI color logic based on value
const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon";
};

// Function to calculate average AQI of clustered data
const calculateAverageAQI = (cluster: AQIData[]) => {
  const totalAQI = cluster.reduce((sum, data) => sum + data.aqi, 0);
  return totalAQI / cluster.length;
};

// Component to handle map interactions and adding AQI circles
const MapInteractions = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  // Listen to map zoom events
  useMapEvent('zoomend', () => {
    setZoomLevel(map.getZoom());
  });

  useEffect(() => {
    const renderCircles = () => {
      // Clear all existing layers before rendering new ones
      map.eachLayer(layer => {
        if (layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });

      if (zoomLevel > 12) {
        // Render small AQI circles at higher zoom levels
        aqiData.forEach((data) => {
          const circle = L.circle(data.location, {
            color: getAQIColor(data.aqi),
            radius: 500,  // Small circles
            fillOpacity: 0.5,
          });
          circle.bindPopup(`<strong>${data.name}</strong><br />AQI: ${data.aqi}`);
          circle.addTo(map);
        });
      } else {
        // Group nearby locations into clusters and display averaged AQI circles
        const clusters = [
          { locations: [aqiData[0], aqiData[1], aqiData[2], aqiData[3]], center: [28.6300, 77.2150] as LatLngTuple },
          { locations: [aqiData[4], aqiData[5]], center: [28.5595, 77.0725] as LatLngTuple },
          // Add more clusters if necessary
        ];

        clusters.forEach((cluster) => {
          const avgAQI = calculateAverageAQI(cluster.locations);
          const circle = L.circle(cluster.center, {
            color: getAQIColor(avgAQI),
            radius: 2000,  // Larger circles for clusters
            fillOpacity: 0.5,
          });
          circle.bindPopup(`<strong>Clustered Area</strong><br />Average AQI: ${avgAQI.toFixed(1)}`);
          circle.addTo(map);
        });
      }
    };

    renderCircles();
  }, [zoomLevel, map]);

  return null;
};

const MapComponent = () => {
  const delhiCenter: LatLngTuple = [28.6139, 77.2090]; // Center of Delhi

  // Define bounds for Delhi and surrounding areas
  const delhiBounds: LatLngBoundsExpression = [
    [28.4, 76.9],  // Southwest corner of bounds
    [28.9, 77.5]   // Northeast corner of bounds
  ];

  return (
    <>
      <MapContainer
        center={delhiCenter}
        zoom={11}
        maxBounds={delhiBounds}         // Restrict map bounds to this area
        maxBoundsViscosity={1.0}        // Prevent panning outside the bounds
        minZoom={10}                    // Set the minimum zoom level
        maxZoom={15}                    // Set the maximum zoom level
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Search control component */}
        <SearchControl />

        {/* Legend component to handle AQI legend */}
        <Legend />

        {/* Map interactions component */}
        <MapInteractions />
      </MapContainer>
    </>
  );
};

export default MapComponent;
