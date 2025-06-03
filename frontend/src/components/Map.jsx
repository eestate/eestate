import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const Map = ({ latitude, longitude, address }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [latitude, longitude],
        15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 15)
    }

    const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current)
    marker.bindPopup(address).openPopup()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, address])

  return <div ref={mapRef} className="h-full min-h-[300px] rounded-lg" />
}

export default Map
