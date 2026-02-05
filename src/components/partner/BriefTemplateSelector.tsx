// Brief Template Selector (Partner-only)
// Shows a non-interactive pill when only 1 template is available
// Shows a dropdown when >1 templates are available

import { FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BriefTemplateId, BriefTemplateDefinition } from '@/data/briefTemplates';

interface BriefTemplateSelectorProps {
  value: BriefTemplateId;
  onChange: (value: BriefTemplateId) => void;
  availableTemplates: BriefTemplateDefinition[];
}

export function BriefTemplateSelector({
  value,
  onChange,
  availableTemplates,
}: BriefTemplateSelectorProps) {
  const current = availableTemplates.find((t) => t.id === value);

  // Single template: show as non-interactive pill
  if (availableTemplates.length <= 1) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
        <FileText className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">
          Brief type: {current?.label || 'AI Deal Brief'}
        </span>
      </div>
    );
  }

  // Multiple templates: dropdown
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Brief type</span>
      <Select value={value} onValueChange={(v) => onChange(v as BriefTemplateId)}>
        <SelectTrigger className="w-auto min-w-[180px] h-8 bg-background border-border text-sm gap-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border z-50">
          {availableTemplates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div>
                <p className="text-sm font-medium">{template.label}</p>
                <p className="text-xs text-muted-foreground">{template.shortDescription}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
