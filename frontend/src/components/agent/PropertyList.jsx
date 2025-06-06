import React from 'react';
import { Plus } from 'lucide-react';
import PropertyCard from './PropertyCard';



const PropertyList = ({ properties, activeFilter, setActiveFilter, setIsModalOpen, handlePropertyClick }) => {
  const filteredProperties = properties?.filter(property => property.status === activeFilter) || [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveFilter('available')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'available' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveFilter('sold')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'sold' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sold
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property._id} property={property} onClick={() => handlePropertyClick(property)} />
        ))}
      </div>
    </>
  );
};

export default PropertyList;