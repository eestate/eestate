import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useBlockAndUnblockMutation, useGetUserDetailsQuery } from "@/redux/services/AdminApi";

const UserDetails = () => {
  const { id } = useParams();
  const { data, isLoading ,refetch } = useGetUserDetailsQuery(id);

  const [blockAndUnblock] = useBlockAndUnblockMutation();


  const user = data?.data;

  useEffect(() => {
    console.log("User Details:", user);
  }, [user]);

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
      const action = user?.isBlocked ? "Unblock" : "Block";
      await blockAndUnblock({ id: user._id, action }).unwrap();
      console.log(`${action} successful`);
      refetch(); 
    } catch (error) {
      console.error("Error in block/unblock:", error);
    }
  };
  

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* User Info */}
        <div className="bg-black text-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
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
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-300">{user?.email}</p>
              <p className="text-sm text-gray-400 capitalize mt-1">
                Role: {user?.role}
              </p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    user?.isBlocked
                      ? "bg-red-500 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {user?.isBlocked ? "Blocked" : "Active"}
                </span>
              </p>
              <p className="text-sm mt-1">
                Joined: {formatDate(user?.createdAt)}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={()=> handleBlockUnblock()}
                  className={`px-4 py-2 rounded font-medium ${
                    user?.isBlocked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {user?.isBlocked ? "Unblock User" : "Block User"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Wishlist Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user?.wishlist?.length > 0 ? (
              user.wishlist.map((property, index) => (
                <div
                  key={index}
                  className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300"
                >
                  <img
                    src={property.images?.[0]}
                    alt="Property"
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 bg-gray-100">
                    <h4 className="text-lg font-semibold text-black">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      ₹{property.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{property.address}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {property.bedrooms} Bed • {property.bathrooms} Bath •{" "}
                      {property.sqft} sqft
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No properties in wishlist.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
