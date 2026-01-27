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
  const variantStyles = {
    primary: 'text-foreground',
    secondary: 'text-foreground',
    tertiary: 'text-foreground',
  };

  const variantBadgeStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    tertiary: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  };

  return (
    <div className={cn(section.centered && 'flex flex-col items-center', className)}>
      {/* Section Header */}
      <div id={`group-${section.id}`} className="mb-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
            variantBadgeStyles[section.variant]
          )}>
            {section.title}
          </span>
          {section.description && (
            <span className="text-sm text-muted-foreground">
              {section.description}
            </span>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-4',
        section.centered && 'w-full max-w-2xl'
      )}>
        {packs.map((pack) => {
          // Check if there's a custom card renderer for this pack
          const customCard = renderCustomCard?.(pack.id);
          if (customCard) {
            return <div key={pack.id}>{customCard}</div>;
          }

          return (
            <PackCard
              key={pack.id}
              pack={pack}
              onPrimaryAction={() => onPackPrimaryAction(pack.id)}
              onSecondaryAction={() => onPackSecondaryAction(pack.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
