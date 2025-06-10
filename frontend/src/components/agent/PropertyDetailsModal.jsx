import React from 'react';
import { X } from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, property, authData, onClose, onEdit, onDelete }) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
            alt={property.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="absolute bottom-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}
            >
              {property.status === 'available'
                ? '✓ Available'
                : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.name}</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{property.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Property Type:</span>
              <span className="text-sm font-medium">
                {property.subCategory.charAt(0).toUpperCase() + property.subCategory.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bedrooms/Bathrooms:</span>
              <span className="text-sm font-medium">
                {property.bedrooms ? `${property.bedrooms}b` : 'N/A'} /{' '}
                {property.bathrooms ? `${property.bathrooms}b` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Agent:</span>
              <span className="text-sm font-medium">{authData.user.name || 'Agent'}</span>
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