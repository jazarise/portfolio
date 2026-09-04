import type { Metadata } from 'next';
import AboutContent from './AboutContent';
import { getContentSection } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  const homeCfg = await getContentSection('home');
  return {
    title: 'About · ' + (homeCfg.heading || 'Jaishanth M'),
    description: `Learn about ${homeCfg.heading || 'Jaishanth M'} — ${homeCfg.tagline || 'Cybersecurity Enthusiast'}.`,
  };
}

export default async function AboutPage() {
  const cfg = await getContentSection('about');
  const homeCfg = await getContentSection('home');
  return <AboutContent cfg={cfg} homeCfg={homeCfg} />;
}
