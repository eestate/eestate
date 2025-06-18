
import { useGetAgentBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/services/BookingApi";
import React, { useState } from "react";
import { Toaster, toast } from "sonner";

const AgentEnquiries = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const agentId = user?._id;

  const { data: bookings = [], isLoading, isError, error, refetch } = useGetAgentBookingsQuery(agentId, {
    skip: !agentId,
  });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const handleUpdateStatus = async (enquiryId, status) => {
    try {
      console.log('Updating booking:', { enquiryId, status });
      await updateBookingStatus({ id: enquiryId, status }).unwrap();
      toast.success(`Booking ${status} successfully`, {
        position: 'top-right',
        duration: 3000,
      });
      refetch();
      closeModal();
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.status === 404
        ? 'Booking endpoint not found. Please check the server configuration.'
        : err.data?.message || err.message || 'Failed to update booking status';
      toast.error(errorMessage, {
        position: 'top-right',
        duration: 3000,
      });
    }
  };

  const getFilteredEnquiries = () => {
    if (isLoading) return [];
    if (isError) return [];

    switch (activeTab) {
      case 'accepted':
        return bookings.filter(booking => booking.status === 'confirmed');
      case 'rejected':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredEnquiries = getFilteredEnquiries();

  const formatEnquiryData = (booking) => ({
    id: booking._id,
    user: booking.userId?.name || 'Unknown User',
    property: booking.propertyId?.name || 'Unknown Property',
    propertyId: booking.propertyId?._id,
    dateTime: booking.date 
      ? `${booking.time}\n${new Date(booking.date).toLocaleDateString()}`
      : 'N/A',
    status: booking.status || 'pending',
    userDetails: {
      name: booking.userId?.name || 'N/A',
      email: booking.userId?.email || 'N/A',
      phone: booking.userId?.phone || 'N/A',
    },
    propertyDetails: {
      name: booking.propertyId?.name || 'N/A',
      address: booking.propertyId?.address || 'N/A',
      price: booking.propertyId?.price || 'N/A',
      type: booking.propertyId?.type || 'N/A',
      status: booking.propertyId?.status || 'available',
    }
  });

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error loading enquiries: {error?.data?.message || error.message}
        </div>
      </div>
    );
  }

  if (!agentId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          No user found. Please log in to view enquiries.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster richColors position="top-right" />
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'accepted'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Id</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Property</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date/Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEnquiries.map((booking) => {
              const enquiry = formatEnquiryData(booking);
              return (
                <tr key={enquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.property}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">{enquiry.dateTime}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      enquiry.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : enquiry.status === 'cancelled' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleViewDetails(enquiry)}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleUpdateStatus(enquiry.id, 'confirmed')}
                      >
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleUpdateStatus(enquiry.id, 'cancelled')}
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredEnquiries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {isLoading ? 'Loading enquiries...' : 'No enquiries found for this category.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Enquiry Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.userDetails.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.userDetails.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.userDetails.phone}</p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.propertyDetails.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.propertyDetails.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.propertyDetails.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.propertyDetails.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedEnquiry.propertyDetails.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEnquiry.propertyDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date/Time</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dateTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedEnquiry.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedEnquiry.status === 'cancelled' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleUpdateStatus(selectedEnquiry.id, 'confirmed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedEnquiry.id, 'cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentEnquiries;