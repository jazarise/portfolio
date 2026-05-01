import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String },
  tags: [String],
<<<<<<< HEAD
  metrics: [String], // e.g. "Scanned 100+ hosts", "Detects open ports using Nmap"
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  githubUrl: { type: String },
  liveUrl: { type: String },
  iconSvg: { type: String },
  imageUrl: { type: String },
  videoUrl: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
