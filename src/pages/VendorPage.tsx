// Vendor Space Page
// Wrapper that provides SpaceContext + VendorDataProvider for /vendor route

import { SpaceProvider } from '@/contexts/SpaceContext';
import { VendorDataProviderWrapper } from '@/contexts/VendorDataContext';
import { VendorHomeRenderer } from '@/components/vendor/VendorHomeRenderer';

export default function VendorPage() {
  return (
    <SpaceProvider>
      <VendorDataProviderWrapper demoMode={true}>
        <VendorHomeRenderer />
      </VendorDataProviderWrapper>
    </SpaceProvider>
  );
}
