import React from 'react';
import { Bed, Bath, Home } from 'lucide-react';

const PropertyCard = ({ property, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.name}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-3">${property.price.toLocaleString()}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Home className="w-4 h-4" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;