
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
    setPage(1); 
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">OUR PROFESSIONAL AGENTS</h1>
          <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our elite team of real estate specialists dedicated to your property success
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-16">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search agents by name..."
              className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading agents</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {error?.data?.message || 'We encountered an issue while loading agent data. Please try again later.'}
            </p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {search ? 'Try adjusting your search query.' : 'There are currently no agents available.'}
            </p>
          </div>
        ) : (
          <>
            {/* Agent Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {agents.map((agent) => (
                <div key={agent._id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={agent.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                      alt={agent.name} 
                      className="w-full h-full object-cover transition-opacity hover:opacity-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h2>
                    <p className="text-gray-600 uppercase text-sm font-medium tracking-wide mb-2">{agent.specialization}</p>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{agent.experience}</p>
                    <Link
                      to={`/listingagents/${agent._id}`}
                      className="inline-flex items-center px-6 py-2 border border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      View Profile
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * limit, totalAgents)}</span> of{' '}
                <span className="font-medium">{totalAgents}</span> agents
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon size={20} className="text-gray-700" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                        pageNum === currentPage 
                          ? 'bg-gray-900 text-white' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
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
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRightIcon size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentListingPage;