import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { getContentSection, getSocialLinks } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('contact');
  return {
    title: 'Contact · Jaishanth M',
    description: cfg.subtitle || 'Get in touch with Jaishanth M — open to internships, collaborations, and security research.',
  };
}

export default async function ContactPage() {
  const cfg = await getContentSection('contact');
  const homeCfg = await getContentSection('home');
  const socialLinks = await getSocialLinks();
  
  return <ContactContent cfg={cfg} homeCfg={homeCfg} socialLinks={socialLinks} />;
}
