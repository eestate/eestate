import React, { useState } from "react";
import { Filter, Search } from "lucide-react";
import { useSearchAndFilterPropertiesQuery } from "@/redux/services/AdminApi";
import { useNavigate } from "react-router-dom";

const AdminProperty = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useSearchAndFilterPropertiesQuery({
    search: searchQuery,
    status: selectedStatus,
  });

  const properties = data?.data || [];
  const statusOptions = ["All", "Available", "Sold"];

  const handleStatusFilterSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePropDetails = (id) => {
    console.log("Clicked Property ID:", id);
    navigate(`${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Property Moderation</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, location, or agent..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onClick={() => handleStatusFilterSelect(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Agent</th>
                <th className="text-left p-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    Loading properties...
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr
                    key={property._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePropDetails(property._id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.images?.[0]}
                          alt={property.name}
                          className="w-14 h-14 rounded object-cover border"
                        />
                        <div>
                          <p className="font-medium">{property.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {[
                        property.location?.village,
                        property.location?.county,
                        property.location?.state_district,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                    <td className="p-4 text-gray-600">
                      {property.agentId?.name || "Unknown"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(property.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminProperty;
