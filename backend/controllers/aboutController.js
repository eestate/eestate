import About from '../models/About.js';
import {uploadToCloudinary } from "../middleware/uploadMiddleware.js";

export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    console.error('Get About Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { heading, description, mission, services, team } = req.body;
    let parsedTeam = team;
    let parsedServices = services;
    if (typeof team === 'string') {
      try {
        parsedTeam = JSON.parse(team);
      } catch (err) {
        throw new Error('Invalid team JSON format');
      }
    }
    if (typeof services === 'string') {
      try {
        parsedServices = JSON.parse(services);
      } catch (err) {
        throw new Error('Invalid services JSON format');
      }
    }
    const updatedTeam = await Promise.all(
      parsedTeam.map(async (member, index) => {
        const file = req.files?.find(f => f.fieldname === `team[${index}][image]`);
        if (file) {
          try {
            const result = await uploadToCloudinary(file);
            return {
              ...member,
              image: result.secure_url,
            };
          } catch (error) {
            console.error(`Image upload failed for team member ${index}:`, error);
            throw new Error(`Image upload failed for team member ${index + 1}: ${error.message}`);
          }
        }
        return member;
      })
    );
    const updateData = {
      heading,
      description,
      mission,
      services: parsedServices || [],
      team: updatedTeam,
    };

    const about = await About.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.json(about);
  } catch (err) {
    console.error('Update About Error:', err);
    res.status(500).json({ error: err.message });
  }
};