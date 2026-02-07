// Vendor Logo — enterprise-grade logo with initial fallback
// Used in Approved Vendors list and Package detail views

import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VendorLogo as VendorLogoType } from '@/data/partnerVendors';
import { useState } from 'react';

interface VendorLogoProps {
  logo?: VendorLogoType;
  vendorName: string;
  size?: 'sm' | 'md';
  className?: string;
}

// Deterministic color from vendor name for initial avatar
const INITIAL_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
];

function getInitialColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIAL_COLORS[Math.abs(hash) % INITIAL_COLORS.length];
}

function getInitials(name: string): string {
  // Strip parenthetical suffixes, e.g. "Anthropic (Claude)" → "Anthropic"
  const clean = name.replace(/\s*\(.*\)/, '').trim();
  const words = clean.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const SIZE_MAP = {
  sm: 'w-5 h-5 text-[8px]',
  md: 'w-6 h-6 text-[9px]',
};

export function VendorLogo({ logo, vendorName, size = 'sm', className }: VendorLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const sizeClass = SIZE_MAP[size];

  // Show image if logo.src exists and hasn't failed
  if (logo?.src && !imgFailed) {
    return (
      <div className={cn('rounded flex-shrink-0 overflow-hidden', sizeClass, className)}>
        <img
          src={logo.src}
          alt={logo.alt}
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: colored initial avatar
  const colorClass = getInitialColor(vendorName);
  const initials = getInitials(vendorName);

  return (
    <div
      className={cn(
        'rounded flex-shrink-0 flex items-center justify-center font-semibold leading-none',
        sizeClass,
        colorClass,
        className,
      )}
      title={vendorName}
    >
      {initials}
    </div>
  );
}
