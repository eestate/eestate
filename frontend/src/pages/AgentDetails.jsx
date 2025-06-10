// // // import React from "react";
// // // import { Phone, Mail, Home, List, Gift, Calendar, User } from "lucide-react";

// // // const AgentDetailsPage = () => {
// // //   const agent = {
// // //     name: "John Thomas",
// // //     title: "Industrial Building Agent",
// // //     image: "https://randomuser.me/api/portraits/men/44.jpg",
// // //     experience: "3+ years",
// // //     languages: ["English", "Spanish"],
// // //     about:
// // //       "With over 3 years of experience in real estate, John specializes in luxury properties and has helped hundreds of clients find their dream homes.",
// // //     stats: {
// // //       total: 80,
// // //       active: 53,
// // //       sold: 27,
// // //     },
// // //     listings: [
// // //       {
// // //         id: 1,
// // //         image: "https://source.unsplash.com/400x300/?apartment",
// // //         type: "Apartment",
// // //       },
// // //       {
// // //         id: 2,
// // //         image: "https://source.unsplash.com/400x300/?interior",
// // //         type: "Apartment",
// // //       },
// // //       {
// // //         id: 3,
// // //         image: "https://source.unsplash.com/400x300/?home",
// // //         type: "Apartment",
// // //       },
// // //     ],
// // //   };

// // //   return (
// // //     <div className="max-w-7xl mx-auto px-6 py-8">
// // //       {/* Header */}
// // //       <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-md gap-6 mb-10">
// // //         <img
// // //           src={agent.image}
// // //           alt={agent.name}
// // //           className="w-32 h-32 rounded-full object-cover"
// // //         />
// // //         <div className="flex-1">
// // //           <h2 className="text-2xl font-semibold">{agent.name}</h2>
// // //           <p className="text-gray-600 mb-3">{agent.title}</p>
// // //           <div className="flex gap-4">
// // //             <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
// // //               <Mail size={16} />
// // //               Message
// // //             </button>
// // //             <button className="border px-4 py-2 rounded flex items-center gap-2">
// // //               <Phone size={16} />
// // //               Call
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* About + Stats */}
// // //       <div className="grid md:grid-cols-2 gap-10 mb-10">
// // //         <div>
// // //           <h3 className="text-xl font-bold mb-3">About</h3>
// // //           <p className="text-gray-700 mb-4">{agent.about}</p>
// // //           <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
// // //             <Calendar size={16} /> Experience: {agent.experience}
// // //           </p>
// // //           <p className="flex items-center gap-2 text-sm text-gray-600">
// // //             <User size={16} /> Languages: {agent.languages.join(", ")}
// // //           </p>
// // //         </div>

// // //         <div>
// // //           <h3 className="text-xl font-bold mb-3">Statistics</h3>
// // //           <div className="grid grid-cols-2 gap-4">
// // //             <div className="bg-white p-4 border rounded-md flex items-center gap-4">
// // //               <Home size={24} className="text-gray-500" />
// // //               <div>
// // //                 <p className="text-xl font-bold">{agent.stats.total}</p>
// // //                 <p className="text-gray-600 text-sm">Total Properties</p>
// // //               </div>
// // //             </div>
// // //             <div className="bg-white p-4 border rounded-md flex items-center gap-4">
// // //               <List size={24} className="text-gray-500" />
// // //               <div>
// // //                 <p className="text-xl font-bold">{agent.stats.active}</p>
// // //                 <p className="text-gray-600 text-sm">Active Properties</p>
// // //               </div>
// // //             </div>
// // //             <div className="col-span-2 bg-white p-4 border rounded-md flex items-center gap-4">
// // //               <Gift size={24} className="text-gray-500" />
// // //               <div>
// // //                 <p className="text-xl font-bold">{agent.stats.sold}</p>
// // //                 <p className="text-gray-600 text-sm">Sold Properties</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Listings */}
// // //       <div>
// // //         <h3 className="text-xl font-bold mb-6">Current Listing</h3>
// // //         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
// // //           {agent.listings.map((listing) => (
// // //             <div
// // //               key={listing.id}
// // //               className="bg-white border rounded-md overflow-hidden shadow-sm"
// // //             >
// // //               <div className="relative">
// // //                 <img
// // //                   src={listing.image}
// // //                   alt="Property"
// // //                   className="w-full h-48 object-cover"
// // //                 />
// // //                 <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
// // //                   {listing.type}
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AgentDetailsPage;


// // import React from "react";
// // import { Phone, Mail, Home, List, Gift, Calendar, User } from "lucide-react";
// // import { useParams } from 'react-router-dom';
// // import { useGetAgentDetailsQuery } from '../redux/services/userApi';

// // const AgentDetailsPage = () => {
// //   const { id } = useParams();
// //   const { data, isLoading, isError, error } = useGetAgentDetailsQuery(id);

