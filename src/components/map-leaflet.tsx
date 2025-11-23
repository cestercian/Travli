import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet default marker icon not rendering in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    center: [number, number];
    markers?: { lat: number; lng: number; label: string }[];
}

function MapController({ center, markers }: MapProps) {
    const map = useMap();

    useEffect(() => {
        if (markers && markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(center);
        }
    }, [center, markers, map]);

    return null;
}

export default function MapLeaflet({ center, markers = [] }: MapProps) {
    return (
        <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <MapController center={center} markers={markers} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Always show center marker if no other markers, or include it in markers list from parent */}
                {markers.length === 0 && (
                    <Marker position={center}>
                        <Popup>City Center</Popup>
                    </Marker>
                )}
                {markers.map((marker, idx) => (
                    <Marker key={idx} position={[marker.lat, marker.lng]}>
                        <Popup>{marker.label}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
