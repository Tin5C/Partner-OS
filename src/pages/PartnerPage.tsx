// Partner Space Page
// Wrapper that provides SpaceContext + PartnerDataProvider for /partner route

import { SpaceProvider } from '@/contexts/SpaceContext';
import { PartnerDataProviderWrapper } from '@/contexts/FocusDataContext';
import { HomeRenderer } from '@/components/shared/HomeRenderer';
import { partnerDemoMode } from '@/config/spaces/partner';

export default function PartnerPage() {
  return (
    <SpaceProvider>
      <PartnerDataProviderWrapper demoMode={partnerDemoMode}>
        <HomeRenderer />
      </PartnerDataProviderWrapper>
    </SpaceProvider>
  );
}
