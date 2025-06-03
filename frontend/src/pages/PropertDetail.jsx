import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Map from '../components/Map'
import AgentContact from '../components/AgentContact'
import PropertyCard from '../components/PropertyCard'
import {
  BedIcon,
  BathIcon,
  SquareIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

// Mock property data
const propertyData = {
  id: '1',
  title: 'Modern Apartment with Sea View',
  description:
    'This beautiful modern apartment offers stunning sea views from its spacious balcony. Located in a premium neighborhood with easy access to beaches, restaurants, and shopping centers. The apartment features high-end finishes, an open concept living area, a fully equipped kitchen, and large windows that allow plenty of natural light.',
  price: '$450,000',
  location: 'Mumbai, Maharashtra, India',
  coordinates: {
    latitude: 19.076,
    longitude: 72.8777,
  },
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8&w=1000&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8&w=1000&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8&w=1000&q=80',
  ],
  details: {
    beds: 2,
    baths: 2,
    area: '1,200 sq ft',
    built: 2020,
    type: 'Apartment',
    status: 'For Sale',
  },
  features: [
    'Sea View',
    'Balcony',
    'Parking Space',
    'Swimming Pool',
    'Gym',
    '24/7 Security',
    'Elevator',
    'Air Conditioning',
    'Furnished',
  ],
  agent: {
    name: 'Priya Sharma',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80',
    phone: '+91 98765 43210',
    email: 'priya.sharma@eestate.com',
  },
}

// Mock similar properties
const similarProperties = [
  {
    id: '2',
    title: 'Luxury Apartment with Ocean View',
    price: '$520,000',
    location: 'Mumbai, Maharashtra',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwYXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    beds: 3,
    baths: 2,
    area: '1,400 sq ft',
    type: 'Apartment',
  },
  {
    id: '3',
    title: 'Beachfront Condo',
    price: '$480,000',
    location: 'Goa',
    image:
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhY2glMjBhcGFydG1lbnR8ZW58MHx8MHx8&w=1000&q=80',
    beds: 2,
    baths: 2,
    area: '1,100 sq ft',
    type: 'Apartment',
  },
]

const PropertyDetail = () => {
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const property = propertyData

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPinIcon size={16} className="mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
            <HeartIcon size={18} />
            <span>Save</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
            <ShareIcon size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mb-8 h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full"
        >
          <ChevronRightIcon size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentImageIndex === index
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Price and Key Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-600">
                {property.price}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                <div className="flex items-center">
                  <BedIcon size={20} className="mr-2 text-gray-600" />
                  <span>{property.details.beds} Beds</span>
                </div>
                <div className="flex items-center">
                  <BathIcon size={20} className="mr-2 text-gray-600" />
                  <span>{property.details.baths} Baths</span>
                </div>
                <div className="flex items-center">
                  <SquareIcon size={20} className="mr-2 text-gray-600" />
                  <span>{property.details.area}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Property Type</p>
                <p className="font-medium">{property.details.type}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">{property.details.status}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Year Built</p>
                <p className="font-medium">{property.details.built}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <div className="h-[300px]">
              <Map
                latitude={property.coordinates.latitude}
                longitude={property.coordinates.longitude}
                address={property.location}
              />
            </div>
          </div>

          {/* Similar Properties - Moved here from sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Now only contains AgentContact */}
        <div>
          <AgentContact agent={property.agent} />
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail