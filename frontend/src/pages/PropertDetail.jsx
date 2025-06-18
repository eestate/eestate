

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Map from '../components/Map';
// import AgentContact from '../components/AgentContact';
// import PropertyCard from '../components/PropertyCard';
// import {
//   BedIcon,
//   BathIcon,
//   SquareIcon,
//   MapPinIcon,
//   CalendarIcon,
//   HouseIcon,
//   HeartIcon,
//   ShareIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from 'lucide-react';
// import { useGetPropertyQuery, useGetSimilarPropertiesQuery } from '../redux/services/propertyApi';
// import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../redux/services/userApi';

// const PropertyDetail = () => {
//   const { id } = useParams();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Fetch property details
//   const { data: property, isLoading, isError, error } = useGetPropertyQuery(id);

//   // Fetch wishlist to check if property is saved
//   const { data: wishlist = [] } = useGetWishlistQuery();
//   const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
//   const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

//   // Check if property is in wishlist
//   const isWishlisted = wishlist.some((prop) => prop._id === id);

//   // Fetch similar properties
//   const { data: similarData, isLoading: similarLoading } = useGetSimilarPropertiesQuery(
//     { propertyType: property?.propertyType, excludeId: id },
//     { skip: !property?.propertyType }
//   );

//   const similarProperties = Array.isArray(similarData?.properties) ? similarData.properties : [];

//   // Debug: Log API responses
//   useEffect(() => {
//     console.log('Property Response:', { property, isLoading, isError, error });
//     console.log('Wishlist:', wishlist);
//     console.log('Similar Properties Response:', { similarData, similarLoading });
//   }, [property, isLoading, isError, error, wishlist, similarData, similarLoading]);

//   const handleWishlistToggle = async () => {
//     if (isAdding || isRemoving) return;
//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(id).unwrap();
//       } else {
//         await addToWishlist(id).unwrap();
//       }
//     } catch (err) {
//       console.error('Wishlist toggle error:', err);
//     }
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === (property?.images?.length || 1) - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1
//     );
//   };

//   if (isLoading) {
//     return <p className="text-center text-gray-600 py-8">Loading property details...</p>;
//   }

//   if (isError || !property) {
//     return (
//       <p className="text-center text-red-500 py-8">
//         {error?.data?.message || 'Failed to load property details.'}
//       </p>
//     );
//   }

//   return (
//     <div className="container mx-auto px-6 py-8 bg-gray-100 text-gray-900">
//       {/* Title and Actions */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
//           <div className="flex items-center text-gray-600">
//             <MapPinIcon size={16} className="mr-1" />
//             <span>{property.address}</span>
//           </div>
//         </div>
//         <div className="flex gap-4 mt-4 md:mt-0">
//           <button
//             onClick={handleWishlistToggle}
//             disabled={isAdding || isRemoving}
//             className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 ${
//               isWishlisted ? 'text-red-500' : ''
//             }`}
//           >
//             <HeartIcon size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
//             <span>{isWishlisted ? 'Saved' : 'Save'}</span>
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
//             <ShareIcon size={18} />
//             <span>Share</span>
//           </button>
//         </div>
//       </div>

//       {/* Carousel */}
//       <div className="relative mb-8 h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
//         <img
//           src={property.images?.[currentImageIndex] || 'https://via.placeholder.com/400'}
//           alt={property.name}
//           className="w-full h-full object-cover"
//         />
//         <button
//           onClick={prevImage}
//           className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
//         >
//           <ChevronLeftIcon size={24} />
//         </button>
//         <button
//           onClick={nextImage}
//           className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
//         >
//           <ChevronRightIcon size={24} />
//         </button>
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//           {property.images?.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentImageIndex(index)}
//               className={`w-3 h-3 rounded-full ${
//                 currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Content */}
//         <div className="lg:col-span-2">
//           {/* Price and Key Details */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 ${property.price.toLocaleString()}
//               </h2>
//               <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
//                 {property.bedrooms !== undefined && (
//                   <div className="flex items-center">
//                     <BedIcon size={20} className="mr-2 text-gray-600" />
//                     <span>{property.bedrooms} Beds</span>
//                   </div>
//                 )}
//                 {property.bathrooms !== undefined && (
//                   <div className="flex items-center">
//                     <BathIcon size={20} className="mr-2 text-gray-600" />
//                     <span>{property.bathrooms} Baths</span>
//                   </div>
//                 )}
//                 {property.sqft && (
//                   <div className="flex items-center">
//                     <SquareIcon size={20} className="mr-2 text-gray-600" />
//                     <span>{property.sqft} sq ft</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-gray-500 text-sm">Property Type</p>
//                 <p className="font-medium capitalize">{property.propertyType}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500 text-sm">Status</p>
//                 <p className="font-medium capitalize">{property.status}</p>
//               </div>
//               {property.floorNumber && (
//                 <div>
//                   <p className="text-gray-500 text-sm">Floor</p>
//                   <p className="font-medium">{property.floorNumber}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h3 className="text-xl font-bold mb-4">Description</h3>
//             <p className="text-gray-700">{property.description || 'No description available.'}</p>
//           </div>

//           {/* Features */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h3 className="text-xl font-bold mb-4">Features</h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {(property.features || []).map((feature, index) => (
//                 <div key={index} className="flex items-center">
//                   <div className="w-2 h-2 bg-gray-900 rounded-full mr-2"></div>
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Map */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h3 className="text-xl font-bold mb-4">Location</h3>
//             <div className="h-[300px]">
//               <Map
//                 latitude={property.coordinates ? JSON.parse(property.coordinates).lat : 0}
//                 longitude={property.coordinates ? JSON.parse(property.coordinates).lng : 0}
//                 address={property.address}
//               />
//             </div>
//           </div>

