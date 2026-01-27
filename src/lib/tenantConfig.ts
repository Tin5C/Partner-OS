// Tenant Configuration for Multi-Tenant Portal
// This file defines all tenants (partners + internal users) and their content packs

export type TenantType = 'partner' | 'internal';

export interface TenantPack {
  id: string;
  enabled: boolean;
  order: number;
}

export interface TenantConfig {
  slug: string;
  displayName: string;
  tenantType: TenantType;
  password: string; // MVP: simple password auth
  themeAccent?: string; // optional for future theming
  packs: {
    stories: boolean;
    topFocus: boolean;
    competitiveRadar: boolean;
    industrySignals: boolean;
    objectionHandling: boolean;
    skillOfWeek: boolean;
    marketPresence: boolean;
    preMeetingPrep: boolean; // internal only typically
  };
}

// Partner tenants
export const partnerTenants: Record<string, TenantConfig> = {
  'partner-a': {
    slug: 'partner-a',
    displayName: 'Partner A',
    tenantType: 'partner',
    password: 'partnera2025',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: true,
      objectionHandling: true,
      skillOfWeek: true,
      marketPresence: false,
      preMeetingPrep: false,
    },
  },
  'partner-b': {
    slug: 'partner-b',
    displayName: 'Partner B',
    tenantType: 'partner',
    password: 'partnerb2025',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: true,
      objectionHandling: true,
      skillOfWeek: true,
      marketPresence: false,
      preMeetingPrep: false,
    },
  },
  'partner-c': {
    slug: 'partner-c',
    displayName: 'Partner C',
    tenantType: 'partner',
    password: 'partnerc2025',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: false,
      objectionHandling: true,
      skillOfWeek: false,
      marketPresence: false,
      preMeetingPrep: false,
    },
  },
};

// Internal user tenants
export const internalTenants: Record<string, TenantConfig> = {
  'daniel': {
    slug: 'daniel',
    displayName: 'Daniel Schaffhauser',
    tenantType: 'internal',
    password: 'daniel123',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: true,
      objectionHandling: true,
      skillOfWeek: true,
      marketPresence: true,
      preMeetingPrep: true,
    },
  },
  'thore': {
    slug: 'thore',
    displayName: 'Thore Michelsen',
    tenantType: 'internal',
    password: 'thore123',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: true,
      objectionHandling: true,
      skillOfWeek: true,
      marketPresence: true,
      preMeetingPrep: true,
    },
  },
  'sarah': {
    slug: 'sarah',
    displayName: 'Sarah Johnson',
    tenantType: 'internal',
    password: 'sarah123',
    packs: {
      stories: true,
      topFocus: true,
      competitiveRadar: true,
      industrySignals: true,
      objectionHandling: true,
      skillOfWeek: true,
      marketPresence: true,
      preMeetingPrep: true,
    },
  },
};

// Combined lookup
export const allTenants: Record<string, TenantConfig> = {
  ...partnerTenants,
  ...internalTenants,
};

// Helper to get tenant by slug and type
export function getTenantConfig(slug: string, type: 'partner' | 'internal'): TenantConfig | null {
  if (type === 'partner') {
    return partnerTenants[slug] || null;
  }
  return internalTenants[slug] || null;
}

// Get all partners for selector
export function getPartnerList(): { slug: string; displayName: string }[] {
  return Object.values(partnerTenants).map(t => ({
    slug: t.slug,
    displayName: t.displayName,
  }));
}

// Get all internal users for selector
export function getInternalUserList(): { slug: string; displayName: string }[] {
  return Object.values(internalTenants).map(t => ({
    slug: t.slug,
    displayName: t.displayName,
  }));
}

// Validate password for a tenant
export function validateTenantPassword(slug: string, type: 'partner' | 'internal', password: string): boolean {
  const config = getTenantConfig(slug, type);
  if (!config) return false;
  return config.password === password;
}

// Storage keys for tenant access
export function getTenantStorageKey(slug: string, type: 'partner' | 'internal'): string {
  return `tenant_access_${type}_${slug}`;
}

// Check if tenant is unlocked
export function isTenantUnlocked(slug: string, type: 'partner' | 'internal'): boolean {
  const key = getTenantStorageKey(slug, type);
  return localStorage.getItem(key) === 'unlocked';
}

// Unlock tenant
export function unlockTenant(slug: string, type: 'partner' | 'internal'): void {
  const key = getTenantStorageKey(slug, type);
  localStorage.setItem(key, 'unlocked');
}

// Lock tenant (for logout/switch)
export function lockTenant(slug: string, type: 'partner' | 'internal'): void {
  const key = getTenantStorageKey(slug, type);
  localStorage.removeItem(key);
}

// Clear all tenant access
export function clearAllTenantAccess(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('tenant_access_'));
  keys.forEach(k => localStorage.removeItem(k));
}
