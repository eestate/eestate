import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  useAgentDetailsQuery,
  useBlockAndUnblockMutation,
} from "@/redux/services/AdminApi";

const AgentDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data, isLoading, refetch } = useAgentDetailsQuery(id);
  const [blockAndUnblock] = useBlockAndUnblockMutation();

  const agentData = data?.agent;
  const properties = data?.properties || [];

  useEffect(() => {
    console.log("Agent data:", data);
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBlockUnblock = async () => {
    try {
      const action = agentData?.isBlocked ? "Unblock" : "Block";
      await blockAndUnblock({ id: agentData._id, action }).unwrap();
      console.log(`${action} successful`);
      refetch();
    } catch (error) {
      console.error("Error in block/unblock:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Agent Info styled like UserDetails */}
      <div className="bg-black text-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300">
            {agentData?.profilePic ? (
              <img
                src={agentData.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xl">
                ?
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {agentData?.name || "Unknown Agent"}
            </h2>
            <p className="text-sm text-gray-300">
              {agentData?.email || "No email"}
            </p>
            <p className="text-sm text-gray-400 capitalize mt-1">
              Role: {agentData?.role || "N/A"}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded ${
                  agentData?.isBlocked
                    ? "bg-red-500 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {agentData?.isBlocked ? "Blocked" : "Active"}
              </span>
            </p>
            <p className="text-sm mt-1 text-gray-400">
              Joined: {formatDate(agentData?.createdAt)}
            </p>
            <p className="text-sm mt-1 text-gray-400">
              Subscription: {agentData?.isSubscribed ? "Active" : "None"}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleBlockUnblock}
                className={`px-4 py-2 rounded font-medium ${
                  agentData?.isBlocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                {agentData?.isBlocked ? "Unblock Agent" : "Block Agent"}
              </button>

              <button
                onClick={() => {
                  console.log("Delete agent");
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Listed Properties ({properties.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform duration-300 hover:scale-105"
                onClick={() => navigate(`${property._id}`)}
              >
                <img
                  src={
                    property.images?.[0] || "https://via.placeholder.com/300"
                  }
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 bg-gray-100 border-t border-black">
                  <h4 className="text-lg font-semibold text-black truncate">
                    {property.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {property.address}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {property.bedrooms} Bed • {property.bathrooms} Bath •{" "}
                    {property.sqft} sqft
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-200  text-black px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Views: {property.views} | Updated:{" "}
                    {formatDate(property.updatedAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No properties listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
