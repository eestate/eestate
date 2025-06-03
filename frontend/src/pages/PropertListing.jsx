import React, { useState } from 'react'
import PropertyFilter from '../components/PropertyFilter'
import PropertyCard from '../components/PropertyCard'
import { GridIcon, LayoutListIcon } from 'lucide-react'

// Mock data for properties
const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment with Sea View',
    price: '$450,000',
    location: 'Mumbai, Maharashtra',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    beds: 2,
    baths: 2,
    area: '1,200 sq ft',
    type: 'Apartment',
  },
  {
    id: '2',
    title: 'Luxury Villa with Private Pool',
    price: '$1,200,000',
    location: 'Goa',
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwdmlsbGF8ZW58MHx8MHx8&w=1000&q=80',
    beds: 4,
    baths: 5,
    area: '3,500 sq ft',
    type: 'Villa',
  },
  {
    id: '3',
    title: 'Commercial Space in Business District',
    price: '$850,000',
    location: 'Bangalore, Karnataka',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    area: '2,000 sq ft',
    type: 'Commercial',
  },
  {
    id: '4',
    title: 'Waterfront Land for Development',
    price: '$700,000',
    location: 'Kerala',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHxlbnwwfHwwfHw%3D&w=1000&q=80',
    area: '5 acres',
    type: 'Land',
  },
  {
    id: '5',
    title: 'Modern Family Home',
    price: '$320,000',
    location: 'Delhi NCR',
    image:
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2V8ZW58MHx8MHx8&w=1000&q=80',
    beds: 3,
    baths: 2,
    area: '1,800 sq ft',
    type: 'House',
  },
  {
    id: '6',
    title: 'Penthouse with Panoramic City Views',
    price: '$950,000',
    location: 'Hyderabad, Telangana',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwYXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    beds: 4,
    baths: 4,
    area: '2,500 sq ft',
    type: 'Apartment',
  },
]

const PropertyListing = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)

  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters)
    setFilteredProperties(mockProperties)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      <PropertyFilter onFilterChange={handleFilterChange} />
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {filteredProperties.length} properties found
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
          >
            <GridIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
          >
            <LayoutListIcon size={20} />
          </button>
        </div>
      </div>
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            location={property.location}
            image={property.image}
            beds={property.beds}
            baths={property.baths}
            area={property.area}
            type={property.type}
          />
        ))}
      </div>
    </div>
  )
}

export default PropertyListing
