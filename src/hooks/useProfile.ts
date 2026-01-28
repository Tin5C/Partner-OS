// Hook for managing user profile state
import { useState, useEffect, useCallback } from 'react';
import { useExperience } from '@/contexts/ExperienceContext';
import {
  UserProfile,
  DEFAULT_PROFILE,
  getStoredProfile,
  saveProfile,
  calculateProfileCompleteness,
  hasSkillsSelected,
} from '@/lib/profileConfig';

// Key for tracking if user has completed or skipped onboarding
function getOnboardingKey(tenantSlug: string, audience: string): string {
  return `onboarding_completed_${audience}_${tenantSlug}`;
}

export function useProfile() {
  const { tenantSlug, audience } = useExperience();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const stored = getStoredProfile(tenantSlug, audience);
    const onboardingKey = getOnboardingKey(tenantSlug, audience);
    const hasCompletedOnboarding = localStorage.getItem(onboardingKey) === 'true';
    
    setProfile(stored);
    // Show onboarding if no profile exists and hasn't been completed/skipped
    setNeedsOnboarding(!stored && !hasCompletedOnboarding);
    setIsLoaded(true);
  }, [tenantSlug, audience]);

  // Save profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...(prev || DEFAULT_PROFILE), ...updates };
      saveProfile(tenantSlug, audience, updated);
      return updated;
    });
  }, [tenantSlug, audience]);

  // Initialize profile with defaults
  const initializeProfile = useCallback(() => {
    const newProfile = { ...DEFAULT_PROFILE };
    saveProfile(tenantSlug, audience, newProfile);
    setProfile(newProfile);
    return newProfile;
  }, [tenantSlug, audience]);

  // Full save
  const saveFullProfile = useCallback((fullProfile: UserProfile) => {
    saveProfile(tenantSlug, audience, fullProfile);
    setProfile(fullProfile);
  }, [tenantSlug, audience]);

  // Mark onboarding as complete (called after save or skip)
  const completeOnboarding = useCallback(() => {
    const onboardingKey = getOnboardingKey(tenantSlug, audience);
    localStorage.setItem(onboardingKey, 'true');
    setNeedsOnboarding(false);
  }, [tenantSlug, audience]);

  const completeness = calculateProfileCompleteness(profile);
  const hasSkills = hasSkillsSelected(profile);
  const isProfileComplete = completeness === 100;

  return {
    profile,
    isLoaded,
    completeness,
    hasSkills,
    isProfileComplete,
    needsOnboarding,
    updateProfile,
    initializeProfile,
    saveFullProfile,
    completeOnboarding,
  };
}
