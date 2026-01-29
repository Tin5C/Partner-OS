// Partner Space Page
// Wrapper that provides SpaceContext for /partner route

import { SpaceProvider } from '@/contexts/SpaceContext';
import { HomeRenderer } from '@/components/shared/HomeRenderer';

export default function PartnerPage() {
  return (
    <SpaceProvider>
      <HomeRenderer />
    </SpaceProvider>
  );
}
