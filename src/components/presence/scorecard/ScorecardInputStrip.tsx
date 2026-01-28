import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw } from 'lucide-react';
import { ScorecardInput, REGIONS, INDUSTRIES } from '@/lib/presenceScorecardData';

interface ScorecardInputStripProps {
  input: ScorecardInput;
  onChange: (input: ScorecardInput) => void;
  onRunScan: () => void;
  onReset: () => void;
  isScanning?: boolean;
}

export function ScorecardInputStrip({ 
  input, 
  onChange, 
  onRunScan, 
  onReset,
  isScanning 
}: ScorecardInputStripProps) {
  const updateField = (field: keyof ScorecardInput, value: string) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Input Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Person name</Label>
          <Input
            value={input.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Full name"
            className="h-9 text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Employer</Label>
          <Input
            value={input.employer}
            onChange={(e) => updateField('employer', e.target.value)}
            placeholder="Company"
            className="h-9 text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Title</Label>
          <Input
            value={input.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Job title"
            className="h-9 text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Region</Label>
          <Select value={input.region} onValueChange={(v) => updateField('region', v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Industry</Label>
          <Select value={input.industry} onValueChange={(v) => updateField('industry', v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Product focus</Label>
          <Input
            value={input.productFocus}
            onChange={(e) => updateField('productFocus', e.target.value)}
            placeholder="Area of focus"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Actions + Disclaimer */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          MVP: results are mock data for UI preview.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={onRunScan}
            disabled={isScanning}
            className="h-8 text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run scan
          </Button>
        </div>
      </div>
    </div>
  );
}
