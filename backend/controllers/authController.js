
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt'

const client= new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const  googleLogin= async (req,res,next)=>{
try{
    const {credential}=req.body

     const ticket = await client.verifyIdToken({
      idToken: credential, 
      audience: process.env.GOOGLE_CLIENT_ID,
    });

     const payload=ticket.getPayload();
    const {email,name,sub:googleId,picture}=payload;
    let user = await User.findOne({ email });
if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture,
        role: 'user',
      });
    }

        const token = generateToken(res,user._id);
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
    })
    
}
catch(error){
    next(error)
}
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(res, user._id);
    res.status(201).json({ token, user });
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
    //   return res.status(400).json({ message: 'Invalid email or passwordsss' }); 
    // }
    const token = generateToken(res, user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};