import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, required: true }, // Markdown
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String }, // Base64 string or remote URL
  videoUrl: { type: String },
  tags: [String],
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
