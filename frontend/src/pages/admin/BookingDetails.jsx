import React from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetAllBookingsQuery } from "@/redux/services/AdminApi";

function BookingDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetAllBookingsQuery();

  if (isLoading) return <LoadingSpinner />;

  const booking = data?.data?.find((x) => x._id === id);
  if (!booking)
    return <div className="p-6 text-gray-700">Booking not found</div>;

  const formatCustomDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);
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
  };

  const { date, time } = formatCustomDateTime(booking.date, booking.time);

  return (
    <>
      <div className="bg-black text-white px-6 py-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">Booking Details</h1>
        <p className="text-sm opacity-80">Booking ID: {booking._id}</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Property Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2 border-b pb-1">
            🏠 Property Information
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <img
              src={booking.propertyId?.images?.[0]}
              alt="Property"
              className="w-full sm:w-60 h-40 object-cover rounded"
            />
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {booking.propertyId?.name}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {booking.propertyId?.location?.fullAddress}
              </p>
              <p>
                <strong>Type:</strong> {booking.propertyId?.propertyType}
              </p>
              <p>
                <strong>Status:</strong> {booking.propertyId?.status}
              </p>
              <p>
                <strong>Price:</strong> ₹
                {booking.propertyId?.price.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Agent Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2 border-b pb-1">
            🧑‍💼 Agent Information
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={booking.agentId?.profilePic}
              alt="Agent"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p>
                <strong>Name:</strong> {booking.agentId?.name}
              </p>
              <p>
                <strong>Email:</strong> {booking.agentId?.email}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {booking.agentId?.about || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* User Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2 border-b pb-1">
            👤 User (Guest) Information
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={booking.userId?.profilePic}
              alt="User"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p>
                <strong>Name:</strong> {booking.userId?.name}
              </p>
              <p>
                <strong>Email:</strong> {booking.userId?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Enquiry Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2 border-b pb-1">
            📅 Enquiry Details
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>
            <p>
              <strong>Message:</strong> {booking.message}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-sm font-medium 
                  ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {booking.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Time:</strong> {time}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default BookingDetails;
