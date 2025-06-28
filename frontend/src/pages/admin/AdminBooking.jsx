import React, { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useSearchAndFilterBookingsQuery } from "@/redux/services/AdminApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const AdminBooking = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 Fetch bookings based on filters
  const { data, isLoading, error } = useSearchAndFilterBookingsQuery({
    search: searchQuery,
    status: selectedStatus.toLowerCase(),
  });

  const bookings = data?.data || [];
  const statusOptions = ["all", "pending", "confirmed", "cancelled"];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRowClick = (bookingId) => {
    navigate(`${bookingId}`);
  };

  const formatCustomDateTime = (dateStr, timeStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      const [hours, minutes] = (timeStr || "00:00").split(":").map(Number);
      date.setHours(hours);
      date.setMinutes(minutes);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      let hour = date.getHours();
      const min = String(date.getMinutes()).padStart(2, "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      const formattedTime = `${hour}:${min} ${ampm}`;

      return { date: formattedDate, time: formattedTime };
    } catch {
      return { date: "-", time: "-" };
    }
  };

  const placeholderTexts = [
    "Search by guest, agent, location or property name...",
    "Try typing user name or agent name...",
    "Search by location or email...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-600">Error loading bookings.</div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Booking Monitoring</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder={placeholderTexts[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter size={16} />
              <span>
                {selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1)}
              </span>
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Guest</th>
                <th className="text-left p-4">Agent</th>
                <th className="text-left p-4">Date & Time</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-600">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const { date, time } = formatCustomDateTime(
                    booking.date,
                    booking.time
                  );
                  return (
                    <tr
                      key={booking._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(booking._id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              booking.propertyId?.images?.[0] ||
                              "https://via.placeholder.com/50"
                            }
                            alt="Property"
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">
                              {booking.propertyId?.name || "Unknown Property"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.propertyId?.location?.village || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {booking.userId?.name ||
                          booking.name ||
                          "Unknown Guest"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {booking.agentId?.name || "Unknown Agent"}
                      </td>
                      <td className="p-4">
                        <p className="text-gray-600">{date}</p>
                        <p className="text-sm text-gray-500">{time}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
