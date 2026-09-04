import mongoose from 'mongoose';

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
  password: { type: String, required: true }, // bcrypt hashed
  role:     { type: String, enum: ['ADMIN', 'EDITOR', 'VIEWER'], default: 'VIEWER' },
  permissions: { type: PermissionSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
