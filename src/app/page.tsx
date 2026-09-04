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
    name: cfg.heading || 'Jaishanth M',
    jobTitle: cfg.subheading || 'Offensive Security Student',
    description: cfg.bio || 'Cybersecurity portfolio focusing on offensive security, pentesting, and secure software engineering.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev',
    sameAs: [
      'https://github.com/jazarise',
      'https://tryhackme.com/p/jaishanth',
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
