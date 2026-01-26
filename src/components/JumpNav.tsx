import { cn } from '@/lib/utils';

interface JumpNavItem {
  id: string;
  label: string;
}

interface JumpNavProps {
  items: JumpNavItem[];
  activeId?: string;
  className?: string;
}

export function JumpNav({ items, activeId, className }: JumpNavProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-center gap-1 p-1 rounded-xl bg-secondary/50 border border-border',
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
            'hover:bg-card hover:shadow-chip',
            activeId === item.id 
              ? 'bg-card text-foreground shadow-chip' 
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
