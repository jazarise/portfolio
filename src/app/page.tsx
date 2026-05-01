import { getContentSection } from '@/app/actions';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const cfg = await getContentSection('home');
  return <HomeClient cfg={cfg} />;
}
