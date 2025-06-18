
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.js';


const client= new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture,
        role: 'user',
        isVerified: true, // Google verified emails
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if logging in for first time
      user.googleId = googleId;
      user.profilePic = picture;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(res, user._id);

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
    
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(res, user._id);
    res.status(201).json({ 
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google login. Please use Google to sign in.' });
    }

    // const isMatch = await user.matchPassword(password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid email or password' }); 
    // }

    const token = generateToken(res, user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { gender, phone, name, profilePic } = req.body; // profilePic is base64 data URI
    console.log('Update profile request:', { gender, phone, name, hasProfilePic: !!profilePic });

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (gender) user.gender = gender;
    if (phone) user.phone = phone;
    if (name) user.name = name;

    // Handle profile picture upload
    if (profilePic && typeof profilePic === 'string' && profilePic.startsWith('data:image/')) {
      try {
        console.log('Uploading profile picture to Cloudinary');
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: 'profile_pics',
          format: 'jpg',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        console.log('Profile picture uploaded:', uploadResponse.secure_url);
        user.profilePic = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload profile picture',
          error: uploadError.message 
        });
      }
    }

    const updatedUser = await user.save();
    console.log('Profile updated:', { userId: updatedUser._id, profilePic: updatedUser.profilePic });

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      profilePic: updatedUser.profilePic,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Error in updateProfile:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Profile update failed',
      error: error.message 
    });
  }
};

export const checkAuth = async (req, res) => {

  // console.log('Check auth headers:', req.headers);
    // console.log('Check auth cookies:', req.cookies)

  try {
    if (!req.user) {
      return res.status(401).json({ isAuthenticated: false });
    }
    
    // console.log('User authenticated:', req.user._id);

    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        profilePic: req.user.profilePic
      }
    });
  } catch (error) {
     console.error('Check auth error:', error);
    res.status(500).json({ error: error.message });
  }
};



export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      domain: 'localhost'
    });

    // console.log('Cookies after clear:', res.getHeaders()['set-cookie']);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};