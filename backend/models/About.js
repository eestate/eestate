
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  icon: String, 
  title: String,
  description: String,
});

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String, 
});

const AboutSchema = new mongoose.Schema({
  heading: String,
  description: String,
  mission: String,
  services: [ServiceSchema],
  team: [TeamMemberSchema],
});

export default mongoose.model('About', AboutSchema);