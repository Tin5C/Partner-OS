// Vendor Identity — enterprise-grade logo container with icon fallback
// Used in Approved Vendors list and Package detail views
// NEVER renders letter initials — uses a neutral vendor glyph as fallback

import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VendorLogo as VendorLogoType } from '@/data/partnerVendors';
import { useState } from 'react';

interface VendorLogoProps {
  logo?: VendorLogoType;
  vendorName: string;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'w-5 h-5', icon: 'w-3 h-3', padding: 'p-0.5' },
  md: { container: 'w-6 h-6', icon: 'w-3.5 h-3.5', padding: 'p-[3px]' },
};

export function VendorLogo({ logo, vendorName, size = 'sm', className }: VendorLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const s = SIZE_MAP[size];

  const containerBase = cn(
    'rounded-[4px] flex-shrink-0 overflow-hidden bg-muted/60 border border-border/40',
    s.container,
    className,
  );

  // Show image if logo.src exists and hasn't failed
  if (logo?.src && !imgFailed) {
    return (
      <div className={cn(containerBase, s.padding)} title={vendorName}>
        <img
          src={logo.src}
          alt={logo.alt}
          className="w-full h-full object-contain grayscale-[30%] opacity-90"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: neutral vendor glyph icon — no letters
  return (
    <div
      className={cn(containerBase, 'flex items-center justify-center')}
      title={vendorName}
    >
      <Box className={cn(s.icon, 'text-muted-foreground/60')} />
    </div>
  );
}
