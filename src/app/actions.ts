'use server';

import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Certificate from '@/models/Certificate';
import BlogPost from '@/models/BlogPost';
import SocialMedia from '@/models/SocialMedia';
import Contact from '@/models/Contact';
import ContentSection from '@/models/ContentSection';
import { revalidatePath } from 'next/cache';
import { crawlTryHackMe, extractTHMUsername } from '@/lib/thmCrawler';
import { requireAdmin, requireEditorOrAdmin } from '@/lib/security';

// ─── Content Sections ────────────────────────────────────────────────────────

const PUBLIC_SECTIONS = new Set(['home', 'about', 'projects', 'certs', 'blog', 'contact', 'navbar', 'footer', 'profile']);

const DEFAULT_CONTENT: Record<string, any> = {
  home: {
    heading: 'Jaishanth M',
    subheading: 'Aspiring Red Teamer',
    tagline: 'Cybersecurity Student',
    bio: 'CS student with a security-first mindset. I break things to understand how to defend them — from network penetration testing to web app exploitation. Hands-on experience with TryHackMe, HackTheBox, and real-world security labs.',
    availableForWork: true,
    location: 'Tamil Nadu, India',
    email: 'jaishanthcys@gmail.com',
    platforms: 'TryHackMe,Top 1%,#88cc14,https://tryhackme.com/p/jaishanth; Hack The Box,Hacker,#9fef00,https://hackthebox.com',
    skills: 'Penetration Testing,85;Network Security,80;VAPT & Threat Analysis,78;Python/Scripting,90;Web App Security,82;Malware Analysis,65',
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

/** Public: get content section with strict sectionId allowlist */
export async function getPublicContentSection(sectionId: string) {
  if (!PUBLIC_SECTIONS.has(sectionId)) {
    throw new Error('Forbidden: Invalid or non-public content section');
  }
  try {
    const db = await dbConnect();
    if (!db) return DEFAULT_CONTENT[sectionId] || {};
    const doc = await ContentSection.findOne({ sectionId }).lean();
    return doc ? JSON.parse(JSON.stringify((doc as any).data)) : DEFAULT_CONTENT[sectionId] || {};
  } catch {
    return DEFAULT_CONTENT[sectionId] || {};
  }
}

/** Admin: get any content section */
export async function getAdminContentSection(sectionId: string) {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return DEFAULT_CONTENT[sectionId] || {};
    const doc = await ContentSection.findOne({ sectionId }).lean();
    return doc ? JSON.parse(JSON.stringify((doc as any).data)) : DEFAULT_CONTENT[sectionId] || {};
  } catch {
    return DEFAULT_CONTENT[sectionId] || {};
  }
}

/** Public content section reader */
export async function getContentSection(sectionId: string) {
  return getPublicContentSection(sectionId);
}

export async function updateContentSection(sectionId: string, data: any) {
  await requireAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline. Cannot save content.');
  await ContentSection.findOneAndUpdate(
    { sectionId }, 
    { $set: { data } }, 
    { upsert: true, returnDocument: 'after' }
  );
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/projects');
  revalidatePath('/certificates');
}

export async function crawlAndUpdateTHMAction(profileUrl: string) {
  await requireAdmin();
  const crawlData = await crawlTryHackMe(profileUrl);
  const currentHomeCfg = await getContentSection('home');
  const existingPlatforms = currentHomeCfg?.platforms || 'TryHackMe,Top 1%,#88cc14,https://tryhackme.com/p/jaishanth;HackerRank,Hacker,#00ea64,https://hackerrank.com';

  const username = extractTHMUsername(profileUrl);
  const profileLink = `https://tryhackme.com/p/${username || 'jaishanth'}`;
  
  const updatedPlatformsList = existingPlatforms.split(';').map((item: string) => {
    const parts = item.split(',');
    if (parts[0]?.trim().toLowerCase() === 'tryhackme') {
      return `TryHackMe,${crawlData.rank},#88cc14,${profileLink}`;
    }
    return item;
  });

  if (!existingPlatforms.toLowerCase().includes('tryhackme')) {
    updatedPlatformsList.unshift(`TryHackMe,${crawlData.rank},#88cc14,${profileLink}`);
  }

  const newPlatformsStr = updatedPlatformsList.join(';');
  await updateContentSection('home', {
    ...currentHomeCfg,
    platforms: newPlatformsStr,
    thmCrawledRank: crawlData.rank,
    thmLastCrawled: crawlData.lastCrawled,
    thmProfileUrl: profileLink,
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/dashboard');

  return crawlData;
}

// ─── Projects ───────────────────────────────────────────────────────────────

/** Public: only visible projects */
export async function getProjects() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Project.find({ visible: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

/** Admin: all projects including hidden */
export async function getAllProjects() {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Project.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createProject(data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline. Cannot create project.');
  await Project.create(data);
  revalidatePath('/projects');
  revalidatePath('/');
}

export async function updateProject(id: string, data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Project.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  revalidatePath('/projects');
  revalidatePath('/');
}

export async function deleteProject(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Project.findByIdAndDelete(id);
  revalidatePath('/projects');
  revalidatePath('/');
}

// ─── Certifications ─────────────────────────────────────────────────────────

/** Public: only visible certificates */
export async function getCertificates() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Certificate.find({ visible: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

/** Admin: all certificates including hidden */
export async function getAllCertificates() {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Certificate.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createCertificate(data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.create(data);
  revalidatePath('/certificates');
  revalidatePath('/');
}

export async function updateCertificate(id: string, data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  revalidatePath('/certificates');
  revalidatePath('/');
}

export async function deleteCertificate(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Certificate.findByIdAndDelete(id);
  revalidatePath('/certificates');
  revalidatePath('/');
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

/** Public: only visible posts */
export async function getBlogPosts() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await BlogPost.find({ visible: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

/** Admin: all posts including hidden */
export async function getAllBlogPosts() {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createBlogPost(data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  await BlogPost.create(data);
  revalidatePath('/blog');
}

export async function updateBlogPost(id: string, data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  await BlogPost.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  revalidatePath('/blog');
}

export async function deleteBlogPost(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await BlogPost.findByIdAndDelete(id);
  revalidatePath('/blog');
}

// ─── Social Media ────────────────────────────────────────────────────────────

/** Public: only enabled social links */
export async function getSocialLinks() {
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await SocialMedia.find({ enabled: { $ne: false } }).sort({ order: 1 }).lean();
    if (docs.length === 0) {
      const defaults = [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/#', icon: '🔗', order: 1, enabled: true },
        { platform: 'Instagram', url: 'https://instagram.com/#', icon: '📸', order: 2, enabled: true },
        { platform: 'GitHub', url: 'https://github.com/#', icon: '🐙', order: 3, enabled: true },
        { platform: 'Discord', url: '#', icon: '💬', order: 4, enabled: true },
        { platform: 'TryHackMe', url: 'https://tryhackme.com/p/#', icon: '🛡️', order: 5, enabled: true },
        { platform: 'Email', url: 'mailto:anonymous@example.com', icon: '✉️', order: 6, enabled: true },
      ];
      return defaults;
    }
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

/** Admin: all social links including disabled */
export async function getAllSocialLinks() {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await SocialMedia.find({}).sort({ order: 1 }).lean();
    if (docs.length === 0) {
      const defaults = [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/#', icon: '🔗', order: 1, enabled: true },
        { platform: 'Instagram', url: 'https://instagram.com/#', icon: '📸', order: 2, enabled: true },
        { platform: 'GitHub', url: 'https://github.com/#', icon: '🐙', order: 3, enabled: true },
        { platform: 'Discord', url: '#', icon: '💬', order: 4, enabled: true },
        { platform: 'TryHackMe', url: 'https://tryhackme.com/p/#', icon: '🛡️', order: 5, enabled: true },
        { platform: 'Email', url: 'mailto:anonymous@example.com', icon: '✉️', order: 6, enabled: true },
      ];
      return defaults;
    }
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function createSocialLink(data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.create(data);
  revalidatePath('/contact');
  revalidatePath('/');
}

export async function updateSocialLink(id: string, data: any) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  revalidatePath('/contact');
  revalidatePath('/');
}

export async function deleteSocialLink(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await SocialMedia.findByIdAndDelete(id);
  revalidatePath('/contact');
  revalidatePath('/');
}

// ─── Visibility Toggle ──────────────────────────────────────────────────────

export async function toggleVisibility(collection: 'projects' | 'certs' | 'blog' | 'social', id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');

  const ModelMap: Record<string, any> = {
    projects: Project,
    certs: Certificate,
    blog: BlogPost,
    social: SocialMedia,
  };

  const fieldMap: Record<string, string> = {
    projects: 'visible',
    certs: 'visible',
    blog: 'visible',
    social: 'enabled',
  };

  const Model = ModelMap[collection];
  const field = fieldMap[collection];
  if (!Model || !field) throw new Error('Invalid collection');

  const doc = await Model.findById(id);
  if (!doc) throw new Error('Record not found');

  const currentValue = doc[field] !== false; // treat missing as true
  await Model.findByIdAndUpdate(id, { [field]: !currentValue });

  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/certificates');
  revalidatePath('/blog');
  revalidatePath('/contact');

  return !currentValue;
}

// ─── Contact Messages ────────────────────────────────────────────────────────

export async function getContactMessages() {
  await requireEditorOrAdmin();
  try {
    const db = await dbConnect();
    if (!db) return [];
    const docs = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch { return []; }
}

export async function deleteContactMessage(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Contact.findByIdAndDelete(id);
}

export async function markMessageRead(id: string) {
  await requireEditorOrAdmin();
  const db = await dbConnect();
  if (!db) throw new Error('Database offline.');
  await Contact.findByIdAndUpdate(id, { read: true });
}

/** Public: get single blog post by slug */
export async function getBlogPostBySlug(slug: string) {
  try {
    const db = await dbConnect();
    if (!db) return null;
    const doc = await BlogPost.findOne({ slug, visible: { $ne: false } }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch {
    return null;
  }
}

