import React from 'react';
import { X, MapPin, Home, Bed, Bath, DollarSign, User, Calendar, Ruler } from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, property, authData, onClose, onEdit, onDelete, onMarkAsSold, isStatusLoading }) => {
  if (!isOpen || !property) return null;

  const imageSrc = Array.isArray(property.images) && property.images.length > 0 
    ? property.images[0] 
    : '/images/placeholder-image.jpg';
  const status = property.status?.toLowerCase() || 'unknown';
  const propertyType = property.propertyType 
    ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
    : 'N/A';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4  bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header with Image */}
        <div className="relative">
          <img
            src={imageSrc}
            alt={property.name || 'Property image'}
            className="w-full h-96 object-cover rounded-t-2xl"
            onError={(e) => { e.target.src = '/images/placeholder-image.jpg'; }}
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <div className="absolute bottom-6 left-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : status === 'sold'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status === 'available'
                ? '✓ Available'
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {/* Property Title and Price */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{property.name || 'Unnamed Property'}</h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.address || 'Location not specified'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Asking Price</p>
              <p className="text-2xl font-bold text-blue-600">
                ${typeof property.price === 'number' ? property.price.toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Property Highlights */}
          <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Type</span>
              <span className="text-sm font-medium">{propertyType}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Bedrooms</span>
              <span className="text-sm font-medium">{property.bedrooms ?? 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Bath className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Bathrooms</span>
              <span className="text-sm font-medium">{property.bathrooms ?? 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Ruler className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Area</span>
              <span className="text-sm font-medium">
                {property.sqft ? `${property.sqft} sqft` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Property Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'No description available for this property.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Agent Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{authData?.user?.name || 'Agent Name'}</p>
                  <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                  <p className="text-sm text-blue-600">Contact Agent</p>
                </div>
              </div>
            </div>
          </div>

          {authData?.user?.role === 'agent' && (
            <div className="flex space-x-4 border-t border-gray-200 pt-6">
              <button
                onClick={onEdit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                <span>Edit Property</span>
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-100 text-red-600 py-3 px-6 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                <span>Delete Property</span>
              </button>
              {(status === 'available' || status === 'sold') && (
  <button
    onClick={onMarkAsSold}
    disabled={isStatusLoading}
    className={`flex-1 ${
      status === 'available' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
    } text-white py-3 px-6 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2 ${
      isStatusLoading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {isStatusLoading
      ? 'Processing...'
      : status === 'available'
        ? 'Mark as Sold'
        : 'Mark as Available'}
  </button>
)}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;