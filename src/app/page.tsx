"use client";
import Image from "next/image";
import { MapContainer, TileLayer , useMap
 } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { useEffect } from "react";

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar', // 'bar' for a search bar, 'button' for a search button
      showMarker: true,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address or location',
    });

    map.addControl(searchControl);

    // Cleanup function to remove the search control when the component unmounts
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};
export default function Home() {
  const bounds = L.latLngBounds([28.4040, 76.8396], [28.8833, 77.3182]);
  return (
    <>
      <MapContainer center={[28.6139, 77.2090]} zoom={11} maxBounds={bounds} minZoom={10} maxBoundsViscosity={1.0}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
}
