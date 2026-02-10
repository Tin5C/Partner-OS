// Space Configs Barrel Export
export * from './types';
export { internalConfig } from './internal';
export { partnerConfig } from './partner';
export { vendorConfig } from './vendor';

import { SpaceConfig, SpaceType } from './types';
import { internalConfig } from './internal';
import { partnerConfig } from './partner';
import { vendorConfig } from './vendor';

// Get config by space type
export function getSpaceConfigByType(spaceType: SpaceType): SpaceConfig {
  if (spaceType === 'internal') return internalConfig;
  if (spaceType === 'vendor') return vendorConfig;
  return partnerConfig;
}
