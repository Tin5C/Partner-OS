// Searchable multi-select with ability to add custom items
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Search, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelect?: number;
  allowCustom?: boolean;
  customPlaceholder?: string;
  className?: string;
}

export function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Search...',
  maxSelect,
  allowCustom = false,
  customPlaceholder = 'Add custom...',
  className,
}: SearchableMultiSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(opt)
  );

  const canAddMore = !maxSelect || selected.length < maxSelect;
  const showCustomOption =
    allowCustom &&
    search.trim().length > 0 &&
    !options.some((o) => o.toLowerCase() === search.toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === search.toLowerCase());

  const handleSelect = (item: string) => {
    if (!canAddMore) return;
    onChange([...selected, item]);
    setSearch('');
  };

  const handleRemove = (item: string) => {
    onChange(selected.filter((s) => s !== item));
  };

  const handleAddCustom = () => {
    if (!canAddMore || !search.trim()) return;
    const trimmed = search.trim();
    if (!selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setSearch('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary text-primary-foreground"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={canAddMore ? placeholder : `Max ${maxSelect} selected`}
          disabled={!canAddMore}
          className="pl-9"
        />
      </div>

      {/* Dropdown */}
      {isOpen && canAddMore && (filteredOptions.length > 0 || showCustomOption) && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-border bg-card shadow-lg">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors"
            >
              {option}
            </button>
          ))}
          {showCustomOption && (
            <button
              type="button"
              onClick={handleAddCustom}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-primary hover:bg-secondary transition-colors border-t border-border"
            >
              <Plus className="w-4 h-4" />
              Add "{search.trim()}"
            </button>
          )}
        </div>
      )}

      {/* Helper text */}
      {maxSelect && (
        <p className="text-xs text-muted-foreground mt-1">
          {selected.length}/{maxSelect} selected
        </p>
      )}
    </div>
  );
}
