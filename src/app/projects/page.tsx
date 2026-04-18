import type { Metadata } from 'next';
import ProjectsContent from './ProjectsContent';
import { getProjects, getContentSection } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('projects');
  return {
    title: 'Projects · Jaishanth M',
    description: cfg.subtitle || 'Security tools, applications, and research systems built by Jaishanth M.',
  };
}

export default async function ProjectsPage() {
  const dbProjects = await getProjects();
  const cfg = await getContentSection('projects');
  return <ProjectsContent dbProjects={dbProjects} cfg={cfg} />;
}
