"use client";
import Image from "next/image";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Home() {
  return (
    <>
      <MapContainer zoom={13} center={[48.8566, 2.3522]}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
}
