import React, { useEffect, useState } from "react";
import { Bell, Filter, Search, CheckCircle } from "lucide-react";
import { useGetAllBookingsQuery } from "@/redux/services/AdminApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const AdminBooking = () => {
  const navigate=useNavigate()
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetAllBookingsQuery();
  const bookings = data?.data || [];

  const statusOptions = ["All Status", "confirmed", "pending", "cancelled"];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings
    .filter(
      (booking) =>
        selectedStatus === "All Status" || booking.status === selectedStatus
    )
    .filter((booking) => {
      const search = searchQuery.toLowerCase();
      return (
        booking.propertyId?.name?.toLowerCase().includes(search) ||
        booking.propertyId?.location?.village?.toLowerCase().includes(search) ||
        booking.userId?.name?.toLowerCase().includes(search) ||
        booking.agentId?.name?.toLowerCase().includes(search)
      );
    });

  const handleRowClick = (bookingId) => {
    navigate(`${bookingId}`)
    console.log("Selected Booking ID:", bookingId);
  };
  function formatCustomDateTime(dateStr, timeStr) {
    const date = new Date(dateStr);

    const [hours, minutes] = timeStr.split(":").map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);

    // Format Date: dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Format Time: 12-hour with AM/PM
    let hour = date.getHours();
    const min = String(date.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${min} ${ampm}`;

    return { date: formattedDate, time: formattedTime };
  }

  const placeholderTexts = [
    "Search by property...",
    "Search by location...",
    "Search by guest...",
    "Search by agent...",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2000); // change text every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Booking Monitoring</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* <input
              type="text"
              placeholder="Search by property, location, guest, or agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

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
              <span>{selectedStatus}</span>
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {statusOptions.map((status, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
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
              {filteredBookings.map((booking, index) => (
                <tr
                  key={index}
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
                          {booking.propertyId?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.propertyId?.location?.village || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{booking.userId?.name}</td>
                  <td className="p-4 text-gray-600">{booking.agentId?.name}</td>
                  <td className="p-4">
                    {(() => {
                      const { date, time } = formatCustomDateTime(
                        booking.date,
                        booking.time
                      );
                      return (
                        <>
                          <p className="text-gray-600">{date}</p>
                          <p className="text-sm text-gray-500">{time}</p>
                        </>
                      );
                    })()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
