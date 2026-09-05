import type { Metadata } from 'next';
import { Inter, Outfit, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import ClientProviders from '@/components/ClientProviders';
import { getContentSection, getSocialLinks } from '@/app/actions';
import { GlobalStateProvider } from '@/lib/GlobalState';
import { getBaseUrl } from '@/lib/baseUrl';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();

  const defaultTitle = 'Jaishanth | Cybersecurity Student & Ethical Hacker';
  const defaultDesc = 'Jaishanth is a Cybersecurity student at MCET Pollachi focused on ethical hacking, VAPT, red teaming, and web security.';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: '%s | Jaishanth',
    },
    description: defaultDesc,
    keywords: [
      'Jaishanth',
      'Jaishanth cybersecurity',
      'Jaishanth Bugcrowd',
      'Bugcrowd security researcher',
      'bug bounty researcher India',
      'Jaishanth ethical hacker',
      'Jaishanth penetration testing',
      'Jaishanth MCET',
      'Jaishanth Pollachi',
      'cybersecurity student India',
      'ethical hacking student',
      'offensive security',
      'red teaming',
      'vulnerability assessment',
      'web security',
      'penetration tester',
      'security researcher',
      'Dr Mahalingam College of Engineering and Technology cybersecurity',
      'MCET Pollachi cybersecurity',
      'TryHackMe Jaishanth',
      'VAPT engineer India'
    ],
    authors: [{ name: 'Jaishanth', url: baseUrl }],
    creator: 'Jaishanth',
    publisher: 'Jaishanth',
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: baseUrl,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jaishanth - Cybersecurity Student & Ethical Hacker at MCET Pollachi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [`${baseUrl}/og-image.png`],
      creator: '@jaishanth',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: [
        '3fDZBdJFbG2EBvqNSArIjGN5Ii3rH_z6lCVYSJFUKSM',
        'ooABEFeHebqS6ijG2fFcJ_YvkvJx3e-T9mxTSloCoy4',
      ],
    },
  };
}

export const revalidate = 60; // Cache pages for 60 seconds to prevent DB spam

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [homeCfg, navbarCfg, footerCfg, profileCfg, socialLinks] = await Promise.all([
    getContentSection('home'),
    getContentSection('navbar'),
    getContentSection('footer'),
    getContentSection('profile'),
    getSocialLinks()
  ]);

  const initialState = { homeCfg, navbarCfg, footerCfg, profileCfg, socialLinks };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable} ${spaceMono.variable}`}>
      <body className="antialiased font-sans text-gray-200 bg-dark-main">
        <GlobalStateProvider initialState={initialState}>
          <ClientProviders>
            <ScrollProgress />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </ClientProviders>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
