import { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  AudienceType,
  ExperienceConfig,
  getExperienceConfig,
  getPackWithOverrides,
  PackDefinition,
} from '@/config/experienceConfig';
import { getTenantContent, PackContent } from '@/config/contentModel';
import { getTenantConfig, isTenantUnlocked, validateTenantPassword, unlockTenant, TenantConfig } from '@/lib/tenantConfig';
import { useWeekSelection, formatLocalDate } from '@/hooks/useWeekSelection';

// Experience Context
interface ExperienceContextValue {
  audience: AudienceType;
  tenantSlug: string;
  tenantConfig: TenantConfig | null;
  experienceConfig: ExperienceConfig;
  weekKey: string;
  isUnlocked: boolean;
  unlock: (password: string) => boolean;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider');
  }
  return context;
}

// Experience Provider
interface ExperienceProviderProps {
  children: React.ReactNode;
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const location = useLocation();
  const { selectedWeekStart } = useWeekSelection();
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Derive audience from URL path
  const audienceType: AudienceType = location.pathname.startsWith('/partner') ? 'partner' : 'seller';
  
  // Map to tenant type for config lookup
  const tenantType = audienceType === 'partner' ? 'partner' : 'internal';
  
  // Get tenant config
  const tenantConfig = tenantSlug ? getTenantConfig(tenantSlug, tenantType) : null;
  
  // Get experience config
  const experienceConfig = getExperienceConfig(audienceType);
  
  // Week key for content
  const weekKey = formatLocalDate(selectedWeekStart);

  // Check unlock status on mount and when deps change
  useEffect(() => {
    if (tenantSlug) {
      setIsUnlocked(isTenantUnlocked(tenantSlug, tenantType));
    }
  }, [tenantSlug, tenantType]);

  const unlock = (password: string): boolean => {
    if (!tenantSlug) return false;
    const valid = validateTenantPassword(tenantSlug, tenantType, password);
    if (valid) {
      unlockTenant(tenantSlug, tenantType);
      setIsUnlocked(true);
    }
    return valid;
  };

  const value: ExperienceContextValue = {
    audience: audienceType,
    tenantSlug: tenantSlug || '',
    tenantConfig,
    experienceConfig,
    weekKey,
    isUnlocked,
    unlock,
  };

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

// Hook to get packs for current experience
export function useExperiencePacks() {
  const { experienceConfig, tenantSlug, weekKey } = useExperience();

  const packs = useMemo(() => {
    const result: Record<string, PackDefinition[]> = {};
    
    experienceConfig.sections.forEach((section) => {
      result[section.id] = section.packs
        .map((packId) => getPackWithOverrides(experienceConfig, packId))
        .filter((pack): pack is PackDefinition => pack !== null);
    });

    return result;
  }, [experienceConfig]);

  return packs;
}

// Hook to get content for a specific pack
export function usePackContent(packId: string): PackContent | null {
  const { tenantSlug, weekKey } = useExperience();
  
  return useMemo(() => {
    const tenantContent = getTenantContent(tenantSlug);
    return tenantContent[weekKey]?.[packId] || null;
  }, [tenantSlug, weekKey, packId]);
}
