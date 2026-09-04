import mongoose from 'mongoose';

const ContentSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true }, // e.g., "home", "about", "projects", "contact"
  data: { type: mongoose.Schema.Types.Mixed, required: true, default: {} }, // Flexible key-value pairs
}, { timestamps: true });

export default mongoose.models.ContentSection || mongoose.model('ContentSection', ContentSectionSchema);
