import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue in React
const customIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `<div style="background-color: #0F5132; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface RouteMapProps {
  coordinates: [number, number][];
  currentLocationName?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  coordinates,
  currentLocationName = 'In Transit',
}) => {
  const center = coordinates[0] || [11.341, 77.7172];

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Path Line */}
        {coordinates.length > 1 && (
          <Polyline
            positions={coordinates}
            color="#0F5132"
            weight={4}
            dashArray="8, 8"
          />
        )}

        {/* Location Markers */}
        {coordinates.map((coord, idx) => (
          <Marker key={idx} position={coord} icon={customIcon}>
            <Popup>
              <div className="p-1 text-xs font-bold text-slate-800">
                WayPoint #{idx + 1}
                <div className="text-[10px] text-emerald-800 font-normal">{idx === 0 ? 'Origin (Farm)' : idx === coordinates.length - 1 ? 'Destination' : 'Transit Point'}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
