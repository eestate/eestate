import React from 'react'
import { Link } from 'react-router-dom'
import { MapPinIcon, BedIcon, BathIcon, SquareIcon } from 'lucide-react'

const PropertyCard = ({
  id,
  title,
  price,
  location,
  image,
  beds,
  baths,
  area,
  type,
}) => {
  return (
    <Link
      to={`/property/${id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          {type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="text-xl font-bold my-1">{price}</p>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPinIcon size={14} className="mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
        {(beds || baths || area) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2 text-sm text-gray-700">
            {beds !== undefined && (
              <div className="flex items-center">
                <BedIcon size={14} className="mr-1" />
                <span>{beds} Beds</span>
              </div>
            )}
            {baths !== undefined && (
              <div className="flex items-center">
                <BathIcon size={14} className="mr-1" />
                <span>{baths} Baths</span>
              </div>
            )}
            {area && (
              <div className="flex items-center">
                <SquareIcon size={14} className="mr-1" />
                <span>{area}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default PropertyCard
