// Reusable chip/multi-select component
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChipOption {
  id: string;
  label: string;
}

interface ChipSelectProps {
  options: readonly ChipOption[] | ChipOption[];
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxSelect?: number;
  className?: string;
}

export function ChipSelect({
  options,
  selected,
  onChange,
  multiple = false,
  maxSelect,
  className,
}: ChipSelectProps) {
  const selectedArray = Array.isArray(selected) ? selected : [selected];

  const handleClick = (id: string) => {
    if (multiple) {
      const currentSelected = selectedArray;
      if (currentSelected.includes(id)) {
        // Remove
        onChange(currentSelected.filter((s) => s !== id));
      } else {
        // Add (check max)
        if (maxSelect && currentSelected.length >= maxSelect) {
          return; // At max, can't add more
        }
        onChange([...currentSelected, id]);
      }
    } else {
      // Single select
      onChange(id);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selectedArray.includes(option.id);
        const isDisabled = !isSelected && maxSelect && selectedArray.length >= maxSelect;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => handleClick(option.id)}
            disabled={isDisabled}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border transition-all duration-200',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary/50',
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSelected && multiple && <Check className="w-3.5 h-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
