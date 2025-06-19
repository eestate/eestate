
import { useState, useEffect } from "react"
import { User, Edit, Camera, Heart, Trash, LogIn, Home, Mail, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../redux/services/userApi"
import PropertyCard from "@/components/PropertyCard"
import { Toaster, toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery()
  const { data: wishlist, isLoading: wishlistLoading, error: wishlistError } = useGetWishlistQuery()
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation()
  const [removeFromWishlist, { isLoading: removingFromWishlist }] = useRemoveFromWishlistMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [profilePic, setProfilePic] = useState(null)
  const [previewPic, setPreviewPic] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setPreviewPic(profile.profilePic || "")
    }
  }, [profile])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      setPreviewPic(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      if (profilePic) {
        formData.append("profilePic", profilePic)
      }

      await updateProfile(formData).unwrap()
      setIsEditing(false)
      setProfilePic(null)
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        duration: 3000,
      })
    } catch (err) {
      const errorMessage = err.data?.error || "Failed to update profile."
      setError(errorMessage)
      toast.error(errorMessage, {
        position: 'top-right',
        duration: 3000,
      })
    }
  }

  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      await removeFromWishlist(propertyId).unwrap()
      toast.success('Property removed from wishlist!', {
        position: 'top-right',
        duration: 3000,
      })
    } catch (err) {
      const errorMessage = err.data?.error || "Failed to remove property from wishlist."
      setError(errorMessage)
      toast.error(errorMessage, {
        position: 'top-right',
        duration: 3000,
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile and manage your properties.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Toaster richColors position="top-right" />
      <section className="relative py-20 bg-gradient-to-r from-gray-900 via-black to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 rounded-full translate-x-48 translate-y-48"></div>

        <div className="container mx-auto px-4 relative z-10">
          {profileLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="text-white mt-4 text-lg">Loading your profile...</p>
            </div>
          ) : profileError ? (
            <div className="max-w-md mx-auto bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-2xl p-6 text-center">
              <p className="text-white">{profileError.data?.error || "Failed to load profile."}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  <div className="relative">
                    {profile.profilePic || previewPic ? (
                      <img
                        src={previewPic || profile.profilePic}
                        alt={profile.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                        <User className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <Camera className="w-5 h-5 text-gray-600" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-2xl font-bold bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full lg:w-auto"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="submit"
                            disabled={updatingProfile}
                            className="bg-white text-black px-6 py-2 rounded-xl hover:bg-gray-100 disabled:bg-gray-300 transition-colors font-medium shadow-lg"
                          >
                            {updatingProfile ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false)
                              setName(profile.name)
                              setProfilePic(null)
                              setPreviewPic(profile.profilePic || "")
                            }}
                            className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-colors font-medium border border-white/30"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                          <h1 className="text-3xl lg:text-4xl font-bold text-white">{profile.name}</h1>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors border border-white/30"
                          >
                            <Edit className="w-5 h-5 text-white" />
                          </button>
                        </div>

                        <div className="space-y-3 text-white/90">
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            <Mail className="w-5 h-5" />
                            <span className="text-lg">{profile.email}</span>
                          </div>
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-lg capitalize">{profile.role}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl p-4">
                    <p className="text-white text-center">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Your Favorites
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Wishlist Properties</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Keep track of your favorite properties and never miss out on your dream home.
            </p>
          </div>

          {wishlistLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading your wishlist...</p>
            </div>
          ) : wishlistError ? (
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600">{wishlistError.data?.error || "Failed to load wishlist."}</p>
            </div>
          ) : wishlist?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start exploring properties and add them to your wishlist!</p>
              <button
                onClick={() => navigate("/properties")}
                className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 z-10"
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

      <section className="py-20 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
              <Home className="w-4 h-4" />
              Your Bookings
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Property Bookings</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage your property viewings and booking appointments all in one place.
            </p>
          </div>

          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">When you schedule property viewings, they'll appear here.</p>
            <button
              onClick={() => navigate("/properties")}
              className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Explore Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile