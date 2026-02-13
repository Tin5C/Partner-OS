import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = true,
  variant = 'primary',
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isSecondary = variant === 'secondary';

  return (
    <section className="space-y-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors select-none',
          isSecondary
            ? 'bg-muted/40 hover:bg-muted/60'
            : 'bg-primary/[0.04] hover:bg-primary/[0.07]'
        )}
      >
        <div className="text-left">
          <h2 className={cn(
            'font-semibold text-foreground leading-tight',
            isSecondary ? 'text-[15px]' : 'text-lg'
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn(
              'text-muted-foreground mt-0.5',
              isSecondary ? 'text-[11px]' : 'text-xs'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && <div className="pt-3">{children}</div>}
    </section>
  );
}