//           {/* Similar Properties */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
//             {similarLoading ? (
//               <p className="text-gray-600">Loading similar properties...</p>
//             ) : similarProperties.length === 0 ? (
//               <p className="text-gray-600">No similar properties found.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {similarProperties.map((prop) => (
//                   <PropertyCard
//                     key={prop._id}
//                     id={prop._id}
//                     title={prop.name}
//                     price={`$${prop.price.toLocaleString()}`}
//                     location={prop.address}
//                     image={prop.images?.[0] || 'https://via.placeholder.com/400'}
//                     beds={prop.bedrooms}
//                     baths={prop.bathrooms}
//                     area={prop.sqft ? `${prop.sqft} sq ft` : undefined}
//                     type={prop.propertyType}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div>
//           <AgentContact
//             agent={{
//               name: property.agentId?.name || 'Unknown Agent',
//               photo: property.agentId?.profilePic || 'https://via.placeholder.com/150',
//               phone: property.agentId?.phone || 'N/A',
//               email: property.agentId?.email || 'N/A',
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetail;

// pages/PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Map from '../components/Map';
import AgentContact from '../components/AgentContact';
import PropertyCard from '../components/PropertyCard';
import {
  BedIcon,
  BathIcon,
  SquareIcon,
  MapPinIcon,
  CalendarIcon,
  HouseIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useGetPropertyQuery, useGetSimilarPropertiesQuery } from '../redux/services/propertyApi';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../redux/services/userApi';

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch property details
  const { data: property, isLoading, isError, error } = useGetPropertyQuery(id);

  // Fetch wishlist to check if property is saved
  const { data: wishlist = [] } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  // Check if property is in wishlist
  const isWishlisted = wishlist.some((prop) => prop._id === id);

  // Fetch similar properties
  const { data: similarData, isLoading: similarLoading } = useGetSimilarPropertiesQuery(
    { propertyType: property?.propertyType, excludeId: id },
    { skip: !property?.propertyType }
  );

  const similarProperties = Array.isArray(similarData?.properties) ? similarData.properties : [];

  // Debug: Log API responses and props passed to AgentContact
  useEffect(() => {
    console.log('Property Response:', { property, isLoading, isError, error });
    console.log('Wishlist:', wishlist);
    console.log('Similar Properties Response:', { similarData, similarLoading });
    console.log('Agent Prop for AgentContact:', property?.agentId);
    console.log('PropertyId Prop for AgentContact:', property?._id);
  }, [property, isLoading, isError, error, wishlist, similarData, similarLoading]);

  const handleWishlistToggle = async () => {
    if (isAdding || isRemoving) return;
    try {
      if (isWishlisted) {
        await removeFromWishlist(id).unwrap();
      } else {
        await addToWishlist(id).unwrap();
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (property?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1
    );
  };

  if (isLoading) {
    return <p className="text-center text-gray-600 py-8">Loading property details...</p>;
  }

  if (isError || !property) {
    return (
      <p className="text-center text-red-500 py-8">
        {error?.data?.message || 'Failed to load property details.'}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-100 text-gray-900">
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center text-gray-600">
            <MapPinIcon size={16} className="mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={handleWishlistToggle}
            disabled={isAdding || isRemoving}
            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 ${
              isWishlisted ? 'text-red-500' : ''
            }`}
          >
            <HeartIcon size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            <span>{isWishlisted ? 'Saved' : 'Save'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            <ShareIcon size={18} />
            Ascendancy
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mb-8 h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={property.images?.[currentImageIndex] || 'https://via.placeholder.com/400'}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
        >
          <ChevronRightIcon size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {property.images?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
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
              <h2 className="text-3xl font-bold text-gray-900">
                ${property.price.toLocaleString()}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                {property.bedrooms !== undefined && (
                  <div className="flex items-center">
                    <BedIcon size={20} className="mr-2 text-gray-600" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="flex items-center">
                    <BathIcon size={20} className="mr-2 text-gray-600" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center">
                    <SquareIcon size={20} className="mr-2 text-gray-600" />
                    <span>{property.sqft} sq ft</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Property Type</p>
                <p className="font-medium capitalize">{property.propertyType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium capitalize">{property.status}</p>
              </div>
              {property.floorNumber && (
                <div>
                  <p className="text-gray-500 text-sm">Floor</p>
                  <p className="font-medium">{property.floorNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-700">{property.description || 'No description available.'}</p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(property.features || []).map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-2"></div>
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
                latitude={property.coordinates ? JSON.parse(property.coordinates).lat : 0}
                longitude={property.coordinates ? JSON.parse(property.coordinates).lng : 0}
                address={property.address}
              />
            </div>
          </div>

          {/* Similar Properties */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
            {similarLoading ? (
              <p className="text-gray-600">Loading similar properties...</p>
            ) : similarProperties.length === 0 ? (
              <p className="text-gray-600">No similar properties found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {similarProperties.map((prop) => (
                  <PropertyCard
                    key={prop._id}
                    id={prop._id}
                    title={prop.name}
                    price={`$${prop.price.toLocaleString()}`}
                    location={prop.address}
                    image={prop.images?.[0] || 'https://via.placeholder.com/400'}
                    beds={prop.bedrooms}
                    baths={prop.bathrooms}
                    area={prop.sqft ? `${prop.sqft} sq ft` : undefined}
                    type={prop.propertyType}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <AgentContact
            agent={property.agentId} // Pass the full agentId object
            propertyId={property._id} // Pass the property ID
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;