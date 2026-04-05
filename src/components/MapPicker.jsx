import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useCallback, memo, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Marker handler
const LocationMarker = memo(({ onSelect, position }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
});

// Auto fly to selected location
const FlyToLocation = memo(({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1 });
    }
  }, [position, map]);

  return null;
});

function MapPicker({ setLocation }) {
  const [position, setPosition] = useState(null);

  const handleSelect = useCallback(
    (latlng) => {
      setPosition(latlng);
      setLocation(latlng);
    },
    [setLocation]
  );

  return (
    <MapContainer
      center={[23.2599, 77.4126]} // Default (Bhopal)
      zoom={13}
      className="h-64 w-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={handleSelect} position={position} />
      <FlyToLocation position={position} />
    </MapContainer>
  );
}

export default memo(MapPicker);