// //   const agent = data?.agent || {
// //     name: "Loading...",
// //     specialization: "",
// //     image: "https://randomuser.me/api/portraits/lego/1.jpg",
// //     stats: { total: 0, active: 0, sold: 0 },
// //     listings: [],
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto px-6 py-8">
// //       {isLoading ? (
// //         <p className="text-center text-gray-600">Loading agent details...</p>
// //       ) : isError ? (
// //         <p className="text-center text-red-500">
// //           {error?.data?.message || 'Failed to load agent details.'}
// //         </p>
// //       ) : (
// //         <>
// //           <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-md gap-6 mb-10">
// //             <img
// //               src={agent.image}
// //               alt={agent.name}
// //               className="w-32 h-32 rounded-full object-cover"
// //             />
// //             <div className="flex-1">
// //               <h2 className="text-2xl font-semibold">{agent.name}</h2>
// //               <p className="text-gray-600 mb-3">{agent.specialization}</p>
// //               <div className="flex gap-4">
// //                 <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
// //                   <Mail size={16} />
// //                   Message
// //                 </button>
// //                 <button className="border px-4 py-2 rounded flex items-center gap-2">
// //                   <Phone size={16} />
// //                   Call
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid md:grid-cols-2 gap-10 mb-10">
// //             <div>
// //               <h3 className="text-xl font-bold mb-3">About</h3>
// //               <p className="text-gray-700 mb-4">{agent.about}</p>
             
// //             </div>

// //             <div>
// //               <h3 className="text-xl font-bold mb-3">Statistics</h3>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="bg-white p-4 border rounded-md flex items-center gap-4">
// //                   <Home size={24} className="text-gray-500" />
// //                   <div>
// //                     <p className="text-xl font-bold">{agent.stats.total}</p>
// //                     <p className="text-gray-600 text-sm">Total Properties</p>
// //                   </div>
// //                 </div>
// //                 <div className="bg-white p-4 border rounded-md flex items-center gap-4">
// //                   <List size={24} className="text-gray-500" />
// //                   <div>
// //                     <p className="text-xl font-bold">{agent.stats.active}</p>
// //                     <p className="text-gray-600 text-sm">Active Properties</p>
// //                   </div>
// //                 </div>
// //                 <div className="col-span-2 bg-white p-4 border rounded-md flex items-center gap-4">
// //                   <Gift size={24} className="text-gray-500" />
// //                   <div>
// //                     <p className="text-xl font-bold">{agent.stats.sold}</p>
// //                     <p className="text-gray-600 text-sm">Sold Properties</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             <h3 className="text-xl font-bold mb-6">Current Listing</h3>
// //             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
// //               {agent.listings.map((listing) => (
// //                 <div
// //                   key={listing.id}
// //                   className="bg-white border rounded-md overflow-hidden shadow-sm"
// //                 >
// //                   <div className="relative">
// //                     <img
// //                       src={listing.image}
// //                       alt="Property"
// //                       className="w-full h-48 object-cover"
// //                     />
// //                     <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
// //                       {listing.type}
// //                     </span>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default AgentDetailsPage;


// import React, { useEffect } from "react";
// import { Phone, Mail, Home, List, Gift, Calendar, User } from "lucide-react";
// import { useParams } from 'react-router-dom';
// import { useGetAgentDetailsQuery } from '../redux/services/userApi';
// import PropertyCard from '../components/PropertyCard';

// const AgentDetailsPage = () => {
//   const { id } = useParams();
//   const { data, isLoading, isError, error } = useGetAgentDetailsQuery(id);

//   useEffect(() => {
//     console.log('Agent Details API Response:', { data, isLoading, isError, error });
//   }, [data, isLoading, isError, error]);

