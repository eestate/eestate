import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom icons
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const HospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1483/1483264.png',
  iconSize: [15, 15],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const SchoolIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
  iconSize: [15, 15],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const RestaurantIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684669.png',
  iconSize: [15, 15],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Custom POI Control
const POIControl = ({ onPOISelect }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topright' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      div.style.backgroundColor = 'white';
      div.style.padding = '5px';
      div.style.border = '2px solid rgba(0,0,0,0.2)';
      div.innerHTML = `
        <style>
          .poi-button {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 16px;
            color: #333;
            transition: background-color 0.2s, color 0.2s;
          }
          .poi-button:hover {
            background-color: #f0f0f0;
            color: #0078d4;
          }
          .poi-tooltip {
            visibility: hidden;
            position: absolute;
            background-color: #333;
            color: white;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            white-space: nowrap;
            right: 35px;
            top: 50%;
            transform: translateY(-50%);
          }
          .poi-button:hover .poi-tooltip {
            visibility: visible;
          }
        </style>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <button class="poi-button" data-poi="hospital" title="Hospitals">
            <i class="fas fa-hospital"></i>
            <span class="poi-tooltip">Hospitals</span>
          </button>
          <button class="poi-button" data-poi="school" title="Schools">
            <i class="fas fa-school"></i>
            <span class="poi-tooltip">Schools</span>
          </button>
          <button class="poi-button" data-poi="restaurant" title="Restaurants">
            <i class="fas fa-utensils"></i>
            <span class="poi-tooltip">Restaurants</span>
          </button>
          <button class="poi-button" data-poi="clear" title="Clear POIs">
            <i class="fas fa-times"></i>
            <span class="poi-tooltip">Clear</span>
          </button>
        </div>
      `;

      // Prevent map click events on control
      L.DomEvent.disableClickPropagation(div);

      // Add click handlers
      div.querySelectorAll('.poi-button').forEach((button) => {
        button.addEventListener('click', () => {
          const poiType = button.getAttribute('data-poi');
          onPOISelect(poiType);
        });
      });

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onPOISelect]);

  return null;
};

const Map = ({ latitude, longitude, address, placeName }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [poiMarkers, setPoiMarkers] = useState([]);
  const [poiError, setPoiError] = useState(null);

  // Validate coordinates
  const isValidCoord = (lat, lng) =>
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= 8.0 &&
    lat <= 12.5 &&
    lng >= 74.5 &&
    lng <= 77.5;

  const position = isValidCoord(latitude, longitude)
    ? [latitude, longitude]
    : [10.8505, 76.2711]; // Fallback to Kerala center

  // Fetch POIs using Overpass API
  const fetchPOIs = async (poiType, lat, lng) => {
    if (poiType === 'clear') {
      setPoiMarkers([]);
      setPoiError(null);
      return;
    }

    try {
      const radius = 5000; // 5km
      const query = `
        [out:json];
        node
          ["amenity"="${poiType}"]
          (around:${radius},${lat},${lng});
        out body;
      `;
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      const data = await response.json();

      if (data.elements.length === 0) {
        setPoiError(`No ${poiType}s found within 5km.`);
        setPoiMarkers([]);
        return;
      }

      const markers = data.elements.map((element) => {
        const { lat, lon, tags } = element;
        const name = tags.name || 'Unnamed';
        const icon =
          poiType === 'hospital'
            ? HospitalIcon
            : poiType === 'school'
            ? SchoolIcon
            : RestaurantIcon;
        return {
          position: [lat, lon],
          name,
          type: poiType,
          icon,
        };
      });

      setPoiMarkers(markers);
      setPoiError(null);
    } catch (error) {
      console.error('POI fetch error:', error);
      setPoiError('Failed to load nearby places.');
      setPoiMarkers([]);
    }
  };

  // Handle POI button clicks
  const handlePOISelect = (poiType) => {
    fetchPOIs(poiType, position[0], position[1]);
  };

  useEffect(() => {
    // Set default icon for property marker
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView(position, 15);
      markerRef.current.setLatLng(position);
    }
  }, [latitude, longitude]);

  if (!isValidCoord(latitude, longitude)) {
    console.warn('Invalid coordinates, using fallback:', position);
  }

  return (
    <div className="h-full min-h-[300px] rounded-lg relative">
      {/* Error/Warning Messages */}
      {poiError && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow z-[1000]"
        >
          {poiError}
        </div>
      )}
      {!isValidCoord(latitude, longitude) && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow z-[1000]"
        >
          Location unavailable, showing default map
        </div>
      )}

      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Property Marker */}
        <Marker
          position={position}
          icon={DefaultIcon}
          ref={markerRef}
        >
          <Popup>
            <strong>{placeName || 'Property Location'}</strong>
            <br />
            {address || 'No address available'}
          </Popup>
        </Marker>
        {/* POI Markers */}
        {poiMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
            </Popup>
          </Marker>
        ))}
        {/* Custom POI Control */}
        <POIControl onPOISelect={handlePOISelect} />
      </MapContainer>
    </div>
  );
};

export default Map;