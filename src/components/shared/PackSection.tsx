import { cn } from '@/lib/utils';
import { SectionDefinition, PackDefinition } from '@/config/experienceConfig';
import { PackCard } from './PackCard';

interface PackSectionProps {
  section: SectionDefinition;
  packs: PackDefinition[];
  onPackPrimaryAction: (packId: string) => void;
  onPackSecondaryAction: (packId: string) => void;
  renderCustomCard?: (packId: string) => React.ReactNode;
  className?: string;
}

export function PackSection({
  section,
  packs,
  onPackPrimaryAction,
  onPackSecondaryAction,
  renderCustomCard,
  className,
}: PackSectionProps) {
  // Visual distinction by section variant
  const sectionStyles = {
    primary: {
      badge: 'bg-primary/10 text-primary border border-primary/20',
      container: '',
    },
    secondary: {
      badge: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
      container: '',
    },
    tertiary: {
      badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
      container: '',
    },
  };

  const styles = sectionStyles[section.variant];

  return (
    <section className={cn('relative', className)}>
      {/* Section Header - Enterprise styling */}
      <header id={`group-${section.id}`} className="mb-5">
        <div className="flex items-baseline gap-3">
          <span className={cn(
            'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider',
            styles.badge
          )}>
            {section.title}
          </span>
          {section.description && (
            <span className="text-sm text-muted-foreground font-medium">
              {section.description}
            </span>
          )}
        </div>
      </header>

      {/* Cards Grid - Enterprise 2-column with consistent sizing */}
      <div className={cn(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
        'justify-items-stretch'
      )}>
        {packs.map((pack) => {
          // Check if there's a custom card renderer for this pack
          const customCard = renderCustomCard?.(pack.id);
          if (customCard) {
            return (
              <div key={pack.id} className="w-full">
                {customCard}
              </div>
            );
          }

          return (
            <PackCard
              key={pack.id}
              pack={pack}
              onPrimaryAction={() => onPackPrimaryAction(pack.id)}
              onSecondaryAction={() => onPackSecondaryAction(pack.id)}
              className="w-full"
            />
          );
        })}
      </div>
    </section>
  );
}
