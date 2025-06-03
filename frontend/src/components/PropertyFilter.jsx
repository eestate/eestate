import React, { useState } from 'react'
import { SlidersIcon } from 'lucide-react'

const PropertyFilter = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    priceRange: [0, 10000000],
    location: '',
    bedrooms: '',
    propertySize: '',
  })

  const handleFilterChange = (key, value) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

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
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
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
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange('priceRange', [
                  parseInt(e.target.value),
                  filters.priceRange[1],
                ])
              }
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange('priceRange', [
                  filters.priceRange[0],
                  parseInt(e.target.value),
                ])
              }
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
            value={filters.location}
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
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Size
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.propertySize}
              onChange={(e) =>
                handleFilterChange('propertySize', e.target.value)
              }
            >
              <option value="">Any</option>
              <option value="small">Small (Less than 1000 sq ft)</option>
              <option value="medium">Medium (1000-2000 sq ft)</option>
              <option value="large">Large (2000+ sq ft)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyFilter
