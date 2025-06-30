
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { format } from "timeago.js";

import {
  useGetAgentBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/redux/services/BookingApi";
import { useSendMailMutation } from "@/redux/services/AgentApi";

const AgentEnquiries = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const agentId = user?._id;

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAgentBookingsQuery(agentId, {
    skip: !agentId,
  });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [sendMail] = useSendMailMutation();

  const handleUpdateStatus = async (enquiryId, status) => {
    try {
      let res = await sendMail({ enquiryId, status });
      toast.success(`Booking ${status} successfully`, {
        position: "top-right",
        duration: 3000,
      });
      refetch();
      closeModal();
    } catch (err) {
      const errorMessage =
        err.status === 404
          ? "Booking endpoint not found. Please check the server configuration."
          : err.data?.message ||
            err.message ||
            "Failed to update booking status";
      toast.error(errorMessage, {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const getFilteredEnquiries = () => {
    if (isLoading) return [];
    if (isError) return [];

    switch (activeTab) {
      case "accepted":
        return bookings.filter((booking) => booking.status === "confirmed");
      case "rejected":
        return bookings.filter((booking) => booking.status === "cancelled");
      default:
        return bookings.filter((booking) => booking.status === "pending");
    }
  };

  const filteredEnquiries = getFilteredEnquiries();

  const formatEnquiryData = (booking) => ({
    id: booking._id,
    user: booking.userId?.name || "Unknown User",
    property: booking.propertyId?.name || "Unknown Property",
    propertyId: booking.propertyId?._id,
    dateTime: booking.date
      ? `${booking.time}\n${new Date(booking.date).toLocaleDateString()}`
      : "N/A",
    status: booking.status || "pending",
    createdAt: booking.createdAt,
    userDetails: {
      name: booking.userId?.name || "N/A",
      email: booking.userId?.email || "N/A",
      phone: booking.userId?.phone || "N/A",
    },
    propertyDetails: {
      name: booking.propertyId?.name || "N/A",
      address: booking.propertyId?.address || "N/A",
      price: booking.propertyId?.price || "N/A",
      type: booking.propertyId?.type || "N/A",
      status: booking.propertyId?.status || "available",
    },
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Toaster richColors position="top-right" />

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap justify-center bg-gray-100 rounded-full p-1">
          {["all", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`m-1 font-manrope px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
        {tab === "all"
          ? "All Enquiries"
          : tab === "accepted"
          ? "Confirmed"
          : "Cancelled"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Property</th>
              <th className="px-4 py-2 text-left">Date/Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
              <th className="px-4 py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEnquiries.map((booking) => {
              const enquiry = formatEnquiryData(booking);
              return (
                <tr key={enquiry.id} className="hover:bg-gray-50">

                  <td className="px-4 py-3 max-w-[120px] truncate">
                    {enquiry.id}
                  </td>
                  <td className="px-4 py-3">{enquiry.user}</td>
                  <td className="px-4 py-3">{enquiry.property}</td>
                  <td className="px-4 py-3 whitespace-pre-line">
                    {enquiry.dateTime}
                  </td>

                  <td className="px-4 py-3 max-w-[120px] truncate">{enquiry.id}</td>
                  <td className="px-4 py-3">{enquiry.user}</td>
                  <td className="px-4 py-3">{enquiry.property}</td>
                  <td className="px-4 py-3 whitespace-pre-line">{enquiry.dateTime}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        enquiry.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : enquiry.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">

                      {activeTab === "all" && (
                        <>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Confirmed"
                            onClick={() =>
                              handleUpdateStatus(enquiry.id, "confirmed")
                            }
                          >
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Cancel"
                            onClick={() =>
                              handleUpdateStatus(enquiry.id, "cancelled")
                            }
                          >
                            <svg
                              className="w-5 h-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      {activeTab === "accepted" && (
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Cancel"
                          onClick={() =>
                            handleUpdateStatus(enquiry.id, "cancelled")
                          }
                        >
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}

                      {activeTab === "rejected" && (
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Confirmed"
                          onClick={() =>
                            handleUpdateStatus(enquiry.id, "confirmed")
                          }
                        >
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}

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
                        onClick={() => handleUpdateStatus(enquiry.id, "confirmed")}
                      >
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleUpdateStatus(enquiry.id, "cancelled")}
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500 whitespace-nowrap">
                    {format(enquiry.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredEnquiries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">

              {isLoading
                ? "Loading enquiries..."
                : "No enquiries found for this category."}

              {isLoading ? "Loading enquiries..." : "No enquiries found for this category."}

            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentEnquiries;
