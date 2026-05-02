'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trip } from '@/types/trip';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  trips: Trip[];
  onMapClick?: (lat: number, lng: number) => void;
  selectedTripId?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

const customIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapView({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map({
  trips,
  onMapClick,
  selectedTripId,
  center = [41.9028, 12.4964], // Default: Rome
  zoom = 6,
  interactive = true,
}: MapProps) {
  const router = useRouter();
  const [mapKey] = useState(() => Date.now());

  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="dark-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      {trips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.lat, trip.lng]}
          icon={trip.id === selectedTripId ? selectedIcon : customIcon}
          eventHandlers={{
            click: () => router.push(`/trip/${trip.id}`),
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={1}>
            {trip.title}
          </Tooltip>
          <Popup>{trip.title}</Popup>
        </Marker>
      ))}
      {center && <MapView center={center} zoom={zoom} />}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
    </MapContainer>
  );
}
