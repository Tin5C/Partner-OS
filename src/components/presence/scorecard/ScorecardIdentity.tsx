import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { IdentityStatus } from '@/lib/presenceScorecardData';

interface ScorecardIdentityProps {
  status: IdentityStatus;
  dataNeeded?: string;
  onTogglePreview?: (status: IdentityStatus) => void;
  showToggle?: boolean;
}

export function ScorecardIdentity({ 
  status, 
  dataNeeded, 
  onTogglePreview,
  showToggle = true 
}: ScorecardIdentityProps) {
  const isConfirmed = status === 'confirmed';

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            isConfirmed ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}>
            {isConfirmed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Identity confirmation</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                isConfirmed 
                  ? "bg-emerald-500/10 text-emerald-700" 
                  : "bg-amber-500/10 text-amber-700"
              )}>
                {isConfirmed ? 'Confirmed' : 'Ambiguous'}
              </span>
            </div>
            {!isConfirmed && dataNeeded && (
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium text-amber-600">DATA NEEDED:</span> {dataNeeded}
              </p>
            )}
          </div>
        </div>

        {/* Preview Toggle */}
        {showToggle && onTogglePreview && (
          <div className="flex items-center gap-2">
            <Label className="text-[10px] text-muted-foreground">Preview state</Label>
            <Switch
              checked={isConfirmed}
              onCheckedChange={(checked) => onTogglePreview(checked ? 'confirmed' : 'ambiguous')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
