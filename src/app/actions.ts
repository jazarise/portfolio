'use server';

import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Certificate from '@/models/Certificate';
import BlogPost from '@/models/BlogPost';
import SocialMedia from '@/models/SocialMedia';
import Contact from '@/models/Contact';
import ContentSection from '@/models/ContentSection';
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ─── Security Helpers ────────────────────────────────────────────────────────

async function requireEditorOrAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const role = (session.user as any)?.role;
  if (!role) {
    console.error('[RBAC] Role missing from session.user:', JSON.stringify(session, null, 2));
    throw new Error('Role missing in session. Please sign out and sign in again.');
  }
  if (role !== 'ADMIN' && role !== 'EDITOR') throw new Error('Forbidden: Editor or Admin access required');
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const role = (session.user as any)?.role;
  if (!role) {
    console.error('[RBAC] Role missing from session.user:', JSON.stringify(session, null, 2));
    throw new Error('Role missing in session. Please sign out and sign in again.');
  }
  if (role !== 'ADMIN') throw new Error('Forbidden: Admin access required');
}
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a

// ─── Content Sections ────────────────────────────────────────────────────────

const DEFAULT_CONTENT: Record<string, any> = {
  home: {
    heading: 'Jaishanth M',
<<<<<<< HEAD
    subheading: 'Aspiring Red Teamer',
    tagline: 'Cybersecurity Student',
    bio: 'CS student with a security-first mindset. I break things to understand how to defend them — from network penetration testing to web app exploitation. Hands-on experience with TryHackMe, HackTheBox, and real-world security labs.',
=======
    subheading: 'Ethical Hacker',
    tagline: 'Cybersecurity Enthusiast',
    bio: 'Building secure systems from the ground up. CS student obsessed with offensive security, clean code, and breaking things to understand them better.',
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
    availableForWork: true,
    location: 'Tamil Nadu, India',
    email: 'jaishanthcys@gmail.com',
    statProjects: '15+',
    statCerts: '6',
<<<<<<< HEAD
    platforms: 'TryHackMe,Top 1%,#88cc14,https://tryhackme.com/p/jaishanth; Hack The Box,Hacker,#9fef00,https://hackthebox.com',
    skills: 'Penetration Testing,85;Network Security,80;VAPT & Threat Analysis,78;Python/Scripting,90;Web App Security,82;Malware Analysis,65',
=======
    platforms: 'TryHackMe,Top 1%,#88cc14,https://tryhackme.com/p/jaishanth; HackerRank,Hacker,#00EA64,https://hackerrank.com',
    skills: 'Penetration Testing,85;Network Security,80;Python/Scripting,90;Web App Security,82;Malware Analysis,65',
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  },
  about: {
    p1: 'I am a cybersecurity enthusiast and full-stack developer who believes that to defend a system, you must first know how to break it.',
    p2: 'My journey began by exploring network security and CTF challenges, which naturally evolved into offensive security and vulnerability research.',
    p3: 'When I am not hunting bugs or analyzing packet captures, I am building robust, secure-by-design applications using modern stacks like Next.js, Python, and Go.',
    focuses: 'Offensive Security,Focus;Secure Architecture,Expertise;Machine Learning for Sec,Research',
  },
  projects: {
    title: 'Projects & Tools',
    subtitle: 'Security tools, applications, and research systems designed with clean architecture and modern performance standards.',
  },
  certs: {
    title: 'Certifications',
    subtitle: 'Formal verification of my technical capabilities and hands-on experience in offensive security and systems administration.',
  },
  blog: {
    title: 'Research & Writing',
    subtitle: 'Security write-ups, vulnerability analyses, and deep-dives into systems architecture.',
  },
  contact: {
    title: 'Open a Secure Channel',
    subtitle: 'Whether you want to discuss a vulnerability, propose an internship opportunity, or just talk about cyber, my inbox is open.',
  }
};

export async function getContentSection(sectionId: string) {
  try {
    const db = await dbConnect();
    if (!db) return DEFAULT_CONTENT[sectionId] || {};
    const doc = await ContentSection.findOne({ sectionId }).lean();
    return doc ? JSON.parse(JSON.stringify((doc as any).data)) : DEFAULT_CONTENT[sectionId] || {};
  } catch {
    return DEFAULT_CONTENT[sectionId] || {};
  }
}

export async function updateContentSection(sectionId: string, data: any) {
<<<<<<< HEAD
  await requireAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline. Cannot save content.');
  await ContentSection.findOneAndUpdate(
    { sectionId }, 
    { $set: { data } }, 
    { upsert: true, new: true }
  );
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/projects');
  revalidatePath('/certificates');
  revalidatePath('/blog');
  revalidatePath('/contact');
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function getProjects() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Project.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createProject(data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline. Cannot create project.');
  await Project.create(data);
  revalidatePath('/projects');
  revalidatePath('/');
}

export async function updateProject(id: string, data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Project.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/projects');
}

export async function deleteProject(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Project.findByIdAndDelete(id);
  revalidatePath('/projects');
}

// ─── Certifications ─────────────────────────────────────────────────────────

export async function getCertificates() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Certificate.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createCertificate(data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.create(data);
  revalidatePath('/certificates');
}

export async function updateCertificate(id: string, data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/certificates');
}

export async function deleteCertificate(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.findByIdAndDelete(id);
  revalidatePath('/certificates');
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export async function getBlogPosts() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createBlogPost(data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  await BlogPost.create(data);
  revalidatePath('/blog');
}

export async function updateBlogPost(id: string, data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  await BlogPost.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/blog');
}

export async function deleteBlogPost(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await BlogPost.findByIdAndDelete(id);
  revalidatePath('/blog');
}

// ─── Social Media ────────────────────────────────────────────────────────────

export async function getSocialLinks() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    let docs = await SocialMedia.find({}).sort({ order: 1 }).lean();
    if (docs.length === 0) {
      const defaults = [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/#', icon: '🔗', order: 1 },
        { platform: 'Instagram', url: 'https://instagram.com/#', icon: '📸', order: 2 },
        { platform: 'GitHub', url: 'https://github.com/#', icon: '🐙', order: 3 },
        { platform: 'Discord', url: '#', icon: '💬', order: 4 },
        { platform: 'TryHackMe', url: 'https://tryhackme.com/p/#', icon: '🛡️', order: 5 },
        { platform: 'Email', url: 'mailto:anonymous@example.com', icon: '✉️', order: 6 },
      ];
      return defaults;
    }
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createSocialLink(data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.create(data);
  revalidatePath('/contact');
}

export async function updateSocialLink(id: string, data: any) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/contact');
}

export async function deleteSocialLink(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.findByIdAndDelete(id);
  revalidatePath('/contact');
}

// ─── Contact Messages ────────────────────────────────────────────────────────

export async function getContactMessages() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function deleteContactMessage(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Contact.findByIdAndDelete(id);
}

export async function markMessageRead(id: string) {
<<<<<<< HEAD
  await requireEditorOrAdmin();
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Contact.findByIdAndUpdate(id, { read: true });
}
