import OfflinePage from '@/components/pwa/OfflinePage';

export const metadata = {
  title: 'You\'re Offline - Travellr',
  description: 'No internet connection detected. Browse cached content while offline.',
  robots: 'noindex, nofollow'
};

export default function Offline() {
  return <OfflinePage />;
}