import type { Metadata } from 'next';
import AboutContent from './AboutContent';
import { getContentSection } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About | Jaishanth | Cybersecurity Student @ MCET Pollachi',
    description: 'Jaishanth is a Cybersecurity student at Dr. Mahalingam College of Engineering and Technology (MCET), Pollachi, focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.',
    keywords: [
      'Jaishanth cybersecurity',
      'Jaishanth ethical hacker',
      'Jaishanth penetration testing',
      'Dr Mahalingam College of Engineering and Technology cybersecurity',
      'MCET Pollachi',
      'offensive security',
      'red teaming',
      'vulnerability assessment',
      'web security'
    ],
  };
}

export default async function AboutPage() {
  const cfg = await getContentSection('about');
  const homeCfg = await getContentSection('home');
  return <AboutContent cfg={cfg} homeCfg={homeCfg} />;
}
