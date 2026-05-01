import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.');

  const adminEmail = 'admin@jaiz.sec';
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log('⚠️  Admin user already exists. Skipping seed.');
  } else {
    const hashedPassword = await bcrypt.hash('Jaims@1402', 12);
    await User.create({
      name: 'JAISHANTH',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      permissions: {},
    });
    console.log('✅ Admin user created:');
    console.log('   Email:    admin@jaiz.sec');
    console.log('   Password: Jaims@1402');
    console.log('   Role:     ADMIN');
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
