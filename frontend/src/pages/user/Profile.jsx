import React, { useState, useEffect } from 'react';
import { User, Edit, Camera, Heart, Trash, LogIn, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from '../../redux/services/userApi';
import PropertyCard from '@/components/PropertyCard';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-900">
          <LogIn className="w-12 h-12 text-gray-900 mx-auto mb-4" />
          <p className="text-lg mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Fetch profile and wishlist
  const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
  const { data: wishlist, isLoading: wishlistLoading, error: wishlistError } = useGetWishlistQuery();
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [removeFromWishlist, { isLoading: removingFromWishlist }] = useRemoveFromWishlistMutation();

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState('');
  const [error, setError] = useState(null);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPreviewPic(profile.profilePic || '');
    }
  }, [profile]);

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      await updateProfile(formData).unwrap();
      setIsEditing(false);
      setProfilePic(null);
    } catch (err) {
      setError(err.data?.error || 'Failed to update profile.');
    }
  };

  // Handle wishlist removal
  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      await removeFromWishlist(propertyId).unwrap();
    } catch (err) {
      setError(err.data?.error || 'Failed to remove property from wishlist.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans  ">
      {/* Hero Section */}
      {/* <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Your Profile</h1>
          <p className="text-lg mt-2">Manage your details and view your wishlist</p>
        </div>
      </section> */}

      {/* Profile Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {profileLoading ? (
            <p className="text-center text-gray-600">Loading profile...</p>
          ) : profileError ? (
            <p className="text-center text-red-500">
              {profileError.data?.error || 'Failed to load profile.'}
            </p>
          ) : (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-5 h-5 mr-1" />
                    Edit
                  </button>
                )}
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {isEditing ? (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Profile Picture</label>
                    <div className="flex items-center">
                      {previewPic ? (
                        <img
                          src={previewPic}
                          alt="Profile Preview"
                          className="w-20 h-20 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                          <User className="w-10 h-10 text-gray-600" />
                        </div>
                      )}
                      <label className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                        <Camera className="w-5 h-5 mr-1" />
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-500"
                    >
                      {updatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(profile.name);
                        setProfilePic(null);
                        setPreviewPic(profile.profilePic || '');
                      }}
                      className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <User className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600">{profile.role}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Email:</span> {profile.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Role:</span> {profile.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Wishlist</h2>
          {wishlistLoading ? (
            <p className="text-center text-gray-600">Loading wishlist...</p>
          ) : wishlistError ? (
            <p className="text-center text-red-500">
              {wishlistError.data?.error || 'Failed to load wishlist.'}
            </p>
          ) : wishlist?.length === 0 ? (
            <p className="text-center text-gray-600">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((property) => (
                <div key={property._id} className="relative">
                  <PropertyCard
                    id={property._id}
                    title={property.name || property.title}
                    price={property.price}
                    location={property.address || property.location}
                    image={property.images?.[0]}
                    beds={property.bedrooms}
                    baths={property.bathrooms}
                    area={property.area}
                    type={property.type}
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(property._id)}
                    disabled={removingFromWishlist}
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 text-red-600 hover:text-red-800"
                    title="Remove from wishlist"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* Bookings */}
      <section className="py-16 bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Bookings</h2>

        </div>
      </section>



    </div>
  );
};

export default Profile;