import React from 'react';
import { X } from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, property, authData, onClose, onEdit, onDelete }) => {
  if (!isOpen || !property) return null;

  const imageSrc = Array.isArray(property.images) && property.images.length > 0 
    ? property.images[0] 
    : '/images/placeholder-image.jpg';
  const status = property.status?.toLowerCase() || 'unknown';
  const propertyType = property.propertyType 
    ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
    : 'N/A';

  return (
    <div className="fixed inset-0 bg-gray-300  flex items-center justify-center z-50 p-4">
      <div className="bg-white   rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={imageSrc}
            alt={property.name || 'Property image'}
            className="w-full h-64 object-cover rounded-t-2xl"
            onError={(e) => { e.target.src = '/images/placeholder-image.jpg'; }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="absolute bottom-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'available' ? 'bg-green-800 text-white' : 'bg-gray-600 text-white'
              }`}
            >
              {status === 'available'
                ? '✓ Available'
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.name || 'Unnamed Property'}</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{property.address || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-lg font-medium text-gray-900">
                ${typeof property.price === 'number' ? property.price.toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Property Type:</span>
              <span className="text-sm font-medium">{propertyType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bedrooms/Bathrooms:</span>
              <span className="text-sm font-medium">
                {property.bedrooms ?? 'N/A'} / {property.bathrooms ?? 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Agent:</span>
              <span className="text-sm font-medium">{authData?.user?.name || 'Agent'}</span>
            </div>
            <hr className="my-4" />
            <div>
              <span className="text-sm text-gray-600 block mb-2">Description:</span>
              <p className="text-sm text-gray-800 leading-relaxed">
                {property.description || 'No description available.'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;