import React, { useState, useRef, useEffect } from 'react';
import { useGetMyPropertiesQuery, useCreatePropertyMutation, useEditPropertyMutation, useDeletePropertyMutation } from '@/redux/services/AgentApi';
import { useCheckAuthQuery } from '@/redux/services/authApi';
import PropertyList from '@/components/agent/PropertyList';
import PropertyDetailsModal from '@/components/agent/PropertyDetailsModal';
import DeleteConfirmModal from '@/components/agent/DeleteConfirmModal';
import PropertyFormModal from '@/components/agent/PropertyFormModal';

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

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormData();
    setSelectedProperty(null);
  };

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
      setFormError(createError?.data?.error || editError?.data?.error || 'An error occurred. Please try again.');
    }
  }, [createError, editError]);

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

  const handlePropertyClick = (property) => {
    if (!property?._id || !/^[0-9a-fA-F]{24}$/.test(property._id)) {
      console.error('Invalid property ID in handlePropertyClick:', property._id);
      setFormError('Invalid property selected. Please try again.');
      return;
    }
    console.log('Selected property ID:', property._id);
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = () => {
    if (!selectedProperty?._id || !/^[0-9a-fA-F]{24}$/.test(selectedProperty._id)) {
      console.error('Invalid property ID in handleEdit:', selectedProperty?._id);
      setFormError('Cannot edit: Invalid property ID.');
      return;
    }
    console.log('Editing property ID:', selectedProperty._id);

    setFormData({
      name: selectedProperty.name || '',
      propertyType: selectedProperty.propertyType || 'apartment',
      address: selectedProperty.address || '',
      price: selectedProperty.price ? `$${selectedProperty.price.toLocaleString()}` : '',
      sqft: selectedProperty.sqft || '',
      description: selectedProperty.description || '',
      features: Array.isArray(selectedProperty.features) ? selectedProperty.features.join(', ') : '',
      type: selectedProperty.type || 'sale',
      coordinates: selectedProperty.location?.coordinates 
        ? { lat: selectedProperty.location.coordinates[1], lng: selectedProperty.location.coordinates[0] } 
        : { lat: 0, lng: 0 },
      bedrooms: selectedProperty.bedrooms || '',
      bathrooms: selectedProperty.bathrooms || '',
      floorNumber: selectedProperty.floorNumber || '',
      totalFloors: selectedProperty.totalFloors || '',
      balcony: !!selectedProperty.balcony,
      plotArea: selectedProperty.plotArea || '',
      garden: !!selectedProperty.garden,
      swimmingPool: !!selectedProperty.swimmingPool,
      garage: !!selectedProperty.garage,
      plotType: selectedProperty.plotType || 'residential',
      boundaryWall: !!selectedProperty.boundaryWall,
      totalRooms: selectedProperty.totalRooms || '',
      sharedRooms: !!selectedProperty.sharedRooms,
      foodIncluded: !!selectedProperty.foodIncluded,
    });
    setImages(Array.isArray(selectedProperty.images) ? selectedProperty.images : []);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

const confirmDelete = async () => {
  try {
    if (!selectedProperty?._id || !/^[0-9a-fA-F]{24}$/.test(selectedProperty._id)) {
      throw new Error(`Invalid property ID: ${selectedProperty?._id}`);
    }
    const deleteUrl = `http://localhost:3003/api/agent/${selectedProperty._id}`;
    console.log('Submitting delete for property ID:', selectedProperty._id, 'URL:', deleteUrl);
    await deleteProperty(selectedProperty._id).unwrap();
    setIsDetailsModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setSelectedProperty(null);
    setSuccessMessage('Property deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Delete error:', {
      message: err.message,
      data: err.data,
      status: err.status,
      id: selectedProperty?._id,
      response: err,
      url: `http://localhost:3003/api/agent/${selectedProperty?._id}`
    });
    const errorMessage = err?.data?.error || err?.data?.details || err.message || 'Failed to delete property. Please try again.';
    setFormError(errorMessage);
  }
};

  if (authLoading || propertiesLoading) {
    return <div className="p-6 bg-gray-50">Loading...</div>;
  }

  if (propertiesError || !authData || authData.user?.role !== 'agent') {
    return <div className="p-6 bg-gray-50">Unauthorized or error fetching data: {propertiesError?.data?.message}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
      <PropertyList
        properties={properties}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        setIsModalOpen={setIsModalOpen}
        handlePropertyClick={handlePropertyClick}
      />
      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        property={selectedProperty}
        authData={authData}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        property={selectedProperty}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
      />
<PropertyFormModal
  isOpen={isModalOpen}
  onClose={closeModal}
  formData={formData}
  setFormData={setFormData}
  images={images}
  setImages={setImages}
  fileInputRef={fileInputRef}
  formError={formError}
  setFormError={setFormError}
  isLoading={createLoading || editLoading}
  onSubmit={async (propertyData, newImages, existingImages) => {
    try {
      if (selectedProperty) {
        if (!selectedProperty._id || !/^[0-9a-fA-F]{24}$/.test(selectedProperty._id)) {
          throw new Error(`Invalid property ID: ${selectedProperty._id}`);
        }
        const editUrl = `http://localhost:3003/api/agent/${selectedProperty._id}`;
        console.log('Submitting edit for property ID:', selectedProperty._id, 'URL:', editUrl);
        console.log('New images:', newImages.map(img => ({
          name: img.name,
          size: img.size,
          type: img.type
        })));
        await editProperty({
          id: selectedProperty._id,
          propertyData: { ...propertyData, existingImages },
          images: newImages
        }).unwrap();
      } else {
        console.log('Submitting new property creation');
        console.log('New images:', newImages.map(img => ({
          name: img.name,
          size: img.size,
          type: img.type
        })));
        await createProperty({ propertyData, images: newImages }).unwrap();
      }
      setSuccessMessage(`Property ${selectedProperty ? 'edited' : 'created'} successfully!`);
    } catch (err) {
      console.error('Submit error:', {
        message: err.message,
        data: err.data,
        status: err.status,
        id: selectedProperty?._id,
        response: err,
        url: `http://localhost:3003/api/agent/${selectedProperty?._id}`
      });
      setFormError(err?.data?.error || err?.data?.details || err.message || 'Failed to update property. Please try again.');
    }
  }}
  isEditing={!!selectedProperty} 
/>
    </div>
  );
};

export default AgentProperties;