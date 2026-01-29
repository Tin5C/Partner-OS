// Internal Space Page
// Wrapper that provides SpaceContext for /internal route

import { SpaceProvider } from '@/contexts/SpaceContext';
import { HomeRenderer } from '@/components/shared/HomeRenderer';

export default function InternalPage() {
  return (
    <SpaceProvider>
      <HomeRenderer />
    </SpaceProvider>
  );
}
