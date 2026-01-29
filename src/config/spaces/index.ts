// Space Configs Barrel Export
export * from './types';
export { internalConfig } from './internal';
export { partnerConfig } from './partner';

import { SpaceConfig, SpaceType } from './types';
import { internalConfig } from './internal';
import { partnerConfig } from './partner';

// Get config by space type
export function getSpaceConfigByType(spaceType: SpaceType): SpaceConfig {
  return spaceType === 'internal' ? internalConfig : partnerConfig;
}
