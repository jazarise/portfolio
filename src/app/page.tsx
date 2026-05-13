import { getContentSection, getProjects, getCertificates } from '@/app/actions';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const [cfg, projects, certs] = await Promise.all([
    getContentSection('home'),
    getProjects(),
    getCertificates(),
  ]);

  return (
    <HomeClient
      cfg={cfg}
      projectCount={projects.length}
      certCount={certs.length}
    />
  );
}
