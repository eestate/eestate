import { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Kerala center coordinates (approx center point)
const KERALA_CENTER = [10.8505, 76.2711];

// Custom icons
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const UserLocationIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-location-marker' 
});

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(KERALA_CENTER);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setPosition([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const successCallback = (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 13);
        }
      };

      const errorCallback = (error) => {
        console.warn("Geolocation error:", error);
        setLocationError(`Location access: ${error.message}`);
      };

      navigator.geolocation.getCurrentPosition(
        successCallback, 
        errorCallback, 
        geoOptions
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  const LocationFinder = () => {
    const map = useMap();
    
    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    useEffect(() => {
      if (userLocation) {
        map.flyTo(userLocation, 13);
      }
    }, [userLocation, map]);

    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        console.log('Selected coordinates:', { lat, lng }); // Debug log

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const { state, state_district, village, county } = data.address;
            const locationData = {
              type: "Point",
              coordinates: [lng, lat],
              state: state || '',
              state_district: state_district || '',
              village: village || '',
              county: county || '',
              fullAddress: data.display_name || '',
              placeName: village || county || "Unknown location"
            };
            console.log('Location data:', locationData); // Debug log
            onLocationSelect(locationData);
          } else {
            setLocationError('Unable to fetch address details');
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setLocationError('Failed to fetch address details');
        }
      }
    });

    return null;
  };

  return (
    <div style={{ height: '400px', width: '100%', margin: '20px 0', position: 'relative' }}>
      {locationError && (
        <div className="alert alert-warning" style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '5px 10px'
        }}>
          {locationError}
        </div>
      )}
      
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={UserLocationIcon}
          >
            <Popup>Your current location</Popup>
          </Marker>
        )}
        
        {/* Selected location marker */}
        {position && (
          <Marker position={position}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
        
        <LocationFinder />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;