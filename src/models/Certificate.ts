import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String },
  verifyUrl: { type: String },
  image: { type: String }, // Base64 string or remote URL
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
