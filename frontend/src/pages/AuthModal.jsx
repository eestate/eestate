/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "agent"], { required_error: "Please select a role" }),
})

const profileSchema = z.object({
  gender: z.enum(["male", "female", ""], { required_error: "Please select a gender" }).optional(),
  phoneNumber: z.string().optional(),
})

export default function AuthModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState("login")
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    gender: "",
    phoneNumber: "",
  })
  const { isAuthenticated,role } = useAuth()
  const navigate = useNavigate()

  const { refetch } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "", role: "user" },
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { gender: "", phoneNumber: "" },
  })

  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const [register, { isLoading: isRegistering }] = useRegisterMutation()
  const [updateProfile] = useUpdateProfileMutation()

  // In AuthModal component
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isOpen) {
        await refetch();
      }
    };
    checkAuthStatus();
  }, [isOpen, refetch]);

  useEffect(() => {
    if (isAuthenticated && isOpen && currentStep === "login") {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const role = user?.role;
        if (role === "user") navigate("/");
        else if (role === "agent") navigate("/agent");
        else if (role === "admin") navigate("/admin");
        onClose();
      }
    }
  }, [isAuthenticated, isOpen, currentStep, navigate, onClose]);

const handleAuthSuccess = (role) => {
  localStorage.setItem('user', JSON.stringify(user));
  
 
  let redirectPath = '/';
  if (role === 'agent') redirectPath = '/agent';
  if (role === 'admin') redirectPath = '/admin';
  
  navigate(redirectPath);
  onClose();
};

  const handleLogin = async (data) => {
    try {
      const response = await login(data).unwrap()
      localStorage.setItem('user', JSON.stringify(response.user))
      await refetch();

      if (response.user) {
        toast.success("Login successful!");
        const role = response.user?.role;
        handleAuthSuccess(role)
        onClose();
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(error.data?.message || "Login failed. Please try again.")
      loginForm.setError("root", { message: error.data?.message || "Login failed" })
    }
  }

  const handleSignup = async (data) => {
    try {
      const response = await register({
        name: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap()
      localStorage.setItem('user', JSON.stringify(response.user))
      toast.success("Account created successfully!")
      setCurrentStep("profile-completion")
    } catch (error) {
      console.error('Registration failed:', error)
      toast.error(error.data?.message || "Registration failed. Please try again.")
      signupForm.setError("root", { message: error.data?.message || "Registration failed" })
    }
  }

  const handleProfileCompletion = async (data) => {
    try {
      const response = await updateProfile({
        gender: data.gender,
        phone: data.phoneNumber,
        profilePic: profileData.profilePicture,
      }).unwrap()
      const user = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({ ...user, ...response }))
      toast.success("Profile updated successfully!")
      const role = user?.role
      if (role === "user") navigate("/")
      else if (role === "agent") navigate("/agent")
      else if (role === "admin") navigate("/admin")
      onClose()
    } catch (error) {
      console.error('Profile completion failed:', error, {
        status: error.status,
        data: error.data,
        cookies: document.cookie
      })
      toast.error(error.data?.message || "Failed to update profile. Please try again.")
      profileForm.setError("root", { message: error.data?.message || "Profile update failed" })
    }
  }

  const handleSkipProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const role = user?.role
    if (role === "user") navigate("/")
    else if (role === "agent") navigate("/agent")
    else if (role === "admin") navigate("/admin")
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
    setProfileData({ profilePicture: null, gender: "", phoneNumber: "" })
    loginForm.reset()
    signupForm.reset()
    profileForm.reset()
  }

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    if (!credentialResponse?.credential) {
      return toast.error("Google token missing");
    }

    console.log(credentialResponse.credential);
    

    const response = await fetch('http://localhost:3003/api/auth/google', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
      credentials: 'include' // Important for setting cookie
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(data.message);
      
      const role = data.user?.role;
      if (role === "user") navigate("/");
      else if (role === "agent") navigate("/agent");
      else if (role === "admin") navigate("/admin");

      if (onClose) onClose();
    } else {
      throw new Error(data.message || 'Google login failed');
    }
  } catch (error) {
    console.error('Google login failed:', error);
    toast.error(error.message);
  }
};


  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          <div className="flex-1 p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">
                {currentStep === "login" && "Login"}
                {currentStep === "signup" && "Sign Up"}
                {currentStep === "profile-completion" && "Complete Your Profile"}
              </h2>
            </div>

            {currentStep === "login" && (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field }) => (
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                {loginForm.formState.errors.root && (
                  <p className="text-red-500 text-sm">{loginForm.formState.errors.root.message}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2"></div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => toast.error("Google login failed")}
  useOneTap
  auto_select
/>

                <p className="text-center text-sm text-gray-500">
                  {"Don't have an account? "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentStep("signup")}>
                    Sign up
                  </Button>
                </p>
              </form>
            )}

            {currentStep === "signup" && (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6">
                <div>
                  <Label htmlFor="signup-username">Username</Label>
                  <Controller
                    name="username"
                    control={signupForm.control}
                    render={({ field }) => (
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a username"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                  {signupForm.formState.errors.username && (
                    <p className="text-red-500 text-sm">{signupForm.formState.errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Controller
                    name="email"
                    control={signupForm.control}
                    render={({ field }) => (
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Controller
                    name="password"
                    control={signupForm.control}
                    render={({ field }) => (
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Controller
                    name="role"
                    control={signupForm.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user">User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="agent" id="agent" />
                          <Label htmlFor="agent">Agent</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {signupForm.formState.errors.role && (
                    <p className="text-red-500 text-sm">{signupForm.formState.errors.role.message}</p>
                  )}
                </div>
                {signupForm.formState.errors.root && (
                  <p className="text-red-500 text-sm">{signupForm.formState.errors.root.message}</p>
                )}
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => toast.error("Google login failed")}
  useOneTap
  auto_select
/>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentStep("login")}>
                    Login
                  </Button>
                </p>
              </form>
            )}

            {currentStep === "profile-completion" && (
              <form onSubmit={profileForm.handleSubmit(handleProfileCompletion)} className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">Help us personalize your experience (optional)</p>
                </div>
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
                <div>
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={profileForm.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
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
                    )}
                  />
                  {profileForm.formState.errors.gender && (
                    <p className="text-red-500 text-sm">{profileForm.formState.errors.gender.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Controller
                    name="phoneNumber"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="mt-2"
                        {...field}
                      />
                    )}
                  />
                </div>
                {profileForm.formState.errors.root && (
                  <p className="text-red-500 text-sm">{profileForm.formState.errors.root.message}</p>
                )}
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
          <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col justify-center items-center text-center p-6 lg:p-8">
  <div className="mb-3">
    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2 tracking-wide">eestate</h2>
    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
      <span className="text-lg lg:text-xl">🏠</span>
    </div>
  </div>
  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
    {currentStep === "login" && "Welcome Back"}
    {currentStep === "signup" && "Join Us"}
    {currentStep === "profile-completion" && "Complete Your Profile"}
  </h3>
  <p className="text-gray-700 text-xs lg:text-sm leading-relaxed max-w-[240px]">
    {currentStep === "login" && "Access your dashboard to manage properties seamlessly."}
    {currentStep === "signup" && "Start exploring real estate opportunities today."}
    {currentStep === "profile-completion" && "Tailor your profile for personalized recommendations."}
  </p>
</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}