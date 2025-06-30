import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  responded: { type: Boolean, default: false },
});

export default mongoose.model('ContactSubmission', contactSubmissionSchema);