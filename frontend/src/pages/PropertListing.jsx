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
    page: 1,
    limit: 9,
  });

  const { data, isLoading, isError, error } = useGetPropertiesQuery(filters);
  const properties = Array.isArray(data?.properties) ? data.properties : [];
  const totalProperties = data?.total || 0;
  const totalPages = data?.pages || 1;

  // Debug: API response log
  useEffect(() => {
    console.log('API Response:', { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: newFilters.propertyType || '',
      slug: newFilters.location || '',
      minPrice: newFilters.minPrice || '',
      maxPrice: newFilters.maxPrice || '',
      bed: newFilters.bedrooms || '',
      bathMin: newFilters.bathrooms || '',
      minSqft: newFilters.minSqft || '',
      maxSqft: newFilters.maxSqft || '',
      page: 1, // Reset to first page on filter
    }));
  };

  const goToPreviousPage = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToNextPage = () => {
    if (filters.page < totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      <PropertyFilter onFilterChange={handleFilterChange} />

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {isLoading
            ? 'Loading...'
            : `${properties.length} of ${totalProperties} properties found`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'
            } hover:bg-gray-300`}
          >
            <GridIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list' ? 'bg-gray-200' : 'bg-white'
            } hover:bg-gray-300`}
          >
            <LayoutListIcon size={20} />
          </button>
        </div>
      </div>

      {/* Properties Display */}
      {isLoading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : isError ? (
        <p className="text-center text-red-500">
          {error?.data?.message || 'Failed to load properties.'}
        </p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPreviousPage}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {filters.page} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={filters.page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyListing;