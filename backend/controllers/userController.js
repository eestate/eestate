
import User from '../models/User.js';
import { Property } from '../models/Property.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const getCurrentUser = (req, res) => {
  res.status(200).json(req.user);
};



export const getAllAgents = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, search = '' } = req.query;
    const query = { role: 'agent' }; 

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const agents = await User.find(query)
      .select('name specialization experience image')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      agents,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getAgentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agent = await User.findById(id)
      .select('name email phone gender profilePic role isVerified');

    if (!agent || agent.role !== 'agent' || agent.isBlocked) {
      return res.status(404).json({ message: 'Agent not found or not active' });
    }

    const properties = await Property.find({ agentId: id, isActive: true })
      .select('name price images address propertyType bedrooms bathrooms sqft status')
      .sort({ createdAt: -1 });

    const stats = {
      total: properties.length,
      active: properties.filter(p => p.status === 'available').length,
      sold: properties.filter(p => p.status === 'sold').length,
    };

    res.status(200).json({
      agent: {
        ...agent.toObject(),
        stats,
        listings: properties.map(p => ({
          id: p._id,
          name: p.name,
          image: p.images?.[0] || 'https://via.placeholder.com/400',
          type: p.propertyType,
          price: p.price,
          address: p.address,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    let updatedFields = { name };

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updatedFields.profilePic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    ).select('-password'); // exclude password

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

