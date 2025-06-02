/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { X, Upload, User } from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useLoginMutation, useRegisterMutation, useUpdateProfileMutation } from "@/redux/services/authApi"
import { useAuth } from "../hooks/useAuth"
import { toast } from "sonner"


export default function AuthModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState("login")
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    gender: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState({}) 

    const { isAuthenticated, refetchAuth } = useAuth()


  useEffect(() => {
    if (isAuthenticated && isOpen) {
      resetModal();
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Initialize the mutation hooks
  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const [register, { isLoading: isRegistering }] = useRegisterMutation()

  const handleGoogleAuth = async () => {
    try {
      // This would be replaced with actual Google OAuth flow
      const googleResponse = await fetch('http://localhost:3003/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: 'google-auth-token' }) // You'll get this from Google OAuth
      })

      const data = await googleResponse.json()
      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success("Google login successful!")
        onClose()
      }
    } catch (error) {
      console.error('Google login failed:', error)
      setErrors({ google: 'Google login failed. Please try again.' })
      toast.error("Google login failed. Please try again.")
    }
  }

// AuthModal.js
const handleLogin = async (e) => {
  e.preventDefault()
  setErrors({})

  try {
    const response = await login({
      email: e.target.elements['login-email'].value,
      password: e.target.elements['login-password'].value
    }).unwrap()

    // Store user data
    localStorage.setItem('user', JSON.stringify(response.user))
    toast.success("Login successful!")
    // Force auth state refresh
    await refetchAuth()
    onClose()
    // The useEffect will handle closing the modal
  } catch (error) {
    console.error('Login failed:', error)
    setErrors({ login: error.data?.message || 'Login failed. Please try again.' })
    toast.error("Login failed. Please try again.")
  }
}

const handleSignup = async (e) => {
  e.preventDefault()
  setErrors({})

  try {
    const response = await register({
      name: signupData.username,
      email: signupData.email,
      password: signupData.password,
      role: 'user'
    }).unwrap()

    // Store user data
    localStorage.setItem('user', JSON.stringify(response.user))
    toast.success("Account created successfully!")
    // Move to profile completion
    setCurrentStep("profile-completion")
  } catch (error) {
    console.error('Registration failed:', error)
    setErrors({ register: error.data?.message || 'Registration failed. Please try again.' })
    toast.error("Registration failed. Please try again.")
  }
}

  // In your AuthModal component
  const [updateProfile] = useUpdateProfileMutation();

  const handleProfileCompletion = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile({
        gender: profileData.gender,
        phone: profileData.phoneNumber,
        profilePic: profileData.profilePicture
      }).unwrap();

      // Update stored user data
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, ...response }));
      toast.success("Profile updated successfully!")
      onClose();
    } catch (error) {
      console.error('Profile completion failed:', error);
      setErrors({ profile: error.data?.message || 'Profile update failed. Please try again.' });
      toast.error("Failed to update profile. Please try again.")
    }
  };

  const handleSkipProfile = () => {
    // Skip profile completion and close modal
    console.log("Profile skipped:", signupData)
    onClose()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: e.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const resetModal = () => {
    setCurrentStep("login")
    setSignupData({ username: "", email: "", password: "" })
    setProfileData({ profilePicture: null, gender: "", phoneNumber: "" })
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:3003/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setErrors({ google: 'Google login failed. Please try again.' });
    }
  };

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px] ">
          {/* Left side - Forms */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">
                {currentStep === "login" && "Login"}
                {currentStep === "signup" && "Sign Up"}
                {currentStep === "profile-completion" && "Complete Your Profile"}
              </h2>
            </div>

            {/* Login Form */}
            {currentStep === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="Enter your email" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="mt-2"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">

                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <p className="text-center text-sm text-gray-500">
                  {"Don't have an account? "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentStep("signup")}>
                    Sign up
                  </Button>
                </p>
              </form>
            )}

            {/* Signup Form */}
            {currentStep === "signup" && (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    className="mt-2"
                    value={signupData.username}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2"
                    value={signupData.email}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="mt-2"
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentStep("login")}>
                    Login
                  </Button>
                </p>
              </form>
            )}

            {/* Profile Completion Form */}
            {currentStep === "profile-completion" && (
              <form onSubmit={handleProfileCompletion} className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">Help us personalize your experience (optional)</p>
                </div>

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.profilePicture || undefined} />
                      <AvatarFallback>
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Gender Selection */}
                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    value={profileData.gender}
                    onValueChange={(value) => setProfileData((prev) => ({ ...prev, gender: value }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="mt-2"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleSkipProfile}>
                    Skip for now
                  </Button>
                  <Button type="submit" className="flex-1">
                    Complete Profile
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right side - Logo and Description */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center items-center text-center p-6 lg:p-10">
            <div className="mb-6">
              <h2 className="text-4xl lg:text-6xl font-light text-gray-800 mb-4">eestate</h2>
              <div className="w-20 h-20 lg:w-32 lg:h-32 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl lg:text-4xl">🏠</span>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
              {currentStep === "login" && "Welcome Back"}
              {currentStep === "signup" && "Join Us"}
              {currentStep === "profile-completion" && "Almost There!"}
            </h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-sm">
              {currentStep === "login" && "Sign in to access your real estate dashboard and manage your properties."}
              {currentStep === "signup" &&
                "Buy, sell, or list properties. Join us to explore top real estate opportunities with trusted guidance and support."}
              {currentStep === "profile-completion" &&
                "Complete your profile to get personalized property recommendations and connect with the right agents."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
