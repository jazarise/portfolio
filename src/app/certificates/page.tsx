import type { Metadata } from 'next';
import CertsContent from './CertsContent';
import { getCertificates, getContentSection } from '@/app/actions';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('certs');
  return {
    title: 'Certifications · Jaishanth M',
    description: cfg.subtitle || 'Verified cybersecurity certifications earned by Jaishanth M.',
  };
}

export default async function CertificatesPage() {
  const dbCerts = await getCertificates();
  const cfg = await getContentSection('certs');
  return <CertsContent dbCerts={dbCerts} cfg={cfg} />;
}
