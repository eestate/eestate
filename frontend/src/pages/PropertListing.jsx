
import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import PropertyFilter from '../components/PropertyFilter';
import PropertyCard from '../components/PropertyCard';
import { GridIcon, LayoutListIcon } from 'lucide-react';
import { useGetPropertiesQuery } from '../redux/services/propertyApi';
import { useLocation, useNavigate } from 'react-router-dom';

const PropertyListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const location = useLocation();
  const navigate = useNavigate();
  const [initialFiltersSet, setInitialFiltersSet] = useState(false);

  const [filters, setFilters] = useState(() => {
    const defaultFilters = {
      state_district: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bed: '',
      bathMin: '',
      minSqft: '',
      maxSqft: '',
      keyword: '',
      page: 1,
      limit: 9,
      sort: 'createdAt:desc',
    };

    console.log('Location state:', location.state);
    if (location.state?.filters && typeof location.state.filters === 'object') {
      return {
        ...defaultFilters,
        ...location.state.filters,
        page: location.state.filters.page || 1,
      };
    }
    return defaultFilters;
  });

  useEffect(() => {
    if (location.state?.filters && !initialFiltersSet) {
      console.log('Setting initial filters from location state:', location.state.filters);
      setFilters(prev => ({
        ...prev,
        ...location.state.filters,
        page: location.state.filters.page || 1,
      }));
      setInitialFiltersSet(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, initialFiltersSet]);

  useEffect(() => {
    console.log('Current filters in PropertyListing:', filters);
  }, [filters]);

  const apiFilters = {
    state_district: filters.state_district || undefined,
    propertyType: filters.propertyType || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    bed: filters.bed || undefined,
    bathMin: filters.bathMin || undefined,
    minSqft: filters.minSqft || undefined,
    maxSqft: filters.maxSqft || undefined,
    keyword: filters.keyword || undefined,
    page: filters.page || 1,
    limit: filters.limit || 9,
    sort: filters.sort || undefined,
  };

  const { data, isLoading, isFetching, isError, error } = useGetPropertiesQuery(apiFilters);
  const properties = Array.isArray(data?.properties) ? data.properties : [];
  const totalProperties = data?.total || 0;
  const totalPages = data?.pages || 1;

  const debouncedHandleFilterChange = debounce((newFilters) => {
    console.log('Applying new filters:', newFilters);
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, 300);

  const handleFilterChange = (newFilters) => {
    debouncedHandleFilterChange(newFilters);
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({
      ...prev,
      sort,
      page: 1,
    }));
  };

  const goToPreviousPage = () => {
    if (filters.page > 1) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToNextPage = () => {
    if (filters.page < totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const clearFilters = () => {
    setFilters({
      state_district: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bed: '',
      bathMin: '',
      minSqft: '',
      maxSqft: '',
      keyword: '',
      page: 1,
      limit: 9,
      sort: 'createdAt:desc',
    });
  };

  console.log('Passing filters to PropertyFilter:', filters);

  if (!filters) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">
        {filters.state_district || filters.propertyType
          ? `Properties in ${filters.state_district || filters.propertyType}`
          : 'All Properties'}
      </h1>

      <PropertyFilter
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        initialFilters={filters}
        onClear={clearFilters}
      />

      {(isLoading || isFetching) ? (
        <div className="flex justify-center items-center my-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {`${properties.length} of ${totalProperties} properties found`}
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

          {isError ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error?.data?.message || 'Failed to load properties.'}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No properties found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              >
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    id={property._id}
                    title={property.name}
                    price={`$${property.price.toLocaleString()}`}
                    location={`${property.location?.placeName}, ${property.location?.state_district}`}
                    image={property.images?.[0] || 'https://via.placeholder.com/400'}
                    beds={property.bedrooms}
                    baths={property.bathrooms}
                    area={property.sqft ? `${property.sqft} sq ft` : undefined}
                    type={property.propertyType}
                  />
                ))}
              </div>

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
        </>
      )}
    </div>
  );
};

export default PropertyListing;