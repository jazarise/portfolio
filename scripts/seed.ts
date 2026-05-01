<<<<<<< HEAD
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
=======
/**
 * MongoDB Seed Script
 * Run: npx tsx scripts/seed.ts
 * Seeds initial projects, certs, and blog posts that will show in BOTH
 * the public pages AND the admin dashboard (single source of truth).
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

// ─── Models (inline to avoid TS path alias issues in script) ─────────────────
const ProjectSchema = new mongoose.Schema({
  title: String, description: String, longDescription: String,
  category: String, tags: [String], githubUrl: String,
  liveUrl: String, iconSvg: String, featured: { type: Boolean, default: false },
}, { timestamps: true });

const CertificateSchema = new mongoose.Schema({
  title: String, issuer: String, date: String,
  verifyUrl: String, image: String, techStack: [String],
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  title: String, excerpt: String, content: String,
  slug: { type: String, unique: true }, coverImage: String, tags: [String],
}, { timestamps: true });

const Project     = mongoose.models.Project     || mongoose.model('Project',     ProjectSchema);
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
const BlogPost    = mongoose.models.BlogPost    || mongoose.model('BlogPost',    BlogPostSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'NetSentinel', category: 'SECURITY TOOL', featured: true,
    description: 'Real-time network intrusion detection using packet analysis and ML-based anomaly detection. Monitors traffic and alerts on suspicious activity with 97% accuracy.',
    longDescription: 'NetSentinel is a comprehensive network intrusion detection system that combines traditional signature-based detection with machine learning anomaly detection. Uses Scapy for packet capture, TensorFlow for the ML pipeline, Flask for the dashboard, and Redis for real-time event streaming.',
    tags: ['Python', 'Scapy', 'TensorFlow', 'Flask', 'Redis'],
    githubUrl: 'https://github.com/jaishanthm/netsentinel',
  },
  {
    title: 'VaultCipher', category: 'SECURITY APP', featured: true,
    description: 'End-to-end encrypted password manager with zero-knowledge architecture. AES-256 encryption with PBKDF2 key derivation. Browser extension + CLI.',
    longDescription: 'VaultCipher implements a zero-knowledge architecture where the server never has access to decrypted user data. AES-256-GCM for vault encryption, PBKDF2 with 600,000 iterations for key derivation, supports React browser extension and Node.js CLI.',
    tags: ['React', 'Node.js', 'AES-256', 'PostgreSQL', 'TypeScript'],
    githubUrl: 'https://github.com/jaishanthm/vaultcipher',
  },
  {
    title: 'PhishGuard', category: 'ML + SECURITY', featured: false,
    description: 'ML model detecting phishing URLs with 97.3% accuracy. Analyzes URL structure, domain age, SSL certs, and page content.',
    longDescription: 'PhishGuard uses a gradient-boosted decision tree model trained on 100k+ labeled URLs. Features extracted from URL structure, WHOIS data, SSL certificate info, and HTML page content to classify URLs as phishing or legitimate.',
    tags: ['Python', 'scikit-learn', 'FastAPI', 'Docker'],
    githubUrl: 'https://github.com/jaishanthm/phishguard',
  },
];

const CERTS = [
  {
    title: 'Linux Unhatched', issuer: 'Cisco Networking Academy',
    date: '29 Mar 2026', verifyUrl: '#',
    techStack: ['Linux OS', 'Command Line', 'System Administration'],
  },
  {
    title: 'Networking Basics', issuer: 'Cisco Networking Academy',
    date: '17 Feb 2026', verifyUrl: '#',
    techStack: ['Network Protocols', 'Routing', 'Switching', 'TCP/IP'],
  },
  {
    title: 'Operating Systems Basics', issuer: 'Cisco Networking Academy',
    date: '16 Mar 2026', verifyUrl: '#',
    techStack: ['OS Architecture', 'Process Management', 'Security Basics'],
  },
];

const POSTS = [
  {
    title: 'The Evolution of Zero-Trust in Modern Cloud Architectures',
    excerpt: 'Analyzing how zero-trust frameworks have adapted to serverless infrastructure and ephemeral containers, moving past traditional network perimeters.',
    slug: 'zero-trust-cloud-architectures',
    content: '# Zero-Trust Security\n\nZero-trust is no longer a buzzword — it is the baseline...\n\n## What Has Changed\n\nTraditional perimeter-based security assumed everything inside the network was safe...',
    tags: ['Architecture', 'Cloud Security', 'Zero-Trust'],
  },
  {
    title: 'Breaking Down the Latest V8 Engine Vulnerability',
    excerpt: 'A deep dive into how memory corruption inside JavaScript core engines can lead to sandbox escapes and remote code execution.',
    slug: 'v8-engine-vulnerability-analysis',
    content: '# V8 Vulnerability Analysis\n\nModern JavaScript engines like V8 are incredibly complex...\n\n## Root Cause\n\nThe vulnerability stems from a type confusion bug in JIT compilation...',
    tags: ['Reverse Engineering', 'CVE Analysis', 'JavaScript'],
  },
  {
    title: 'Automating OSINT Workflows with Go',
    excerpt: 'How I built a custom pipeline to scrape, parse, and analyze threat actor infrastructure using Goroutines and the Shodan API.',
    slug: 'osint-automation-golang',
    content: '# OSINT Automation with Go\n\nOpen Source Intelligence gathering has become an essential skill...\n\n## Why Go?\n\nGo\'s concurrency model via goroutines makes it ideal for I/O-heavy tasks...',
    tags: ['Golang', 'OSINT', 'Automation', 'Threat Intelligence'],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.');

  // Clear existing data
  await Promise.all([
    Project.deleteMany({}),
    Certificate.deleteMany({}),
    BlogPost.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing seed data.');

  // Insert
  await Promise.all([
    Project.insertMany(PROJECTS),
    Certificate.insertMany(CERTS),
    BlogPost.insertMany(POSTS),
  ]);

  console.log(`✅ Seeded:
  - ${PROJECTS.length} Projects
  - ${CERTS.length} Certificates
  - ${POSTS.length} Blog Posts`);

  await mongoose.disconnect();
  console.log('🏁 Done! Open http://localhost:3000 to see the data.');
}

seed().catch(err => {
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
