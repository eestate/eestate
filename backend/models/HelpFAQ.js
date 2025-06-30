import mongoose from 'mongoose';

const helpFAQSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('HelpFAQ', helpFAQSchema);