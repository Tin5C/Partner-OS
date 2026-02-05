// Capability & Brand Snapshot Card
// Entry point card for Partner homepage

import { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CapabilitySnapshotModal } from './CapabilitySnapshotModal';

interface CapabilitySnapshotCardProps {
  className?: string;
}

export function CapabilitySnapshotCard({ className }: CapabilitySnapshotCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          "flex items-start gap-4 p-4 rounded-xl text-left w-full",
          "bg-card border border-border",
          "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
          "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
          "hover:border-border/80",
          "transition-all duration-200",
          className
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          "bg-muted/50"
        )}>
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            Capability & Brand Snapshot
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            Build pricing power with the right capability signals.
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      </button>

      <CapabilitySnapshotModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
