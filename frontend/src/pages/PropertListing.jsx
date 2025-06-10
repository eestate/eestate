import React, { useState, useEffect } from 'react';
import PropertyFilter from '../components/PropertyFilter';
import PropertyCard from '../components/PropertyCard';
import { GridIcon, LayoutListIcon } from 'lucide-react';
import { useGetPropertiesQuery } from '../redux/services/propertyApi';

const PropertyListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    propertyType: '',
    slug: '',
    minPrice: '',
    maxPrice: '',
    bed: '',
    bathMin: '',
    minSqft: '',
    maxSqft: '',
  });

  // Fetch properties with filters
  const { data, isLoading, isError, error } = useGetPropertiesQuery(filters);

  // Extract properties array and handle undefined/null cases
  const properties = Array.isArray(data?.properties) ? data.properties : [];
  const totalProperties = data?.total || 0;

  // Debug: Log response
  useEffect(() => {
    console.log('API Response:', { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

  const handleFilterChange = (newFilters) => {
    setFilters({
      propertyType: newFilters.propertyType || '',
      slug: newFilters.location || '',
      minPrice: newFilters.minPrice || '',
      maxPrice: newFilters.maxPrice || '',
      bed: newFilters.bedrooms || '',
      bathMin: newFilters.bathrooms || '',
      minSqft: newFilters.minSqft || '',
      maxSqft: newFilters.maxSqft || '',
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      <PropertyFilter onFilterChange={handleFilterChange} />
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {isLoading ? 'Loading...' : `${properties.length} of ${totalProperties} properties found`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-300`}
          >
            <GridIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-300`}
          >
            <LayoutListIcon size={20} />
          </button>
        </div>
      </div>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : isError ? (
        <p className="text-center text-red-500">
          {error?.data?.message || 'Failed to load properties.'}
        </p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}
        >
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.name}
              price={`$${property.price.toLocaleString()}`}
              location={property.address}
              image={property.images?.[0] || 'https://via.placeholder.com/400'}
              beds={property.bedrooms}
              baths={property.bathrooms}
              area={property.sqft ? `${property.sqft} sq ft` : undefined}
              type={property.propertyType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListing;