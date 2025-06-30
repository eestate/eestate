import React, { useEffect, useState } from "react";
import { Filter, Search, Eye } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/services/AdminApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔁 Use RTK Query with dynamic params
  const { data, isLoading } = useGetAllUsersQuery(
    {
      search: searchQuery,
      role: selectedRole,
    },
    {
      // Optional: re-fetch when search/role changes (debounced search can also be added)
      skip: false,
    }
  );

  const users = data?.data || [];

  useEffect(() => {
    console.log("Fetched users:", users);
  }, [users]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDetails = (id, role) => {
    if (role === "agent") navigate(`/admin/user-management/agent/${id}`);
    if (role === "user") navigate(`/admin/user-management/user/${id}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Filter by Role */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Filter size={16} />
              <span>{selectedRole}</span>
            </button>
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {["All Roles", "Agent", "User"].map((role) => (
                  <button
                    key={role}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Joined Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-white flex items-center justify-center h-full w-full bg-gray-400 rounded-full">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleDetails(user._id, user.role)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
