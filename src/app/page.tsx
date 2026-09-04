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

  return (
    <HomeClient
      cfg={cfg}
      projectCount={projects.length}
      certCount={certs.length}
      githubStats={githubStats}
    />
  );
}
