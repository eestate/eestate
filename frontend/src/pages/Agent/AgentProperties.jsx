import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Bed, Bath, Home } from 'lucide-react';
import { useGetMyPropertiesQuery, useCreatePropertyMutation, useEditPropertyMutation, useDeletePropertyMutation } from '@/redux/services/AgentApi';
import { useCheckAuthQuery } from '@/redux/services/authApi';

const AgentProperties = () => {
  const { data: authData, isLoading: authLoading } = useCheckAuthQuery();
  const { data: properties, isLoading: propertiesLoading, error: propertiesError } = useGetMyPropertiesQuery(undefined, {
    skip: !authData || authData.user?.role !== 'agent',
  });
  const [createProperty, { isLoading: createLoading, error: createError, isSuccess: createSuccess }] = useCreatePropertyMutation();
  const [editProperty, { isLoading: editLoading, error: editError, isSuccess: editSuccess }] = useEditPropertyMutation();
  const [deleteProperty, { isLoading: deleteLoading, error: deleteError }] = useDeletePropertyMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeFilter, setActiveFilter] = useState('available');
  const [formData, setFormData] = useState({
    name: '',
    propertyType: 'apartment',
    address: '',
    price: '',
    sqft: '',
    description: '',
    features: '',
    type: 'sale',
    subCategory: 'apartment',
    coordinates: { lat: 0, lng: 0 },
    bedrooms: '',
    bathrooms: '',
    floorNumber: '',
    totalFloors: '',
    balcony: false,
    plotArea: '',
    garden: false,
    swimmingPool: false,
    garage: false,
    plotType: 'residential',
    boundaryWall: false,
    totalRooms: '',
    sharedRooms: false,
    foodIncluded: false,
  });
  const [images, setImages] = useState([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (createSuccess || editSuccess) {
      setSuccessMessage(`Property ${selectedProperty ? 'updated' : 'added'} successfully!`);
      resetFormData();
      setIsModalOpen(false);
      setSelectedProperty(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, [createSuccess, editSuccess]);

  useEffect(() => {
    if (createError || editError) {
      setFormError((createError || editError)?.data?.error || 'An error occurred. Please try again.');
    }
  }, [createError, editError]);

  if (authLoading || propertiesLoading) {
    return <div className="p-6 bg-gray-50">Loading...</div>;
  }

  if (propertiesError || !authData || authData.user?.role !== 'agent') {
    return <div className="p-6 bg-gray-50">Unauthorized or error fetching data: {propertiesError?.data?.message}</div>;
  }

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedProperty.name || '',
      propertyType: selectedProperty.propertyType || 'apartment',
      address: selectedProperty.address || '',
      price: selectedProperty.price ? `$${selectedProperty.price.toLocaleString()}` : '',
      sqft: selectedProperty.sqft || '',
      description: selectedProperty.description || '',
      features: selectedProperty.features?.join(', ') || '',
      type: selectedProperty.type || 'sale',
      subCategory: selectedProperty.subCategory || 'apartment',
      coordinates: selectedProperty.coordinates || { lat: 0, lng: 0 },
      bedrooms: selectedProperty.bedrooms || '',
      bathrooms: selectedProperty.bathrooms || '',
      floorNumber: selectedProperty.floorNumber || '',
      totalFloors: selectedProperty.totalFloors || '',
      balcony: selectedProperty.balcony || false,
      plotArea: selectedProperty.plotArea || '',
      garden: selectedProperty.garden || false,
      swimmingPool: selectedProperty.swimmingPool || false,
      garage: selectedProperty.garage || false,
      plotType: selectedProperty.plotType || 'residential',
      boundaryWall: selectedProperty.boundaryWall || false,
      totalRooms: selectedProperty.totalRooms || '',
      sharedRooms: selectedProperty.sharedRooms || false,
      foodIncluded: selectedProperty.foodIncluded || false,
    });
    setImages([]);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      console.log(`Deleting property with ID: ${selectedProperty._id}`);
      if (!selectedProperty._id || !/^[0-9a-fA-F]{24}$/.test(selectedProperty._id)) {
        console.error("Invalid property ID:", selectedProperty._id);
        setFormError("Invalid property ID.");
        return;
      }
      await deleteProperty(selectedProperty._id).unwrap();
      setIsDetailsModalOpen(false);
      setIsDeleteConfirmOpen(false);
      setSelectedProperty(null);
      setSuccessMessage("Property deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete error:", {
        status: err.status,
        data: err.data,
        message: err.message,
      });
      // Handle PARSING_ERROR specifically
      const errorMessage =
        err.status === "PARSING_ERROR"
          ? "Server returned an unexpected response. Please check the server logs."
          : err.data?.error || err.message || "Failed to delete property. Please try again.";
      setFormError(errorMessage);
    }
  };
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProperty(null);
  };

  const filteredProperties = properties?.filter(property => property.status === activeFilter) || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormError('');
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: parseFloat(value) || 0 },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    setImages(files);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      propertyType: 'apartment',
      address: '',
      price: '',
      sqft: '',
      description: '',
      features: '',
      type: 'sale',
      subCategory: 'apartment',
      coordinates: { lat: 0, lng: 0 },
      bedrooms: '',
      bathrooms: '',
      floorNumber: '',
      totalFloors: '',
      balcony: false,
      plotArea: '',
      garden: false,
      swimmingPool: false,
      garage: false,
      plotType: 'residential',
      boundaryWall: false,
      totalRooms: '',
      sharedRooms: false,
      foodIncluded: false,
    });
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate price
    const priceValue = parseFloat(formData.price.replace(/[^0-9.]/g, ''));
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.address || !formData.sqft) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const propertyData = {
      propertyType: formData.propertyType,
      name: formData.name,
      description: formData.description || undefined,
      price: priceValue,
      type: formData.type,
      subCategory: formData.propertyType === 'plot' ? formData.plotType : formData.propertyType,
      address: formData.address,
      coordinates: formData.coordinates,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      sqft: parseInt(formData.sqft) || 0,
      bedrooms: parseInt(formData.bedrooms) || undefined,
      bathrooms: parseInt(formData.bathrooms) || undefined,
      floorNumber: parseInt(formData.floorNumber) || undefined,
      totalFloors: parseInt(formData.totalFloors) || undefined,
      balcony: formData.balcony,
      plotArea: parseInt(formData.plotArea) || undefined,
      garden: formData.garden,
      swimmingPool: formData.swimmingPool,
      garage: formData.garage,
      plotType: formData.plotType,
      boundaryWall: formData.boundaryWall,
      totalRooms: parseInt(formData.totalRooms) || undefined,
      sharedRooms: formData.sharedRooms,
      foodIncluded: formData.foodIncluded,
    };

    try {
      if (selectedProperty) {
        await editProperty({ id: selectedProperty._id, propertyData, images }).unwrap();
      } else {
        await createProperty({ propertyData, images }).unwrap();
      }
    } catch (err) {
      setFormError(err?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormData();
    setSelectedProperty(null);
  };

  const renderPropertySpecificFields = () => {
    switch (formData.propertyType) {
      case 'apartment':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                <input
                  type="number"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="balcony"
                checked={formData.balcony}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Has Balcony</label>
            </div>
          </>
        );
      case 'villa':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (sq ft)</label>
              <input
                type="number"
                name="plotArea"
                value={formData.plotArea}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Has Garden</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="swimmingPool"
                  checked={formData.swimmingPool}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Has Swimming Pool</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="garage"
                  checked={formData.garage}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Has Garage</label>
              </div>
            </div>
          </>
        );
      case 'plot':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plot Type</label>
              <select
                name="plotType"
                value={formData.plotType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="boundaryWall"
                checked={formData.boundaryWall}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Has Boundary Wall</label>
            </div>
          </>
        );
      case 'hostel':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="sharedRooms"
                  checked={formData.sharedRooms}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Has Shared Rooms</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="foodIncluded"
                  checked={formData.foodIncluded}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Food Included</label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      {formError && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {formError}
        </div>
      )}

      {/* Header */}
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

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePropertyClick(property)}
          >
            <div className="relative">
              <img
                src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{property.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-3">${property.price.toLocaleString()}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Modal */}
      {isDetailsModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
                alt={selectedProperty.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeDetailsModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProperty.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {selectedProperty.status === 'available'
                    ? '✓ Available'
                    : selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedProperty.name}</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{selectedProperty.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-lg font-bold text-gray-900">${selectedProperty.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Property Type:</span>
                  <span className="text-sm font-medium">
                    {selectedProperty.subCategory.charAt(0).toUpperCase() + selectedProperty.subCategory.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bedrooms/Bathrooms:</span>
                  <span className="text-sm font-medium">
                    {selectedProperty.bedrooms ? `${selectedProperty.bedrooms}b` : 'N/A'} /{' '}
                    {selectedProperty.bathrooms ? `${selectedProperty.bathrooms}b` : 'N/A'}
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
                    {selectedProperty.description || 'No description available.'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProperty.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedProperty ? 'Edit Property' : 'Add Property'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                      subCategory: e.target.value === 'plot' ? formData.plotType : e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $450,000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.coordinates.lat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.coordinates.lng}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              {renderPropertySpecificFields()}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Swimming pool, Garden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photos (up to 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photos"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="photos" className="cursor-pointer">
                    <div className="text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm">Upload Images ({images.length} selected)</span>
                    </div>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={createLoading || editLoading}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {createLoading || editLoading
                  ? selectedProperty
                    ? 'Updating...'
                    : 'Adding...'
                  : selectedProperty
                  ? 'Update Property'
                  : 'Add Property'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProperties;