// Partner Space Page
// Wrapper that provides SpaceContext + FocusDataProvider for /partner route

import { SpaceProvider } from '@/contexts/SpaceContext';
import { FocusDataProviderWrapper } from '@/contexts/FocusDataContext';
import { HomeRenderer } from '@/components/shared/HomeRenderer';
import { partnerDemoMode } from '@/config/spaces/partner';

export default function PartnerPage() {
  return (
    <SpaceProvider>
      <FocusDataProviderWrapper demoMode={partnerDemoMode}>
        <HomeRenderer />
      </FocusDataProviderWrapper>
    </SpaceProvider>
  );
}
