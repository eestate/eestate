
// import React, { useState } from 'react';

// const agentsData = [
//   {
//     name: "Sarah John",
//     specialization: "Commercial Land Agent",
//     experience: "12 Year Experience",
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     name: "John Thomas",
//     specialization: "Industrial Building Agent",
//     experience: "3 Year Experience",
//     image: "https://randomuser.me/api/portraits/men/44.jpg",
//   },
//   {
//     name: "Sarah John",
//     specialization: "Commercial Land Agent",
//     experience: "12 Year Experience",
//     image: "https://randomuser.me/api/portraits/women/45.jpg",
//   },
//   {
//     name: "Michael Smith",
//     specialization: "Residential Property Agent",
//     experience: "6 Year Experience",
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//   },
// ];

// const AgentListingPage = () => {
//   const [search, setSearch] = useState("");

//   const filteredAgents = agentsData.filter((agent) =>
//     agent.name.toLowerCase().includes(search.toLowerCase()) ||
//     agent.specialization.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-2">Our Professional Agents</h1>
//       <p className="text-center text-gray-600 mb-6">
//         Find the perfect real estate agent to help you with your property journey
//       </p>

//       <div className="flex justify-center mb-10">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by location or specialization"
//           className="w-full max-w-xl px-4 py-2 border rounded-l-md focus:outline-none focus:ring"
//         />
//         <button className="bg-blue-600 text-white px-6 rounded-r-md">Search</button>
//       </div>

//       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredAgents.map((agent, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
//             <img src={agent.image} alt={agent.name} className="w-full h-48 object-cover" />
//             <div className="p-4">
//               <h2 className="text-lg font-semibold">{agent.name}</h2>
//               <p className="text-sm text-gray-600">{agent.specialization}</p>
//               <p className="text-sm text-gray-500 mb-4">{agent.experience}</p>
//               <div className="flex gap-2">
//                 <button className="bg-black text-white px-21 py-1 rounded">View Profile</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AgentListingPage;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useGetAgentsQuery } from '../redux/services/userApi';

const AgentListingPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, error } = useGetAgentsQuery({ search, page, limit });

  const agents = Array.isArray(data?.agents) ? data.agents : [];
  const totalAgents = data?.total || 0;
  const currentPage = data?.page || 1;
  const totalPages = data?.pages || 1;

  useEffect(() => {
    console.log('API Response:', { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">Our Professional Agents</h1>
      <p className="text-center text-gray-600 mb-6">
        Find the perfect real estate agent to help you with your property journey
      </p>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name or specialization"
          className="w-full max-w-xl px-4 py-2 border rounded-l-md focus:outline-none focus:ring"
        />
        <button className="bg-blue-600 text-white px-6 rounded-r-md">Search</button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading agents...</p>
      ) : isError ? (
        <p className="text-center text-red-500">
          {error?.data?.message || 'Failed to load agents.'}
        </p>
      ) : agents.length === 0 ? (
        <p className="text-center text-gray-600">No agents found.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div key={agent._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={agent.image} alt={agent.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{agent.name}</h2>
                  <p className="text-sm text-gray-600">{agent.specialization}</p>
                  <p className="text-sm text-gray-500 mb-4">{agent.experience}</p>
                  <Link
                    to={`/listingagents/${agent._id}`}
                    className="bg-black text-white px-21 py-1 rounded inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded bg-white hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    pageNum === currentPage ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-300'
                  }`}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded bg-white hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentListingPage;