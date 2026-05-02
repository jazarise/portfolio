/**
 * MongoDB Clean & Seed Script
 * Run: npx tsx scripts/seed.ts
 * Wipes all data and creates the single admin user.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

// ─── Models ───────────────────────────────────────────────────────────────
const PermissionSchema = new mongoose.Schema({
  createBlog:   { type: Boolean, default: false },
  editOwnPosts: { type: Boolean, default: true },
  editAllPosts: { type: Boolean, default: false },
  publishPosts: { type: Boolean, default: false },
  addProjects:  { type: Boolean, default: false },
  editProjects: { type: Boolean, default: false },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['ADMIN', 'EDITOR', 'VIEWER'], default: 'VIEWER' },
  permissions: { type: PermissionSchema, default: () => ({}) },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({}, { strict: false });
const CertificateSchema = new mongoose.Schema({}, { strict: false });
const BlogPostSchema = new mongoose.Schema({}, { strict: false });

const User        = mongoose.models.User        || mongoose.model('User', UserSchema);
const Project     = mongoose.models.Project     || mongoose.model('Project', ProjectSchema);
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
const BlogPost    = mongoose.models.BlogPost    || mongoose.model('BlogPost', BlogPostSchema);

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.');

  // 1. Wipe all data to remove unwanted dummy data
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Certificate.deleteMany({}),
    BlogPost.deleteMany({}),
  ]);
  console.log('🗑  Cleared all existing users, projects, certificates, and blog posts.');

  // 2. Create the one and only admin
  const adminEmail = 'jaishanthcys@gmail.com';
  const hashedPassword = await bcrypt.hash('Jaims@1402', 12);
  
  await User.create({
    name: 'JAISHANTH',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
    permissions: {},
  });
  console.log(`✅ Admin user created (${adminEmail}).`);

  await mongoose.disconnect();
  console.log('🏁 Database is now clean and ready for production!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
