import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetAllPropertiesQuery } from "@/redux/services/AdminApi";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function AdminPropertyDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetAllPropertiesQuery();

  const currentProp = data?.data?.find((x) => x._id === id);

  useEffect(() => {
    console.log("Current Property:", currentProp);
  }, [currentProp]);

  if (isLoading) return <LoadingSpinner />;
  if (!currentProp)
    return (
      <div className="text-center mt-10 text-red-600">Property not found.</div>
    );

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Property Overview</h1>

      {/* Property Image */}
      <div className="mb-8">
        <img
          src={currentProp.images?.[0]}
          alt="Property"
          className="w-full h-1/2  object-cover rounded-l shadow-lg border"
        />
      </div>

      {/* Glass Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Info */}
        <div className="backdrop-blur-md bg-white/80 shadow-md rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold mb-4">🏠 Property Info</h2>
          <div className="space-y-2 text-gray-800">
            <p>
              <strong>Name:</strong> {currentProp.name}
            </p>
            <p>
              <strong>Price:</strong> ₹ {currentProp.price.toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong> {currentProp.type}
            </p>
            <p>
              <strong>Status:</strong> {currentProp.status}
            </p>
            <p>
              <strong>Property Type:</strong> {currentProp.propertyType}
            </p>
            <p>
              <strong>SQFT:</strong> {currentProp.sqft} sqft
            </p>
            <p>
              <strong>Views:</strong> {currentProp.views}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(currentProp.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(currentProp.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Location Info */}
        <div className="backdrop-blur-md bg-white/80 shadow-md rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold mb-4">📍 Location</h2>
          <div className="space-y-2 text-gray-800">
            <p>
              <strong>Full Address:</strong> {currentProp.address}
            </p>
            <p>
              <strong>Village:</strong> {currentProp.location.village}
            </p>
            <p>
              <strong>County:</strong> {currentProp.location.county}
            </p>
            <p>
              <strong>District:</strong> {currentProp.location.state_district}
            </p>
            <p>
              <strong>State:</strong> {currentProp.location.state}
            </p>
          </div>
        </div>

        {/* Agent Info */}
        <div className="md:col-span-2 backdrop-blur-md bg-white/80 shadow-md rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold mb-4">👨‍💼 Agent Information</h2>
          <div className="flex items-center gap-5">
            <img
              src={currentProp.agentId.profilePic}
              alt="Agent"
              className="w-20 h-20 rounded-full border shadow-md object-cover"
            />
            <div className="text-gray-800 space-y-1">
              <p className="text-lg font-bold">{currentProp.agentId.name}</p>
              <p className="text-sm font-semibold">
                {currentProp.agentId.email}
              </p>
              <p className="text-sm text-gray-700">
                {currentProp.agentId.about}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPropertyDetails;
