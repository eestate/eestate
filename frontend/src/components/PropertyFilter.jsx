
import React, { useState, useEffect } from 'react';
import { SlidersIcon } from 'lucide-react';

const PropertyFilter = ({ onFilterChange, onSortChange, initialFilters, onClear }) => {
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
    sort: 'createdAt:desc',
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState(initialFilters || defaultFilters);

  useEffect(() => {
    if (initialFilters) {
      setFilters({
        ...defaultFilters,
        ...initialFilters,
        location: initialFilters.state_district || '',
        bedrooms: initialFilters.bed || '',
        bathrooms: initialFilters.bathMin || '',
        propertySize:
          initialFilters.minSqft === '0' && initialFilters.maxSqft === '1000'
            ? 'small'
            : initialFilters.minSqft === '1000' && initialFilters.maxSqft === '2000'
            ? 'medium'
            : initialFilters.minSqft === '2000' && initialFilters.maxSqft === ''
            ? 'large'
            : '',
      });
    } else {
      setFilters(defaultFilters);
    }
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };

    let minSqft = '';
    let maxSqft = '';
    if (updatedFilters.propertySize === 'small') {
      minSqft = '0';
      maxSqft = '1000';
    } else if (updatedFilters.propertySize === 'medium') {
      minSqft = '1000';
      maxSqft = '2000';
    } else if (updatedFilters.propertySize === 'large') {
      minSqft = '2000';
      maxSqft = '';
    }

    const backendFilters = {
      state_district: updatedFilters.location,
      propertyType: updatedFilters.propertyType,
      minPrice: updatedFilters.minPrice,
      maxPrice: updatedFilters.maxPrice,
      bed: updatedFilters.bedrooms,
      bathMin: updatedFilters.bathrooms,
      minSqft,
      maxSqft,
      sort: updatedFilters.sort,
    };

    setFilters(updatedFilters);
    onFilterChange(backendFilters);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setFilters(prev => {
      const newFilters = { ...prev, sort };
      onSortChange(sort);
      onFilterChange({
        ...newFilters,
        state_district: newFilters.location,
        bed: newFilters.bedrooms,
        bathMin: newFilters.bathrooms,
      });
      return newFilters;
    });
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    onClear();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-blue-600"
        >
          <SlidersIcon size={16} className="mr-1" />
          {isExpanded ? 'Hide Filters' : 'Show All Filters'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.propertyType || ''}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
            <option value="plot">Plot</option>
            <option value="hostel">Hostel</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter location"
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            >
              <option value="">Any</option>
              <option value="1+">1 or more</option>
              <option value="2+">2 or more</option>
              <option value="3+">3 or more</option>
              <option value="4+">4 or more</option>
              <option value="5+">5 or more</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Size
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.propertySize || ''}
              onChange={(e) => handleFilterChange('propertySize', e.target.value)}
            >
              <option value="">Any</option>
              <option value="small">Small (Less than 1000 sq ft)</option>
              <option value="medium">Medium (1000-2000 sq ft)</option>
              <option value="large">Large (2000+ sq ft)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.sort || 'createdAt:desc'}
              onChange={handleSortChange}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="bedrooms:asc">Bedrooms: Low to High</option>
              <option value="bedrooms:desc">Bedrooms: High to Low</option>
            </select>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilter;