import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jaishanth - Cybersecurity Portfolio',
    short_name: 'Jaishanth',
    description: 'Cybersecurity student at Dr. Mahalingam College of Engineering and Technology (MCET Pollachi) focused on ethical hacking, penetration testing, and security research.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/profile.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/profile.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
