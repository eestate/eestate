import mongoose from 'mongoose';

const termsAndConditionsSchema = new mongoose.Schema({
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  version: { type: String, required: true, unique: true },
});

export default mongoose.model('TermsAndConditions', termsAndConditionsSchema);