//   const agent = data?.agent || {
//     name: "Loading...",
//     specialization: "",
//     image: "https://randomuser.me/api/portraits/lego/1.jpg",
//     experience: "",
//     languages: [],
//     about: "",
//     stats: { total: 0, active: 0, sold: 0 },
//     listings: [],
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       {isLoading ? (
//         <p className="text-center text-gray-600">Loading agent details...</p>
//       ) : isError ? (
//         <p className="text-center text-red-500">
//           {error?.data?.message || 'Failed to load agent details.'}
//         </p>
//       ) : (
//         <>
//           <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-md gap-6 mb-10">
//             <img
//               src={agent.image}
//               alt={agent.name}
//               className="w-32 h-32 rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <h2 className="text-2xl font-semibold">{agent.name}</h2>
//               <div className="flex gap-4 mt-4">
//                 <button className="border px-4 py-2 rounded flex items-center gap-2">
//                   <Phone size={16} />
//                   Call
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-10 mb-10">
//             <div>
//               <h3 className="text-xl font-bold mb-3">About</h3>
//               <p className="text-gray-700 mb-4">{agent.about}</p>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold mb-3">Statistics</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-white p-4 border rounded-md flex items-center gap-4">
//                   <Home size={24} className="text-gray-500" />
//                   <div>
//                     <p className="text-xl font-bold">{agent.stats.total}</p>
//                     <p className="text-gray-600 text-sm">Total Properties</p>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 border rounded-md flex items-center gap-4">
//                   <List size={24} className="text-gray-500" />
//                   <div>
//                     <p className="text-xl font-bold">{agent.stats.active}</p>
//                     <p className="text-gray-600 text-sm">Active Properties</p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 bg-white p-4 border rounded-md flex items-center gap-4">
//                   <Gift size={24} className="text-gray-500" />
//                   <div>
//                     <p className="text-xl font-bold">{agent.stats.sold}</p>
//                     <p className="text-gray-600 text-sm">Sold Properties</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-bold mb-6">Current Listings</h3>
//             {agent.listings.length === 0 ? (
//               <p className="text-center text-gray-600">No properties listed by this agent.</p>
//             ) : (
//               <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {agent.listings.map((listing) => (
//                   <PropertyCard
//                     key={listing.id}
//                     id={listing.id}
//                     title={listing.title}
//                     price={listing.price}
//                     location={listing.location}
//                     image={listing.image}
//                     beds={listing.beds}
//                     baths={listing.baths}
//                     area={listing.area}
//                     type={listing.type}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AgentDetailsPage;

import React, { useEffect } from "react";
import { Phone, Mail, Home, List, Gift, Calendar, User } from "lucide-react";
import { useParams } from 'react-router-dom';
import { useGetAgentDetailsQuery } from '../redux/services/userApi';
import PropertyCard from '../components/PropertyCard';

const AgentDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetAgentDetailsQuery(id);

  useEffect(() => {
    console.log('Agent Details API Response:', { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

  // Default agent data structure
  const defaultAgent = {
    name: "Loading...",
    email: "",
    phone: "",
    specialization: "",
    image: "https://randomuser.me/api/portraits/lego/1.jpg",
    experience: "",
    languages: [],
    about: "",
    stats: { 
      total: 0, 
      active: 0, 
      sold: 0 
    },
    listings: [],
  };

  // Merge API data with default structure
  const agent = data?.agent ? { 
    ...defaultAgent,
    ...data.agent,
    stats: {
      ...defaultAgent.stats,
      ...(data.agent.stats || {})
    }
  } : defaultAgent;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {isLoading ? (
        <p className="text-center text-gray-600">Loading agent details...</p>
      ) : isError ? (
        <p className="text-center text-red-500">
          {error?.data?.message || 'Failed to load agent details.'}
        </p>
      ) : (
        <>
             <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 p-6 rounded-xl shadow-md gap-6 mb-10">
             <img
              src={agent.profilePic}
              alt={agent.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{agent.name}</h2>
              <div className="flex gap-4 mt-4">
                <button className="border px-4 py-2 rounded flex items-center gap-2">
                  <Phone size={16} />
                  Call
                </button>
              </div>
            </div>
          </div>

          {/* About and Stats Section */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-3">About</h3>
              <p className="text-gray-700 mb-4">
                {agent.about || "No information available about this agent."}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 border rounded-md flex items-center gap-4">
                  <Home size={24} className="text-gray-500" />
                  <div>
                    <p className="text-xl font-bold">{agent.stats.total}</p>
                    <p className="text-gray-600 text-sm">Total Properties</p>
                  </div>
                </div>
                <div className="bg-white p-4 border rounded-md flex items-center gap-4">
                  <List size={24} className="text-gray-500" />
                  <div>
                    <p className="text-xl font-bold">{agent.stats.active}</p>
                    <p className="text-gray-600 text-sm">Active Properties</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white p-4 border rounded-md flex items-center gap-4">
                  <Gift size={24} className="text-gray-500" />
                  <div>
                    <p className="text-xl font-bold">{agent.stats.sold}</p>
                    <p className="text-gray-600 text-sm">Sold Properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Current Listings</h3>
            {agent.listings?.length === 0 ? (
              <p className="text-center text-gray-600">No properties listed by this agent.</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {agent.listings?.map((listing) => (
                  <PropertyCard
                    key={listing._id || listing.id}
                    id={listing._id || listing.id}
                    title={listing.name || listing.title}
                    price={`$${listing.price?.toLocaleString()}`}
                    location={listing.address || listing.location}
                    image={listing.images?.[0] || listing.image || 'https://via.placeholder.com/400'}
                    beds={listing.bedrooms || listing.beds}
                    baths={listing.bathrooms || listing.baths}
                    area={listing.sqft ? `${listing.sqft} sq ft` : listing.area}
                    type={listing.propertyType || listing.type}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentDetailsPage;