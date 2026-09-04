import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String }, // emoji or svg string
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  customLabel: { type: String }, // display name override
}, { timestamps: true });

export default mongoose.models.SocialMedia || mongoose.model('SocialMedia', SocialMediaSchema);
