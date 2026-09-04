import { getContentSection, getProjects, getCertificates } from '@/app/actions';
import { getGithubStats } from '@/lib/githubStats';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const [cfg, projects, certs] = await Promise.all([
    getContentSection('home'),
    getProjects(),
    getCertificates(),
  ]);

  const githubStats = await getGithubStats(cfg.githubUsername);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jaishanth',
    jobTitle: 'Cybersecurity Student & Ethical Hacker',
    description: 'Cybersecurity student at Dr. Mahalingam College of Engineering and Technology (MCET), Pollachi, focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Dr. Mahalingam College of Engineering and Technology',
      alternateName: 'MCET Pollachi',
    },
    knowsAbout: [
      'Ethical Hacking',
      'Penetration Testing',
      'Vulnerability Assessment',
      'Web Application Security',
      'Network Security',
      'Red Teaming',
      'Active Directory Security',
      'Linux Security',
      'Python Automation',
      'MITRE ATT&CK'
    ],
    sameAs: [
      'https://tryhackme.com/p/jaishanth',
      'https://github.com/jazarise',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        cfg={cfg}
        projectCount={projects.length}
        certCount={certs.length}
        githubStats={githubStats}
      />
    </>
  );
}
