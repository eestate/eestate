import React, { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import PropertySpecificFields from './PropertySpecificFields';
import LocationPicker from '../LocationPicker';

const PropertyFormModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  images,
  setImages,
  fileInputRef,
  formError,
  setFormError,
  isLoading,
  onSubmit,
  isEditing,
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!images.length) {
      setImagePreviews([]);
      return;
    }

    const previews = images.map(image => {
      if (image instanceof File) {
        return URL.createObjectURL(image);
      }
      return image;
    });
    setImagePreviews(previews);

    return () => {
      previews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

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

  const handleLocationSelect = (locationData) => {
    setLocation(locationData);

    setFormData(prev => ({
      ...prev,
      coordinates: {
        lat: locationData.coordinates[1],
        lng: locationData.coordinates[0]
      },
      address: locationData.fullAddress,
      state: locationData.state,
      district: locationData.state_district,
      village: locationData.village,
      county: locationData.county,
      placeName: locationData.placeName
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setFormError('Only JPG/PNG/WEBP images under 10MB are allowed');
      return;
    }

    if (validFiles.length + images.length > 5) {
      setFormError('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const requiredFields = ['name', 'address', 'sqft'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length) {
      setFormError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Skip coordinate validation for edits if coordinates are already set
    if (!isEditing || !formData.coordinates || !formData.coordinates.lat || !formData.coordinates.lng) {
      const { lat, lng } = formData.coordinates;
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        setFormError('Please select a valid location on the map');
        return;
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setFormError('Invalid coordinates: Latitude must be -90 to 90, Longitude -180 to 180');
        return;
      }
    }

    const priceValue = parseFloat(formData.price.replace(/[^0-9.]/g, ''));
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    const propertyData = {
      ...formData,
      price: priceValue,
      sqft: parseInt(formData.sqft) || 0,
      features: formData.features 
        ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
        : [],
      latitude: formData.coordinates.lat,
      longitude: formData.coordinates.lng,
      bedrooms: parseInt(formData.bedrooms) || undefined,
      bathrooms: parseInt(formData.bathrooms) || undefined,
      floorNumber: parseInt(formData.floorNumber) || undefined,
      totalFloors: parseInt(formData.totalFloors) || undefined,
      plotArea: parseInt(formData.plotArea) || undefined,
      totalRooms: parseInt(formData.totalRooms) || undefined,
    };

    delete propertyData.coordinates;

    // Separate new images (Files) and existing images (URLs)
    const newImages = images.filter(image => image instanceof File);
    const existingImages = images.filter(image => typeof image === 'string');

    try {
      await onSubmit(propertyData, newImages, existingImages);
      if (!isEditing) {
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      setFormError(error?.data?.error || 'Failed to submit property. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white py-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Property' : 'Add Property'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">House</option>
                  <option value="plot">Plot</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="450,000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Feet <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter square footage"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location on Map <span className="text-red-500">*</span>
                </label>
                <LocationPicker 
                  onLocationSelect={handleLocationSelect} 
                  initialLocation={formData.coordinates}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Swimming pool, Garden, Garage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the property..."
                />
              </div>
            </div>
          </div>

          <PropertySpecificFields 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos (max 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photos"
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={images.length >= 5}
              />
              <label 
                htmlFor="photos" 
                className={`cursor-pointer flex flex-col items-center justify-center ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-500 text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">
                    {images.length > 0 
                      ? `Add more images (${5 - images.length} remaining)`
                      : 'Click to upload images'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WEBP (max 10MB each)</p>
                </div>
              </label>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Property' : 'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;