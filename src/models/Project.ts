import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String },
  tags: [String],
  metrics: [String], // e.g. "Scanned 100+ hosts", "Detects open ports using Nmap"
  githubUrl: { type: String },
  liveUrl: { type: String },
  iconSvg: { type: String },
  imageUrl: { type: String },
  videoUrl: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
