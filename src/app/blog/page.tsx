import type { Metadata } from 'next';
import BlogContent from './BlogContent';
import { getBlogPosts, getContentSection } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('blog');
  return {
    title: 'Blog · Jaishanth M',
    description: cfg.subtitle || 'Security write-ups, CTF solutions and research notes by Jaishanth M.',
  };
}

export default async function BlogPage() {
  const dbPosts = await getBlogPosts();
  const cfg = await getContentSection('blog');
  return <BlogContent dbPosts={dbPosts} cfg={cfg} />;
}
