import { getContentSection, getProjects, getCertificates } from '@/app/actions';
import { getGithubStats } from '@/lib/githubStats';
import HomeClient from './HomeClient';
import { getBaseUrl } from '@/lib/baseUrl';

export default async function HomePage() {
  const [cfg, projects, certs] = await Promise.all([
    getContentSection('home'),
    getProjects(),
    getCertificates(),
  ]);

  const githubStats = await getGithubStats(cfg.githubUsername);
  const baseUrl = getBaseUrl();

  const jsonLdSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Jaishanth',
      givenName: 'Jaishanth',
      familyName: 'M',
      alternateName: ['Jaishanth M', 'Jaishanth MCET', 'jaishanthh', 'jaishanthm', 'jaiz_sec', 'jazarise'],
      jobTitle: 'Cybersecurity Student & Bugcrowd Security Researcher',
      description: 'Cybersecurity student at Dr. Mahalingam College of Engineering and Technology (MCET Pollachi) and Security Researcher at Bugcrowd, focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and bug bounty research.',
      url: baseUrl,
      image: `${baseUrl}/profile.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pollachi',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'India'
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Dr. Mahalingam College of Engineering and Technology',
        alternateName: 'MCET Pollachi',
        url: 'https://mcet.in'
      },
      knowsAbout: [
        'Cybersecurity',
        'Ethical Hacking',
        'Bugcrowd Security Research',
        'Bug Bounty Hunting',
        'Penetration Testing',
        'Vulnerability Assessment',
        'Web Application Security',
        'Network Security',
        'Red Teaming',
        'Active Directory Security',
        'Linux & Windows Security',
        'Python Automation',
        'MITRE ATT&CK',
        'Cloud Security'
      ],
      sameAs: [
        'https://bugcrowd.com/jaishanth',
        'https://instagram.com/jaishanthh',
        'https://github.com/jaishanthm',
        'https://linkedin.com/in/jaishanth',
        'https://tryhackme.com/p/jaishanth',
        'https://discord.com/users/jaishanthm'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Jaishanth - Cybersecurity Portfolio',
      description: 'Official Cybersecurity Portfolio of Jaishanth, Cybersecurity Student at Dr. Mahalingam College of Engineering and Technology (MCET Pollachi).',
      publisher: {
        '@type': 'Person',
        name: 'Jaishanth'
      },
      inLanguage: 'en-US'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${baseUrl}/#profilepage`,
      url: baseUrl,
      name: 'Jaishanth | Cybersecurity Student | Ethical Hacker & Red Teaming',
      mainEntity: {
        '@id': `${baseUrl}/#person`
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
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
